import bcrypt from "bcrypt";
import userModel from "../models/User.js";
import jwt from "jsonwebtoken";
import emailRegex from 'email-regex';
import passwordValidator from 'password-validator';
const saltRounds = 10; //cantidad de veces que realiza la encriptacion

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

export async function crearCuenta (req, res) {

    try {
        const { nombreCompleto, correo, clave, confirmaClave } = req.body;
        var validEmail = emailRegex({exact: true}).test(correo); // Validar correo con expresiones regulares 
        var validPassword = schema.validate(clave); // Validar clave con expresiones regulares
        let errors = schema.validate(clave, { details: true }); // Listas de errores de la clave
        if (nombreCompleto && correo && clave && confirmaClave) {
            if (clave == confirmaClave) {
                // Encriptar la clave
                const hashed = await bcrypt.hash (clave, saltRounds);
    
                //Creacion de usuario
                if (validEmail /*&& validPassword*/) {
                    const newUser = new userModel({ nombreCompleto, correo, clave: hashed });
                    await newUser.save();
/*
-------------------------------------------------------------------------------------------Este codigo es temporal
*/
                    const {_id} = newUser;
                    const option = {
                        expiresIn: '1h'
                    }
                    const token = jwt.sign({_id}, process.env.JWT_SECRET, option); // Creamo el token
                    
/*
--------------------------------------------------------------------------------------------Este codigo es temporal
*/

                    res.status(201).json({ isOk: true, msj: `Usuario ${correo} almacenado de forma satisfactoria`, token, id: newUser._id });
                } else {
                    res.status(400).json({ isOk: false, msj: "Ingrese datos validos", errors});
                }
            } else {
                //Envia msg de error
                res.status(400).json({ isOk: false, msj: "La contraseña y su confirmación no coinciden" });
            }
        } else {
            res.status(400).json({ isOk: false, msj: "Faltan datos requeridos" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function obtenerCuenta (req, res) {
    try {
        //Buscar usuario activo
        const userData = await userModel.find({activo:true});
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function actualizarCuenta (req, res) {
    try {
        const id = req.params.id;
        const { nombreCompleto, correo } = req.body;

        if (id) {
            //Buscar data de usuario por id
            await userModel.updateOne({ _id: id }, { $set: { nombreCompleto, correo } });
            res.status(200).json({isOk: true, msj: "Registro actualizado de forma satisfactoria"});
        } else {
            res.status(404).json({isOk: false, msj: "Usuario no encontrado"});
        } 
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
};

export async function eliminarCuenta (req, res) {
    try {
        const id = req.params.id;
        //Actualizar campo activo al eliminar
        const eliminated = await userModel.findByIdAndUpdate(id, {activo: false});
        res.status(200).json({isOk: true, msj: "Datos borrados de forma satisfactoria"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export async function login (req, res) {
    try {
        const { correo, clave } = req.body;

        if (correo && clave) {
            // Encontrar usuario por correo insertado
            const user = await userModel.findOne({correo}); 
            if (!user) {
                res.status(401).json({isOk: false, token: null, msj: "Usuario o contraseña incorrectos"});
            } else {
                const match = await bcrypt.compare(clave, user.clave); // Comparamos la clave insertada con la almacenada
                if (match) {
                    const {_id, correo} = user;
                    const option = {
                        expiresIn: '1h'
                    }
                    const token = jwt.sign({_id, correo}, process.env.JWT_SECRET, option); // Creamo el token
                    res.status(200).json({isOk: true, token, msj: `Usuario ${correo} loggeado de manera satisfactoria`});
                } else {
                    //no coincide la clave
                    res.status(401).json({isOk: false, token: null, msj: "Usuario o contraseña incorrectos"});
                }
            }
        } else {
            res.status(400).json({isOk: false, error: "Faltan datos requeridos"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
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
                res.status(400).json({isOk: false, msj: "Check your old password"});
            } else {
                // Encriptar la clave
                const hashedPassword = await bcrypt.hash (newPassword, saltRounds);
                // Cambiamos la clave antigua por la nueva
                await userModel.findOneAndUpdate({clave: hashedPassword});
                res.status(200).json({isOk: true, msj: "Contraseña actualizada de forma satisfactoria"});
            }
        } else {
            res.status(400).json({isOk: false, msj: "Datos insuficientes"});
        } 
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
};

export async function verificarToken (req, res) {
    // Consultar token en el header
    const strToken = req.headers.authorization;

    if (!strToken) {
        return res.status(404).json({msj: "No se encontró el Token"});
    }

    try {
        const token = strToken.split(" ")[1];// Separar palabra bearer del token
        const llave = jwt.verify(token, process.env.JWT_SECRET); // Verificar autentizidad del token
        const user = await userModel.findById(llave._id); // Buscar usuario de acuerdo al id recibido en el token

        if (!user) {
            return res.status(404).json({msj: "Usuario no encontrado"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};