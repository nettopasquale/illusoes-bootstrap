import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouters from "./routes/user.routes.js";

dotenv.config();

const app = express();
console.log(process.env.PORT);


let corsOptions = {
  origin: "http://localhost:5137"
};

//middlewere
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//conexão MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectado ao MongoDB!");
} catch (erro) {
  console.error("Erro na conexão com o MongoDB!", erro);
  process.exit(1);
}


app.use("/", userRouters);

app.use((req, res, next) => {
  console.log("rota acessada: ", req.method, req.originalUrl);
  next();
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
