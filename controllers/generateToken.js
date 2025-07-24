
const jwt = require("jsonwebtoken");

exports.accessToken =(user)=> jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

exports.refreshToken =(user)=> jwt.sign(
          {
            userInfo: { 
              id: user._id,
              role: user.role,
            },
          },
          process.env.REFREESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

