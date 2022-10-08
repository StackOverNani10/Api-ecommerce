import * as ctrAdmin from "../controllers/admin.controller.js";
import { Router } from "express";

const routerAdmin = Router();

routerAdmin.post("/registrar", ctrAdmin.registrar);

routerAdmin.post("/login", ctrAdmin.login);

export default routerAdmin;