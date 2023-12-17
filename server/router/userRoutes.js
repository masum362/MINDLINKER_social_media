import express from "express";
import path from "path";
import {
  verifyUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUser,
  updateUser
} from "../controllers/userControllers.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

const __dirname = path.resolve(path.dirname(""));
console.log(__dirname);

// email verification
router.get("/verify/:userId/:token", verifyUser);

// password reset request
router.post("/request-passwordreset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

// user routes
// get user
router.get('/get-user/:id?' ,userAuth ,getUser);
router.put('/update-user' ,userAuth, updateUser);
// update user

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});
router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

export default router;
