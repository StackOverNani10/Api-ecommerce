import mongoose from "mongoose";

const conexionDB = async ()=> {
    try {
        const DB = await mongoose.connect('mongodb+srv://StackOverNani10:'+ process.env.DBPASSWORD +'@e-commerce-apiuser.gkz7ka1.mongodb.net/?retryWrites=true&w=majority');
        console.log("Successful connection to", DB.connection.name);
    } catch (error) {
        console.log(error);
    }
}

export default conexionDB;