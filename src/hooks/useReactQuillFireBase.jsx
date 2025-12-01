import { useRef, useCallback } from "react";
import { uploadToFirebase } from "../utils/uploadFirebase";
import axios from "axios";

export const useReactQuillFirebase  = (quillRef) => {
  // handler que o botão de imagem do quill usa
  const handleImageUpload   = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      console.log("Arquivo: ", file);
      if (!file) return;

      try {
        // 1. Enviar para Firebase na pasta "quill"
        const url = await uploadToFirebase(file, "quill");

        // 2. Inserir a imagem no editor
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);

        editor.insertEmbed(range.index, "image", url);
        editor.setSelection(range.index + 1);
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
      }
    };
  }, [quillRef]);

  return {handleImageUpload   };
};
