import express from "express";
import {} from "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import PetRoutes from "./routes/PetRoutes.js";

const app = express();
const router = express.Router();

router.use("/users", UserRoutes);
router.use("/pets", PetRoutes);

app.use(router);
app.use(express.json());
app.use(express.static("public"));

/*resolver o problema do cors, esse problema(renderizar o mesmo DOM) 
acontece quando tenho o back e fron no mesmo servidor!*/
app.use(cors({ credentials: true, origin: "http://localhots:3000s" }));

async function main() {
  try {
    await mongoose.connect(process.env.GOLDEN_MONGODB_URI);

    console.log("connected in  database!");
  } catch (error) {
    console.log("error in database: ", error);
  }

  app.listen(process.env.PORT, () => {
    console.log("app listen in port: ", process.env.PORT);
  });
}

try {
  main();
} catch (error) {
  console.log(error);
}
