import express from "express";
import UserController from "../controllers/UserController.js";
import verifyToken from "../helpers/get-token.js";
import { imageUpload } from "../helpers/image-upload.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/dit/id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);

export default router;
