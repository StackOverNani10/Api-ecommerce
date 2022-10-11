import bcrypt from "bcrypt";
import userModel from "../models/User.js";
import jwt from "jsonwebtoken";
const saltRounds = 10; //cantidad de veces que realiza la encriptacion

export async function crearCuenta (req, res) {

    try {
        const { nombre, apellido, correo, clave, confirmaClave } = req.body;

        if (clave == confirmaClave) {
            // Encriptar la clave
            const hashed = await bcrypt.hash (clave, saltRounds);

            //Creacion de usuario
            if (nombre && apellido && correo && clave && confirmaClave) {
                const newUser = new userModel({ nombre, apellido, correo, clave: hashed });
                await newUser.save();

                res.json({ isOk: true, msj: "Usuario almacenado de forma satisfactoria", id: newUser._id });
            } else {
                res.json({ isOk: false, msj: "Faltan datos requeridos" });
            }
        } else {
            //Envia msg de error
            res.json({isOk: false, msj: "La contraseña y su confirmación no coinciden"});
        }
    } catch (error) {
        res.json(error);
    }
};

export async function obtenerCuenta (req, res) {
    try {
        //Buscar usuario activo
        const userData = await userModel.find({activo:true});
        res.json(userData);
    } catch (error) {
        res.json(error);
    }
};

export async function actualizarCuenta (req, res) {
    try {
        const id = req.params.id;
        const { nombre, apellido, correo } = req.body;

        if (id) {
            //Buscar data de usuario por id
            await userModel.updateOne({ _id: id }, { $set: { nombre, apellido, correo } });
            res.json({isOk: true, msj: "Registro actualizado de forma satisfactoria"});
        } else {
            res.json({isOk: false, msj: "Datos insuficientes"});
        } 
    } catch (error) {
        res.json(error);
    } 
};

export async function eliminarCuenta (req, res) {
    try {
        const id = req.params.id;
        //Actualizar campo activo al eliminar
        const eliminated = await userModel.findByIdAndUpdate(id, {activo: false});
        res.status(200).json({isOk: true, msj: "Datos borrados de forma satisfactoria"});
    } catch (error) {
        res.status(500).json(error);
    }
};

export async function login (req, res) {
    try {
        const { correo, clave } = req.body;

        if (correo && clave) {
            // Encontrar usuario por correo insertado
            const user = await userModel.findOne({correo}); 
            if (!user) {
                res.json({isOk: false, token: null, msj: "Usuario o contraseña incorrectos"});
            } else {
                const match = await bcrypt.compare(clave, user.clave); // Comparamos la clave insertada con la almacenada
                if (match) {
                    const {_id, correo} = user;
                    const option = {
                        expiresIn: '1h'
                    }
                    const token = jwt.sign({_id, correo}, process.env.JWT_SECRET, option); // Creamo el token
                    res.json({isOk: true, token, msj: "Usuario loggeado de manera satisfactoria"});
                } else {
                    //no coincide la clave
                    res.json({isOk: false, token: null, msj: "Usuario o contraseña incorrectos"});
                }
            }
        } else {
            res.json({isOk: false, error: "Faltan datos requeridos"});
        }
    } catch (error) {
        res.json(error);
    }
};

export async function actualizarContraseña (req, res) {
    try {
        const id = req.params.id;
        const { oldPassword, newPassword } = req.body;

        if (id && oldPassword && newPassword) {
            //Buscar usuario por id
            const user = await userModel.findOne({id});
            // Comparamos la clave insertada con la almacenada
            const match = await bcrypt.compare(oldPassword, user.clave);
            if (!match) {
                res.json({isOk: false, msj: "Check your old password"});
            } else {
                // Encriptar la clave
                const hashedPassword = await bcrypt.hash (newPassword, saltRounds);
                // Cambiamos la clave antigua por la nueva
                await userModel.findOneAndUpdate({clave: hashedPassword});
                res.json({isOk: true, msj: "Contraseña actualizada de forma satisfactoria"});
            }
        } else {
            res.json({isOk: false, msj: "Datos insuficientes"});
        } 
    } catch (error) {
        res.json(error);
    } 
};

export async function verificarToken (req, res) {
    // Consultar token en el header
    const strToken = req.headers.authorization;

    if (!strToken) {
        return res.json({msj: "No se encontró el Token"});
    }

    try {
        const token = strToken.split(" ")[1];// Separar palabra bearer del token
        const llave = jwt.verify(token, process.env.JWT_SECRET); // Verificar autentizidad del token
        const user = await userModel.findById(llave._id); // Buscar usuario de acuerdo al id recibido en el token

        if (!user) {
            return res.json({msj: "Usuario no encontrado"});
        }
        res.json(user);
    } catch (error) {
        res.json(error);
    }
};