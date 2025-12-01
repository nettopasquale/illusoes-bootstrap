import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path"; //imagens locais
import { fileURLToPath } from "url"; //imagens locais
import userRouters from "./routes/user.routes.js";
import conteudoRouters from "./routes/conteudo.route.js";
import colecaoRouters from "./routes/colecao.routes.js";
import marketplaceRouters from "./routes/marketplace.routes.js";
import userProfileRouters from "./routes/userProfile.router.js";
import forumRouters from "./routes/forum.routes.js";
import forumTopicoRouters from "./routes/forumTopico.routes.js";
import forumPostRouters from "./routes/forumPost.routes.js";
import { criarConteudo } from "./controllers/conteudo.controller.js";
import { uploadThumb } from "./uploads/upload.js";

const app = express();
console.log(process.env.PORT);

let corsPermitidos = [
  "http://localhost:5173", //React FrontEnd
  "http://localhost:8080", // Server local (teste)
  "https://illusoes-bootstrap.onrender.com", // server Render
  "https://illusoes-bootstrap.vercel.app" //Produção
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
app.use(express.urlencoded({ limit: '200mb', extended: true }));

//conexão MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Conectado ao MongoDB!");
} catch (erro) {
  console.error("Erro na conexão com o MongoDB!", erro);
  process.exit(1);
}
// Para servir a pasta 'uploads' de forma pública:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//rota de upar imagem
app.post('/upload', uploadThumb.single('thumbs'), (req, res) => {
  console.log(req.file); // aqui estará o arquivo enviado
  res.send('Imagem recebida com sucesso!');
});

app.use((error, req, res, next) => {
  console.log('This is the rejected field ->', error.field);
});


//rotas do app
app.use("/", conteudoRouters);
app.use("/", userRouters);
app.use("/", userProfileRouters);
app.use("/", colecaoRouters);
app.use("/", marketplaceRouters);
app.use("/", forumRouters);
app.use("/", forumTopicoRouters);
app.use("/", forumPostRouters);


app.use((req, res, next) => {
  console.log("rota acessada: ", req.method, req.originalUrl);
  next();
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
