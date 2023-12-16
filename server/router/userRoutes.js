import express from 'express';
import path from 'path';
import { verifyUser } from '../controllers/userControllers.js';

const router = express.Router();

const __dirname =path.resolve(path.dirname(""))
console.log(__dirname)


router.get('/verify/:userId/:token',verifyUser)
router.get('/verified',(req ,res) => {
    res.sendFile(path.join(__dirname,'./views/build','index.html'));
})


export default router;