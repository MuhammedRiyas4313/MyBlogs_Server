import express from "express";
import { login, register } from "../controller/user.js";
import {
  addBlog,
  deleteBlog,
  downloadBlog,
  updateBlog,
  getBlogs,
  getSingleBlog,
} from "../controller/blog.js";
import { userAuth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", getBlogs);
router.get("/blog/:id", getSingleBlog);
router.get("/download-blog", userAuth, downloadBlog);
router.delete("/blog/:id", userAuth, deleteBlog);
router.post("/login", login);
router.post("/register", register);
router.post("/create-blog", userAuth, addBlog);
router.put("/edit", userAuth, updateBlog);

export default router;
