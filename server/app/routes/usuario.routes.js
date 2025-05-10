module.exports = app => {
  const usuarios = require("../controllers/usuario.controller.js");

  var router = require("express").Router();

  // Create a new Usuario
  router.post("/", usuarios.create);

  // Retrieve all Usuarios
  router.get("/", usuarios.findAll);

  // Retrieve a single Usuario with id
  router.get("/:id", usuarios.findById);

  // Update Usuario with id
  router.put("/:id", usuarios.update);

  // Delete Usuario with id
  router.delete("/:id", usuarios.delete);

  app.use("/api/usuarios", router);
};
