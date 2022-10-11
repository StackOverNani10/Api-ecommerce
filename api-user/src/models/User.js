import { Schema, model } from "mongoose";

const userSchema = new Schema({
    nombreCompleto: {
        type: String,
        require: true
    },
    correo: {
        type: String,
        require: true,
        unique: true
    },
    clave: {
        type: String,
        require: true
    },
    activo: {
        type: Boolean,
        default: true
    }
});

const userModel = model("User", userSchema);

export default userModel;