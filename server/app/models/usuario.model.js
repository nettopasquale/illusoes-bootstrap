export default mongoose => {
  let schema = mongoose.Schema(
    {
      nome: { type: String, unique: true },
      email: String,
      senha: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Usuario = mongoose.model("usuario", schema);
  return Usuario;
};
