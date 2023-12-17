import Users from "../model/userSchema.js";
import Verification from "../model/verificationSchema.js";

import { compareStrings, createJwtToken, hashString } from "../utils/index.js";
import passwordReset from "../model/resetPasswordSchema.js";
import { resetPasswordLink } from "../utils/emailVerification.js";

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
            res.redirect(`/users/verified?status=error&message=${message}`);
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?status=error&message=${message}`);
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
                  res.redirect(
                    `/users/verified?status=success&message=${message}`
                  );
                })
                .catch((error) => {
                  console.log(error);
                  console.log(error);
                  const message = "verification failed or link is invalid ";
                  res.redirect(
                    `/users/verified?status=error&message=${message}`
                  );
                });
            } else {
              const message = "verification failed or link is invalid ";
              res.redirect(`/users/verified?status=error&message=${message}`);
            }
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/users/verified?status=error&message=`);
          });
      }
    } else {
      const message = "Invalid verification link.please try again later.";
      res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/users/verified?status=error&message=");
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: "FAILED",
        message: "User not found",
      });
    } else {
      const existingRequest = await passwordReset.findOne({ email });
      if (existingRequest) {
        if (existingRequest.expiresAt > Date.now()) {
          return res.status(404).json({
            success: "FAILED",
            message: "Reset password link has already been sent by your email.",
          });
        }
        await passwordReset.findOneAndDelete({ email });
      } else {
        await resetPasswordLink(user, res);
      }
    }
  } catch (error) {
    console.log(error.message);
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

  console.log({ userId, password });

  try {
    const hashedPassword = await hashString(password);

    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { password: hashedPassword }
    );

    console.log(updatedUser);

    if (updatedUser) {
      await passwordReset.findOneAndDelete({ userId });
      res.status(200).json({ ok: true });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

const getUser = async (req, res,next) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params;

    const user = await Users.findById(id ?? userId).populate({
      path: "friends",
      select: "-password",
    });

    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Auth error",
      success: false,
      error: error.message,
    });
  }
};


const updateUser = async (req, res,next) => {
try{
  const {firstName, lastName,location , profileUrl , profession} = req.body;

  if(!(firstName || lastName || location || profileUrl || profession)){
    next("Please provide all required fields");
    return;
  }
  const {userId} = req.body.user;

  const updateUser = {
    firstName , lastName , location , profileUrl,profession,
    _id:userId
  }

  const user= await Users.findOneAndUpdate(userId , updateUser,{
    new:true
  });

  await user.populate({path:"friends",select:"-password"})

  const token = createJwtToken(user?._id)

  user.password = undefined;
  res.status(200).json({
    success: true,
    message:"User updated successfully",
    user,
    token
  })

}catch (error) {
  console.log(error.message);
  return res.status(404).json({ message: error.message });
}
   
};

export {
  verifyUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getUser,
  updateUser,
};
