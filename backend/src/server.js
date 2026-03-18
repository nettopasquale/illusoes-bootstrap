import express from "express";
import cors from "cors";
import dns from "dns";
import mongoose from "mongoose";
import path from "path"; //imagens locais
import { fileURLToPath } from "url"; //imagens locais
import {v2 as cloudinary} from "cloudinary";
import fileUpload from "express-fileupload";
import userRouters from "./routes/user.routes.js";
import conteudoRouters from "./routes/conteudo.route.js";
import colecaoRouters from "./routes/colecao.routes.js";
import marketplaceRouters from "./routes/marketplace.routes.js";
import userProfileRouters from "./routes/userProfile.router.js";
import forumRouters from "./routes/forum.routes.js";
import forumTopicoRouters from "./routes/forumTopico.routes.js";
import forumPostRouters from "./routes/forumPost.routes.js";

// necessário para resolver bug do DNS, a partir do node v24.13.1
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '1.1.1.1']);

//config do cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

//instância do express
const app = express();
console.log(process.env.PORT);


let corsPermitidos = [
  "http://localhost:5173", //React FrontEnd
  "http://localhost:8080", // Server local (teste)
  "https://illusoes-bootstrap.onrender.com", // server Render
  "https://illusoes-bootstrap.vercel.app", //Produção
  "https://api.cloudinary.com",
  "https://api.cloudinary.com/v1_1",
];


let corsOptions = {
   origin: function (origin, callback) {
    if (!origin || corsPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Não permitido pelo Cors"));
    }
  },
  credentials:true
  
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewere
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
//extender limite de 10mb
app.use(express.urlencoded({extended: true }));

//conexão MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectado ao MongoDB!");
} catch (erro) {
  console.error("Erro na conexão com o MongoDB!", erro);
  process.exit(1);
}

//rotas do app
app.use("/", conteudoRouters);
app.use("/", userRouters);
app.use("/", userProfileRouters);
app.use("/", colecaoRouters);
app.use("/", marketplaceRouters);
app.use("/", forumRouters);
app.use("/", forumTopicoRouters);
app.use("/", forumPostRouters);
app.use(fileUpload({useTempFiles: true}));

// Rotas imagens

//rota thumbs

//rota capas(coleções)
app.post('/uploads', function(req, res){
  let capaSample;
  let uploadPath;

  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send("Nenhum arquivo de capa foi enviado");
  }

  //nome do input para a capa
  capaSample = req.files.capa;
  //rota para upar a imagem
  uploadPath = `${__dirname}/capas/${capaSample.name}`

  capaSample.mv(uploadPath, (error)=>{
    if(error) return res.status(500).send(error);

    res.send("Capa enviada com sucesso!")
  })
})


app.use((req, res, next) => {
  console.log("rota acessada: ", req.method, req.originalUrl);
  next();
})

app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error.field);
  console.log("REQ: ", req.method, req.url);
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

console.log("SERVIDOR INICIADO - VERSÃO NOVA");
