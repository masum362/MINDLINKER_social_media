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

console.log({ firstName, lastName, email, password } )

  if (!(firstName, lastName, email, password)) {
    next("Field Value required!");
    return;
  }

  try {
    const existUser = await Users.findOne({ email });
    if (existUser) {
      next("User already exists");
      return;
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
      next("please provide user credentials");
      return;
    } else {
      // find user by email

      const user = await Users.findOne({ email }).select("+password").populate({
        path: "friends",
        select: "firstName lastName profession profileUrl -password",
      });

      if (!user) {
        next("Invalid User!");
        return;
      } else if (!user?.verified) {
        next(
          "User not verified. check your email account and verify your email"
        );
        return;
      } else {
        //   compare password
        const isMatch = await compareStrings(password, user?.password);
        if (!isMatch) {
          next("invalid user!");
          return;
        }

        user.password = undefined;
        const token = createJwtToken(user?._id);

        res.status(201).json({
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
