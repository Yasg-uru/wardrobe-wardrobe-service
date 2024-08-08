import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const response = await mongoose.connect(
      "mongodb://127.0.0.1:27017/wardrobe-service"
    );
    // const response = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`data base is connected : ${response.connection.host}`);
  } catch (error) {
    console.log(`error in database connectivity : ${error}`);
    process.exit(1);
  }
};
export default connectDb;
