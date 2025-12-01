import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Envia um arquivo para o Firebase Storage em uma subpasta organizada
 * @param {File} file - arquivo vindo do input
 * @param {string} folder - pasta ('thumbs', 'imagens', etc)
 * @param {string} prefix - opcional: para identificar o conteúdo
 */
export const uploadToFirebase = async (file, folder, prefix = "") => {
  if (!file) return null;

  const filename = `${prefix}${Date.now()}-${file.name}`;
  const fileRef = ref(storage, `conteudos/${folder}/${filename}`);

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
};
