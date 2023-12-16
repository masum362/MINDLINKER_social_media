import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const hashString = async (userVal) => {
  const salt = await bcrypt.genSalt(10);
  const hashedValue = bcrypt.hash(userVal, salt);
  return hashedValue;
};

export const compareStrings = async (userVal, password) => {
  const isMatch = await bcrypt.compare(userVal, password);
  return isMatch;
};

export const createJwtToken =  (id) => {
  const token =jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  return token
};
