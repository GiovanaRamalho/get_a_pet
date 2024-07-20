import express from "express";
import PetController from "../controllers/PetController.js";
import verifyToken from "../helpers/verify-token.js";
import { imageUpload } from "../helpers/image-upload.js";

const router = express.Router();

router.get("/", PetController.getAll);
router.get("/mypets", verifyToken, PetController.getAllUserPets);
router.get("/myadoptions", verifyToken, PetController.getAllUsersAdoptions);
router.get("/:id", PetController.getPetById);
router.delete("delete/:id", verifyToken, PetController.removePetById);
router.patch("/schedule/:id", verifyToken, PetController.schedule);
router.patch("/conclude/:id", verifyToken, PetController.concludeAdoption);

router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  PetController.create
);

router.patch(
  "/update/:id",
  verifyToken,
  imageUpload.array("images"),
  PetController.updatePet
);

export default router;
