import mongoose from "mongoose";

const connection = (url) => {
try {
    mongoose.connect(url)
    return console.log('database connection established')
} catch (error) {
    return console.log('database connection error ' + error.message);
}
}

export default connection;