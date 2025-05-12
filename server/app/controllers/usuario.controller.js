import db from "../models";
const Usuario = db.usuarios;

// Create and Save a new Usuario
export function create(req, res) {
  console.log('**** EXPORT.CREATE ******');
  // Validate request
  if (!req.body.nome) {
    res.status(400).send({ message: "O Conteúdo não pode ser vazio!" });
    return;
  }

  // Create a Usuario
  const usuario = new Usuario({
    nome: req.body.nome,
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
          err.message || "Ocorreu um erro ao criar o Usuario."
      });
    });
}

// Retrieve all Usuarios from the database.
export function findAll(req, res) {
  const nome = req.query.nome;
  let condition = nome ? { nome: { $regex: new RegExp(nome), $options: "i" } } : {};

  Usuario.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocorreu um erro ao pegar os usuarios."
      });
    });
}

// Find a single Usuario with an id
export function findById(req, res) {
  console.log('**** EXPORT.FIND-ONE ******');
  const id = req.params.id;

  Usuario.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Não foi encontrado o usuario com o id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: err + "Ocorreu um erro ao buscar o Usuario com o id=" + id });
    });
}

// Update a Usuario by the id in the request
export function update(req, res) {
  console.log('**** EXPORT.UPDATE ******');
  if (!req.body) {
    return res.status(400).send({
      message: "Os dados não podem ser vazios!"
    });
  }

  const id = req.params.id;

  Usuario.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Não foi possível atualizar o usuário com o id=${id}. Talvez o usuário não exista!`
        });
      } else res.send({ message: "Usuario foi atualizado com sucesso." });
    })
    .catch(err => {
      res.status(500).send({
        message: err + "Erro ao atualizar o usuario com o id=" + id
      });
    });
}

// Delete a Usuario with the specified id in the request
const _delete = (req, res) => {
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
export { _delete as delete };

