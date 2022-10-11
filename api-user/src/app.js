import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import conexionDB from "./db.conexion.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from 'url';
import routerUser from "./routes/user.routes.js";
import routerAdmin from "./routes/admin.routes.js";
const app = express();
dotenv.config();

//Conexion a la DB
conexionDB();

//Swagger
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce Api User",
            version: "1.0.0",
        },
        servers: [
            {
                url: "https://api-user-ecommerce.herokuapp.com",
            },
        ],
    },
    apis: [`${path.join(__dirname, "./doc/swagger-doc.js")}`],
};

//settings
app.set("name", "Api User");
app.set("port", process.env.port || 3500);

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

//llamado de rutas
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce Api User");
});
app.use(express.static("public"));
app.use("/api/usuario", routerUser);
app.use("/api/admin", routerAdmin);

//vsd
export default app;