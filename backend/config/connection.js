import mongoose from "mongoose";

export const connectDatabase = () => {
    mongoose.connect(process.env.URL)
    .then((con) => console.log('Database Connected'))
    .catch((err) => console.log(err))
}