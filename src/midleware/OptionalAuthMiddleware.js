export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User_model.findOne({
          _id: decoded.id,
          isblocked: false,
          deletedAt: null,
        });
      } catch (err) {
        // accessToken expired → try refresh
        if (err.name === "TokenExpiredError" && refreshToken) {
          try {
            const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User_model.findOne({
              _id: decodedRefresh.id,
              isblocked: false,
              deletedAt: null,
            });

            if (user) {
              const newAccessToken = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
              );

              res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000,
                sameSite: "none",
                secure: true,
              });

              req.user = user;
            } else {
              req.user = null;
            }
          } catch {
            req.user = null; // refresh token invalid
          }
        } else {
          req.user = null;
        }
      }
    } else {
      req.user = null; // guest
    }
  } catch {
    req.user = null;
  }

  next();
};