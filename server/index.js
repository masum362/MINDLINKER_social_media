import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router/index.js'
import connection from './db/connection.js';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path'

// security packages
import helmet from 'helmet';
import errorMiddleware from './middleware/errorMiddleware.js';


const __dirname = path.resolve(path.dirname(''))
console.log(__dirname)
dotenv.config();


const corsOptions = {
    origin:process.env.NODE_ENV === ' production' ? ['https://mindlinker.netlify.app','http://localhost:5173'] : 'http://localhost:5173',
    creadential:true
}

const app = express();
app.use(express.static(path.join(__dirname, "views/build")));


app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
// erro middleware
app.use(errorMiddleware)


app.use('/',router)


const port = process.env.PORT || 3000;
const uri = process.env.MONGODBURI;
connection(uri)
app.listen(port , (req ,res ) => {
    console.log(`server listening on port ${port}`);
})