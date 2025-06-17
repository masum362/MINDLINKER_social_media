import Users from "../model/userSchema.js";
import Verification from "../model/verificationSchema.js";
import { sendVerificationEmail } from "../utils/emailVerification.js";
import { hashString, compareStrings, createJwtToken } from "../utils/index.js";

const homePage = (req, res) => {
  console.log("homepage called");
};
const register = async (req, res, next) => {
  // await Users.deleteMany({})
  // await Verification.deleteMany({})

  const { firstName, lastName, email, password } = req.body;

  console.log({ firstName, lastName, email, password });

  if (!(firstName, lastName, email, password)) {
   
    return res.status(501).json({message:"Invalid Fields",success:false});
  }

  try {
    const existUser = await Users.findOne({ email });

    console.log(existUser);
    if (existUser) {
      return res.status(403).json({message:"User Already Exists",success:false});
    } else {
      const hashedPassword = await hashString(password);

      const user = await Users.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      

      // send verification email
      await sendVerificationEmail(user, res);
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // validation
    if (!email || !password) {
      return res.status(501).json({message:"Invalid Fields",success:false});
    } else {
      // find user by email

      const user = await Users.findOne({ email }).select("+password").populate({
        path: "friends",
        select: "firstName lastName profession profileUrl -password",
      });

      if (!user) {
        return res.status(404).json({ message: "Invalid User!" });
      } else if (!user?.verified) {
        return res.status(404).json({
          message:
            "User not verified. check your email account and verify your email",
        });
      } else {
        //   compare password
        const isMatch = await compareStrings(password, user?.password);
        if (!isMatch) {
          return res.status(404).json({ message: "Invalid User!" });
        }

        user.password = undefined;
        const token = createJwtToken(user?._id);

       return res.status(201).json({
          success: true,
          message: "Login successfully",
          user,
          token,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: error.message });
  }
};

export { homePage, register, login };
