import { generateToken } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import UserModel from "./../models/userModel.js";


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let existUser = await UserModel.findOne({ email: email });
        if (!existUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        let passwordConfirm = bcrypt.compare(password, existUser.password);
        if (existUser && passwordConfirm) {
            let token = generateToken({ email: existUser.email, name: existUser.name });
            console.log(existUser);
            res.status(201).json({ dispatch: { name: existUser.name, email: existUser.email, token: token, id: existUser._id } });
            console.log("response done");
        } else {
            res.status(400).json({ response: "invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ response: error.message });
    }
};
export const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const { email, username, password } = req.body;

        let existUser = await UserModel.findOne({ email: email });

        if (existUser) return res.status(409).json({ status: "Email is already registered!" });

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
       
            const userDoc = await UserModel.create({
                email: email,
                name: username,
                password: hashedPassword,
            });
            console.log('registered user',userDoc)
            res.status(201).json({ response: "User Registered Successfully" });
        
    } catch (error) {
        console.log(error.message,'Error Message')
        res.status(500).json({ response: error.message });
    }
};
