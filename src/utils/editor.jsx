import { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill2-image-uploader";

Quill.register(Quill.register(
  {
    'modules/imageUploader': ImageUploader,
  },
  true,
))

export const quill = new Quill('#editor', {
  // ...
  modules: {
    // ...
      imageUploader: {
        upload: async (file) => {
          try {
              const formData = new FormData()
              formData.append('image', file)
              const imageUrl = await uploadImage(formData)
              return imageUrl
          } catch (error) {
            console.log(error)
          }
        },
        loadingClass: 'uploading-image', // default 'quill-image-uploading'
      },
  },
})

