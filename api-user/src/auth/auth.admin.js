import adminModel from "../models/Admin.js";
import jwt from "jsonwebtoken";

const autorizarAdmin = async (req, res, next) => {
    const strToken = req.headers.authorization;

    if (!strToken) {
        return res.json({msj: "No se encontró el Token"});
    }
    try {
        const token = strToken.split(" ")[1];
        const llave = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(llave._id);

        if (!admin) {
            return res.json({msj: "Usuario no encontrado"});
        }

    } catch (error) {
        return res.json({error});
    }

    next();
}

export default autorizarAdmin;