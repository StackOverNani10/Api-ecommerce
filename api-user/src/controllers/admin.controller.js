import bcrypt from "bcrypt";
import adminModel from "../models/Admin.js";
import jwt from "jsonwebtoken";
const saltRounds = 10; //cantidad de veces que realiza la encriptacion

export async function registrar (req, res) {

    try {
        const {correo, clave} = req.body;

        if (correo && clave) {
            
            const hashed = await bcrypt.hash (clave, saltRounds); // Encriptar la clave

            const newAdmin = new adminModel({correo, clave: hashed});
            await newAdmin.save();

            res.json({isOk: true, msj: "Admin creado satisfactoria", id: newAdmin._id});
        } else {
            res.json({isOk: false, error: "Faltan datos requeridos"});
        }

    } catch (error) {
        res.json({error});
    }
};

export async function login (req, res) {

    try {
        const {correo, clave} = req.body;

        if (correo && clave) {
            const admin = await adminModel.findOne({correo}); 
            if (!admin) {
                res.json({isOk: false, token: null, msj: "Usuario o contraseña incorrectos"});
            } else {
                const match = await bcrypt.compare(clave, admin.clave);
                if (match) {
                    const {_id, correo} = admin;
                    const option = {
                        expiresIn: '1h'
                    }
                    const token = jwt.sign({_id, correo}, process.env.JWT_SECRET, option);
                    res.json({token});
                } else {
                    //no coincide la clave
                    res.json({isOk: false, token: null, msj: "Usuario o contraseña incorrectos"});
                }
            }
        } else {
            res.json({isOk: false, error: "Faltan datos requeridos"});
        }
    } catch (error) {
        res.json({error});
    }
};