import { generateToken } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import UserModel from "./../models/userModel.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let existUser = await UserModel.findOne({ email: email });
    if (!existUser) {
      return res.status(404).json({ response: "User not found" });
    }
    let passwordConfirm = await bcrypt.compare(password, existUser.password);
    if (existUser && passwordConfirm) {
      let token = generateToken({
        email: existUser.email,
        name: existUser.name,
      });
      res
        .status(201)
        .json({
          dispatch: {
            name: existUser.name,
            email: existUser.email,
            token: token,
            id: existUser._id,
          },
        });
    } else {
      res.status(400).json({ response: "invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};
export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    let existUser = await UserModel.findOne({ email: email });

    if (existUser)
      return res.status(409).json({ response: "Email is already registered!" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userDoc = await UserModel.create({
      email: email,
      name: username,
      password: hashedPassword,
    });
    res.status(201).json({ response: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};
