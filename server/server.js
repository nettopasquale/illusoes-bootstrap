import express, { json, urlencoded } from "express";
import { mongoose as _mongoose, url } from "./app/models";
import { set } from "mongoose";
import cors from "cors";
import("./app/routes/usuario.routes").default(app);

const app = express();
const env = import.meta.env.VITE_API_URL;

set('strictQuery', false);

let corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));


_mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado na database!");
  })
  .catch(err => {
    console.log("Não foi possível conectar na database!", err);
    env.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: req + " Welcome to bezkoder application. " });
});



// set port, listen for requests
const PORT = env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});