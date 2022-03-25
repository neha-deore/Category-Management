import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String
    },

    subCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
    },]

});

export default mongoose.model('category', categorySchema)


