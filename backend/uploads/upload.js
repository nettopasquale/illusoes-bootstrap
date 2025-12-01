import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garante que a pasta existe
function ensureFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}


// Configuração do destino e nome do arquivo
const storageThumb = multer.diskStorage({
  destination: (req, file, cb) => {
    // const dir = path.join('uploads/', path.dirname(file.originalname));

    // fs.mkdirSync(dir, { recursive: true });
    cb(null, "uploads/thumbs/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const storageMulti = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, "..", "uploads", "imagens");

    ensureFolder(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const uploadThumb = multer({
  storage: storageThumb
});

export const uploadMulti = multer({
  storage: storageMulti
});

