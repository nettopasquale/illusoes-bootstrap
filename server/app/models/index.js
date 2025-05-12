import { url } from "../config/db.config.js";
import mongoose from "mongoose";

const db = {};
db.mongoose = mongoose;
db.url = url;
db.usuarios = import("./usuario.model.js").default(mongoose);

export default db;
