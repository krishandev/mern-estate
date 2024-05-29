import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://img.freepik.com/premium-vector/young-man-avatar-character_24877-9475.jpg?w=740"
    },

}, {timestamps:true});

const User=mongoose.model('User', userSchema);
export default User;