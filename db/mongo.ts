import mongoose from "mongoose";

let isConnected = false;

export const connectToMongoDB = async () => {
    mongoose.set('strictQuery', true);

    if(isConnected){
        console.log("MongoDB is already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL as string, {

        });
        isConnected = true;
        console.log("MongoDB is now connected");
    } catch (e: any) {
        console.log(`Error connecting to Mongo DB. Error: ${e.message}`);
    }
}