import { Schema, model } from "mongoose";

const adminSchema = new Schema({

    correo: {
        required: true,
        unique: true,
        type: String
    },
    clave: {
        required: true,
        type: String
    }

});

const adminModel = model("Admin", adminSchema);

export default adminModel;