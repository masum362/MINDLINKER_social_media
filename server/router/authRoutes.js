import express from 'express'
import {homePage,login,register} from '../controllers/authController.js'
const router = express.Router();

router.get("/" , homePage);
router.post("/register" , register);
router.post("/login" , login);


export default router;