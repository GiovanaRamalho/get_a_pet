import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  }
  const decoded = jwt.verify(token, "nossosecret");

  const userId = decoded.id;

  const user = await User.findById({ id: userId });

  return user;
};
export default getUserByToken;
