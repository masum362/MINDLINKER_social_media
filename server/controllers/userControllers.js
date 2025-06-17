import Users from "../model/userSchema.js";
import Verification from "../model/verificationSchema.js";

import { compareStrings, createJwtToken, hashString } from "../utils/index.js";
import passwordReset from "../model/resetPasswordSchema.js";
import { resetPasswordLink } from "../utils/emailVerification.js";
import FriendRequest from "../model/requestSchema.js";
const { app } = process.env;

const verifyUser = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const result = await Verification.findOne({ userId });
    if (result) {
      const { expiresAt, token: hashedToken } = result;
      // token has expires
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            Users.findOneAndDelete({ _id: userId });
          })
          .then(() => {
            const message = "Verification token has expired.";
          })
          .catch((error) => {
            console.log(error);
            return res
              .status(500)
              .json({ message: "Something went wrong!", success: false });
          });
      } else {
        // token validation
        compareStrings(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              Users.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId });
                })
                .then(() => {
                  const message = "User Verification Successfull";
                  return res.status(200).json({ message, success: true });
                  // res.redirect(
                  //   `/users/verified?status=success&message=${message}`
                  // );
                })
                .catch((error) => {
                  console.log(error);
                  const message = "verification failed or link is invalid ";
                  return res.status(404).json({ message, success: false });
                  // res.redirect(
                  //   `/users/verified?status=error&message=${message}`
                  // );
                });
            } else {
              const message = "verification failed or link is invalid ";
              return res.status(404).json(message);
              // res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Something went wrong!" });
            // res.redirect(`/users/verified?status=error&message=`);
          });
      }
    } else {
      const message = "Invalid verification link.please try again later.";
      res.status(404).json(message);
      // res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "Something went wrong!" });
    // res.redirect("/users/verified?status=error&message=");
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const existingRequest = await passwordReset.findOne({ email });
      if (existingRequest) {
        if (existingRequest.expiresAt > Date.now()) {
          return res.status(404).json({
            success: false,
            message: "Reset password link has already been sent by your email.",
          });
        }
        await passwordReset.findOneAndDelete({ email });
      } else {
        await resetPasswordLink(user, res);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // find user
    const user = await Users.findById(userId);

    if (!user) {
      const message = "User not found";
      res.redirect(`/users/resetpassword?status=error&message=${message}`);
      return;
    } else {
      const ResetPass = await passwordReset.findOne({ userId });
      if (!ResetPass) {
        const message = "Invalid password reset link.Try again";
        res.redirect(`/users/resetpassword?status=error&message=${message}`);
        return;
      } else {
        const { expiresAt, token: hashResetToken } = ResetPass;

        if (expiresAt < Date.now()) {
          const message = "Password reset link has expired. Please try again";
          res.redirect(`/users/resetpassword?status=error&message=${message}`);
        } else {
          const isMatch = await compareStrings(token, hashResetToken);
          if (!isMatch) {
            const message = "Invalid password reset link.Try again";
            res.redirect(
              `/users/resetpassword?status=error&message=${message}`
            );
          } else {
            res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
          }
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const hashedPassword = await hashString(password);

    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );

    if (updatedUser) {
      await passwordReset.findOneAndDelete({ userId });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "firstName lastName profession profileUrl -password",
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.password = undefined;

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Auth error",
      success: false,
      error: error.message,
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, location, profileUrl, profession } = req.body;

    if (!(firstName || lastName || location || profileUrl || profession)) {
      return res
        .status(501)
        .json({ message: "Invalid Fields", success: false });
    }
    const { userId } = req.body.user;

    const updateUser = {
      firstName,
      lastName,
      location,
      profileUrl,
      profession,
      _id: userId,
    };

    const user = await Users.findByIdAndUpdate(userId, updateUser, {
      new: true,
    });

    await user.populate({ path: "friends", select: "-password" });

    const token = createJwtToken(user?._id);

    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const friendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: userId,
      requestTo,
      status: "accepted",
    });

    if (requestExist) {
      next("Friend Request already sent!");
      return;
    }

    await FriendRequest.create({
      requestTo,
      requestFrom: userId,
    });
    console.log("succesfully sent friend request");
    return res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getFriendRequest = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const request = await FriendRequest.find({
      requestTo: userId,
      requestStatus: "pending",
    })
      .populate({
        path: "requestFrom",
        select: "firstName lastName  profileUrl  profession  -password",
      })
      .limit(10)
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Auth error", success: false, error: error.message });
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    const { rid, status } = req.body;
    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next("No friend request found.");
      return res
        .status(403)
        .json({ message: "No Friend request found.", success: false });
    } else {
      const newRes = await FriendRequest.findByIdAndUpdate(
        { _id: rid },
        { requestStatus: status }
      );

      if (status === "accepted") {
        const user = await Users.findById(id);
        user.friends.push(newRes?.requestFrom);
        await user.save();

        const friend = await Users.findById(newRes?.requestFrom);
        friend.friends.push(newRes?.requestTo);
        await friend.save();

        return res.status(201).json({
          success: true,
          message: "friend request " + status,
        });
      } else {
        const response = await FriendRequest.deleteMany({
          requestStatus: status,
        });

        console.log(response);
        return res.status(200).json({
          success: true,
          message: "friend request deleted successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Auth error", success: false, error: error.message });
  }
};

const profileViews = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.body;

    if (userId === id) {
      return res.status(200).json({ message: "successfully viewed" });
    } else {
      const user = await Users.findById(id);

      const isViewed = user?.views?.filter((view) => view === userId);

      if (isViewed.length > 0) {
        res.status(201).json({
          success: false,
          message: "Alredy viewed",
        });
      } else {
        user.views.push(userId);
        await user.save();
        return res.status(201).json({
          success: true,
          message: "successfully viewed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Auth error", success: false, error: error.message });
  }
};

const suggestedFriends = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    let queryObject = {};
    let findArr = [];

    const FriendReqests = await FriendRequest.find(
      { $or: [{ requestFrom: userId }, { requestTo: userId }] },
      "requestFrom requestTo -_id"
    );

    FriendReqests.map((item) => {
      if (item.requestFrom == userId) {
        return findArr.push(String(item.requestTo));
      } else {
        return findArr.push(String(item.requestFrom));
      }
    });

    findArr.push(userId);

    let queryResult = await Users.find({
      _id: { $nin: findArr },
      $or: [
        {
          friends: { $nin: userId },
        },
      ],
    })
      .limit(15)
      .select("firstName lastName profileUrl profession -password");

    // const NotInFriendReq = [...queryResult].filter(
    //   (item) => FriendReqests.indexOf(item._id) === -1
    // );

    const suggestedFriends = queryResult;

    return res.status(200).json({
      success: true,
      data: suggestedFriends,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Auth error", success: false, error: error.message });
  }
};

export {
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
  suggestedFriends,
};
