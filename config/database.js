import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({
    path: '../config/.env'
});

const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Database connected');
    }).catch((error) => {
        console.log('Error connecting to database', error);
    });
}

export default databaseConnection;