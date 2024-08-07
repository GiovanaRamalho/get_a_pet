import jwt from "jsonwebtoken";

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "nossosecret"
  );

  res.status(200).json({ message: "loged", token, userId: user._id });
};

export default createUserToken;
