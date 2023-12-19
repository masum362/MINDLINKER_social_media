import express from "express";
import path from "path";
import {
  verifyUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUser,
  updateUser,
  friendRequest,
  getFriendRequest,
  acceptRequest,
  profileViews,
  suggestedFriends
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
// update user
router.put('/update-user' ,userAuth, updateUser);

// friend request
router.post('/friend-request',userAuth,friendRequest)
router.get('/get-friend-request',userAuth,getFriendRequest)

// accept / deny friend request
router.post('/accept-request',userAuth,acceptRequest)

// view profiile 
router.post('/profile-view',userAuth,profileViews);

// suggested friends
router.get('/suggest-friends',userAuth,suggestedFriends)

router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});
router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

export default router;
