import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  console.log("authenctication checked");
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    // next("Authentication Failed ");
    return res.status(401).json({ message: "Authentication Failed" });
  }

  const token = authHeader?.split(" ")[1];

  console.log({ token });
  
  try {
    if (!token) {
      // next("Invalid User!");
      return res.status(404).json({ messag: " Invalid User!" });
    } else {
      const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      console.log(userToken);

      req.body.user = {
        userId: userToken.userId,
      };

      next();
    }
  } catch (error) {
    console.log(error);
    // next("Authentication failed ");
    return res.status(401).send({ messag: "Authentication failed" });
  }
};

export default userAuth;
