import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({
    path: '../config/.env'
});

const databaseConnection = () => {
    mongoose.connect("mongodb+srv://Nikita:Nikita%40123@cluster0.oeofn.mongodb.net/voter_info?retryWrites=true&w=majority&appName=Cluster0").then(() => {
        console.log('Database connected');
    }).catch((error) => {
        console.log('Error connecting to database', error);
    });
}

export default databaseConnection;