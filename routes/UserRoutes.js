import express from "express";
import UserController from "../controllers/UserController.js";
import verifyToken from "../helpers/get-token.js";
import { imageUpload } from "../helpers/image-upload.js";

const router = express.Router();

router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users/checkuser", UserController.checkUser);
router.get("/users/:id", UserController.getUserById);
router.patch(
  "/users/dit/id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);

export default router;
