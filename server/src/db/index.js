import mongoose from "mongoose";

async function connectToDB(){
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/taskninja`
    );

    console.log(
      "MongoDB connected :: DB Host :: ",
      connection.connections[0].host
    );
  } catch (error) {
    console.log("Error in connectToDB :: ", error);
    process.exit(1);
  }
};

export default connectToDB;

