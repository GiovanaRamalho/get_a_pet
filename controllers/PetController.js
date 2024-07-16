import Pet from "../models/Pet.js";
import getToken from "../helpers/get-token.js";
import getUserByToken from "../helpers/get-user-by-token.js";

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
};
