import multer from "multer";
import path from "path";

// Configuração do destino e nome do arquivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    // nome único: data-hora + nome original
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });
