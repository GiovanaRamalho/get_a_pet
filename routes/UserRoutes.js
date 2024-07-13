import express from "express";
import UserController from "../controllers/UserController.js";

const router = express.Router();

router.post("/users/register", UserController.register);
/* {
  "name": "Giovana",
  "email": "giovana@gmail.com",
  "phone": "555666",
  "password": "1111",
  "confirmpassword": "1122"
}*/

router.post("/users/login", UserController.login);

router.get("/users/checkuser", UserController.checkUser);

export default router;
