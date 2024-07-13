import User from "../models/User.js";

const checkIfEmailExist = async (email) => {
  const user = await User.findOne({ email: email });

  return user;
};

export default checkIfEmailExist;
