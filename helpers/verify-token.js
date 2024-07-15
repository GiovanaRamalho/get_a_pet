import jwt from "jsonwebtoken";
import getToken from "./get-token";

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Access denied!" });
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  }

  try {
    const verified = jwt.verify(token, "nossosecret");

    req.user = verified;

    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token!" });
  }
};
