import mongoose, { Schema } from "mongoose";

const verificatonSchema = mongoose.Schema({
    userId:{type:Schema.Types.ObjectId, ref:"Users"},
    token:String,
    createdAt:Date,
    expiresAt:Date,
})

const Verification = mongoose.model('Verification',verificatonSchema);

export default Verification;