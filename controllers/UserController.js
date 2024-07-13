import User from "../models/User.js";
import bcrypt from "bcrypt";
import createUserToken from "../helpers/create-user-token.js";
import checkIfEmailExist from "../helpers/check-if-email-exist.js";
import getToken from "../helpers/get-token.js";
import jwt from "jsonwebtoken";

export default {
  register: async (req, res) => {
    const { name, email, phone, password, confirmpassword } = req.body;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatorio" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O email é obrigatorio" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O telefone é obrigatorio" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "O password é obrigatorio" });
      return;
    }
    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "A confirmação de password  é obrigatorio" });
      return;
    }
    if (password !== confirmpassword) {
      res.status(422).json({ message: "Passwords não estão iguais!" });
    }

    const existingUser = await checkIfEmailExist(email);
    if (existingUser) {
      return res.status(422).json({ message: "Email já cadastrado!" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatorio" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "O password é obrigatorio" });
      return;
    }

    const user = await checkIfEmailExist(email);

    if (!user) {
      res.status(422).json({ message: "user do not exist" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "senha invalida!" });
      return;
    }
    await createUserToken(user, req, res);
  },

  checkUser: async (req, res) => {
    let currentUser;

    if (req.headers.autorization) {
      const token = getToken(req);

      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    await res.status(200).send(currentUser);
  },
};
