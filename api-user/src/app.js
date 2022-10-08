import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import conexionDB from "./db.conexion.js";
import routerUser from "./routes/user.routes.js";
import routerAdmin from "./routes/admin.routes.js";
const app = express()
dotenv.config();

//Conexion a la DB
conexionDB();

//settings
app.set("name", "Api User");
app.set("port", process.env.port || 3500);

//middleware
app.use(express.json());
app.use(morgan("dev"));

//llamado de rutas
app.use(express.static("public"));
app.use("/api/usuario", routerUser);
app.use("/api/admin", routerAdmin);

//vsd
export default app;