import express from "express";
import multer from 'multer';
import { login, register } from "../controller/user.js";
import {
  addBlog,
  deleteBlog,
  downloadBlog,
  updateBlog,
  getBlogs,
  getSingleBlog,
  convertCsvToJSON
} from "../controller/blog.js";
import { userAuth } from "../middleware/auth.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getBlogs);
router.get("/blog/:id", getSingleBlog);
router.get("/download-blog", userAuth, downloadBlog);
router.delete("/blog/:id", userAuth, deleteBlog);
router.post("/login", login);
router.post("/register", register);
router.post("/create-blog", userAuth, addBlog);
router.put("/edit", userAuth, updateBlog);
router.post("/convert-csv-to-json", upload.single('csvFile'), convertCsvToJSON)

export default router;

