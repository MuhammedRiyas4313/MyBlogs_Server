import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            min: 5,
            required: true,
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
