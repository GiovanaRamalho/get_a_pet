import Pet from "../models/Pet.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import { isValidObjectId } from "mongoose";

export default {
  create: async (req, res) => {
    const { name, age, weight, color } = req.body;
    const available = true;
    const images = req.files;

    if (!name) {
      res.status(422).json({ message: "name is mandatory" });
      return;
    }
    if (!age) {
      res.status(422).json({ message: "age is mandatory" });
      return;
    }
    if (!weight) {
      res.status(422).json({ message: "weight is mandatory" });
      return;
    }
    if (!color) {
      res.status(422).json({ message: "color is mandatory" });
      return;
    }

    if (images.length === 0) {
      res.status(422).json({ message: "images is mandatory" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "pet successfully registered", newPet });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  getAll: async (req, res) => {
    const pets = await Pet.find().sort("+createdAt");

    res.status(200).json({ pets: pets });
  },

  getAllUserPets: async (req, res) => {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("+createdAt");

    res.status(200).json({ pets });
  },

  getAllUsersAdoptions: async (req, res) => {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": adopter._id }).sort(
      "+createdAt"
    );
  },

  getPetById: async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      res.status(422).json({ message: "ID invalid" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "pet not found!" });
    }

    res.status(200).json({ pet: pet });
  },

  removePetById: async (req, res) => {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      res.status(422).json({ message: "ID invalid" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "pet not found!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: "We had a problem with your request" });
      return;
    }

    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: "successfully removed" });
  },

  updatePet: async (req, res) => {
    const id = req.params.id;
    const { name, age, weight, color, available } = req.body;
    const images = req.files;
    const updatedData = {};

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "pet not found!" });
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: "We had a problem with your request" });
      return;
    }

    if (!name) {
      res.status(422).json({ message: "name is mandatory" });
      return;
    } else {
      updatedData.name = name;
    }

    if (!age) {
      res.status(422).json({ message: "age is mandatory" });
      return;
    } else {
      updatedData.age = age;
    }

    if (!weight) {
      res.status(422).json({ message: "weight is mandatory" });
      return;
    } else {
      updatedData.weight = weight;
    }

    if (!color) {
      res.status(422).json({ message: "color is mandatory" });
      return;
    } else {
      updatedData.color = color;
    }

    if (images.length === 0) {
      res.status(422).json({ message: "images is mandatory" });
      return;
    } else {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updatedData);

    res.status(200).json({ message: "pet updated successfully" });
  },
};
