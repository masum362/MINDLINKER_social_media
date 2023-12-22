import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Authentication Failed ");
    return
  }

  const token = authHeader?.split(" ")[1];

console.log({token})
  try {
    if (!token) {
      next("Invalid User!");
      return;
    }else{
      const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      console.log(userToken)

      req.body.user = {
        userId: userToken.userId,
        
      };
   
      next();
    }
  } catch (error) {
    console.log(error);
    next("Authentication failed ");
  }
};

export default userAuth;
