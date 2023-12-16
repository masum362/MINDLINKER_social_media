import mongoose, { Schema } from "mongoose";


const resetPasswordSchema = new mongoose.Schema({
    userId:{type:Schema.Types.ObjectId, ref:"Users"},
    email:{type:String , unique:true},
    token:String,
    createdAt:Date,
    expiresAt:Date,
    })

    const passwordReset = new mongoose.model("PasswordReset",resetPasswordSchema)