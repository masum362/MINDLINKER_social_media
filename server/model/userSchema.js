import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"firstName is required"],
    },
    lastName:{
        type:String,
        required:[true,"lastName is required"],
    },
    email:{
        type:String , 
        required:[true,"email is required"],
        unique:true
    },
    password:{
    type:String,
    required:[true,"password is required"], 
    minLenght:[8 , "password must be at least 8 characters"],
    select:true,
    },
    location:{type:String},
    profileUrl:{type:String},
    profession:{type:String},
    friends:[
        {type:Schema.Types.ObjectId,ref:"Users"}
    ],
    views:[{type:String}],
    verified:{type:Boolean,default:false},

},
{timestamps:true}
)


const Users  = new mongoose.model('Users',userSchema);

export default Users;