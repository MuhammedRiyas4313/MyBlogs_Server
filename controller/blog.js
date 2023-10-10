import User from "./../models/userModel.js";
import Blog from "./../models/blogModel.js";
import mongoose from "mongoose";
import { Parser } from "json2csv";
import multer from 'multer';
import csvtojson from "csvtojson";
import fs from "fs";


export const getBlogs = async (req, res, next) => {
  console.log("getBlogs");
  try {
    const response = await Blog.find().populate("author");
    console.log(response, "blogs");
    res.status(202).json({ result: response });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};

export const addBlog = async (req, res, next) => {
  try {
    const email = req.user.email;
    const { title, summary, content } = req.body;
    const userId = await User.findOne({ email: email });
    const blogDoc = await Blog.create({
      author: userId._id,
      title: title,
      summary: summary,
      content: content,
    });
    res.status(201).json({ response: "blog created" });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};
export const updateBlog = async (req, res, next) => {
  try {
    const { id, summary, title, content } = req.body;
    let blogId = new mongoose.Types.ObjectId(id);
    const userId = await User.findOne({ email: req.user.email });
    const response = await Blog.updateMany(
      { _id: blogId },
      {
        $set: {
          title: title,
          summary: summary,
          content: content,
          author: userId._id,
        },
      }
    );
    res.status(200).json({ response: "updated" });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};

export const getSingleBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id, "blog id");
    let blogId = new mongoose.Types.ObjectId(id);
    const response = await Blog.findOne({ _id: blogId }).populate("author");
    res.status(202).json({ result: response });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blogId = new mongoose.Types.ObjectId(id);
    const response = await Blog.deleteOne({ _id: blogId });
    res.status(202).json({ response: "blog deleted" });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};

export const downloadBlog = async (req, res, next) => {
  try {
    const userData = await Blog.find({}).populate("author");

    const csvParserData = [];

    userData.forEach((user) => {
      const { id, title, summary, content } = user;
      csvParserData.push({ id, title, summary, content });
    });

    const csvFields = ["Id", "Title", "Summary", "Content"];
    const csvParser = new Parser({ csvFields });
    const csvData = csvParser.parse(csvParserData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attatchment: filename=blogData.csv");
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};

export const convertCsvToJSON = async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
    
        const jsonData = await csvtojson().fromString(req.file.buffer.toString());
    
        res.setHeader("Content-Type", "text/json");
        res.setHeader("Content-Disposition", "attatchment: filename=blogData.json");
        res.send(jsonData);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
};
