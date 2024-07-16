import express from "express";
import PetController from "../controllers/PetController.js";
import verifyToken from "../helpers/verify-token.js";

const router = express.Router();

router.post("/create", verifyToken, PetController.create);

export default router;
