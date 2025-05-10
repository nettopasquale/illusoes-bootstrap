const db = require("../models");
const Usuario = db.usuarios;

// Create and Save a new Usuario
exports.create = (req, res) => {   console.log('**** EXPORT.CREATE ******');
  // Validate request
  if (!req.body.nome) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Usuario
  const usuario = new Usuario({
    nome: req.body.nome,
    grupo: req.body.grupo,
    email: req.body.email,
    senha: req.body.senha
  });

  // Save Usuario in the database
  usuario
    .save(usuario)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Usuario."
      });
    });
};

// Retrieve all Usuarios from the database.
exports.findAll = (req, res) => {
  const nome = req.query.nome;
  var condition = nome ? { nome: { $regex: new RegExp(nome), $options: "i" } } : {};

  Usuario.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving usuarios."
      });
    });
};

// Find a single Usuario with an id
exports.findById = (req, res) => {  console.log('**** EXPORT.FIND-ONE ******');
  const id = req.params.id;

  Usuario.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Usuario with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: err + "Error retrieving Usuario with id=" + id });
    });
};

// Update a Usuario by the id in the request
exports.update = (req, res) => { console.log('**** EXPORT.UPDATE ******');
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Usuario.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Usuario with id=${id}. Maybe Usuario was not found!`
        });
      } else res.send({ message: "Usuario was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: err + "Error updating Usuario with id=" + id
      });
    });
};

// Delete a Usuario with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Usuario.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Usuario with id=${id}. Maybe Usuario was not found!`
        });
      } else {
        res.send({
          message: "Usuario was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err + "Could not delete Usuario with id=" + id
      });
    });
};

