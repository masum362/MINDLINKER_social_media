import Users from "../model/userSchema.js";
import Verification from "../model/verificationSchema.js";
import { compareStrings } from "../utils/index.js";

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
    }else{
        const message = "Invalid verification link.please try again later.";
        res.redirect(`/users/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/users/verified?status=error&message=")
  }
};

export { verifyUser };
