import * as ctrUser from "../controllers/user.controller.js";
import { Router } from "express";
import autorizarAdmin from "../auth/auth.admin.js";

const routerUser = Router();

routerUser.post("/", ctrUser.crearCuenta);

routerUser.get("/", ctrUser.obtenerCuenta);

routerUser.put("/:id", ctrUser.actualizarCuenta);

routerUser.delete("/:id", ctrUser.eliminarCuenta);

routerUser.post("/login", ctrUser.login);

routerUser.put("/changePassword/:id", ctrUser.actualizarContraseña);

export default routerUser;