import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === "") {
      return res
        .status(500)
        .json({ success: false, message: "JWT Secret is not configured" });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecoded || !tokenDecoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.userId = tokenDecoded.id;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired" });
    }

    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;
