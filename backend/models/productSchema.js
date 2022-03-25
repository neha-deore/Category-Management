import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({

    product_name: {
        type: String,
    },
    product_image: {
        type: Array,
        required: true
    },
    product_desc: {
        type: String,
    },

    product_cost: {
        type: Number,
    },

    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subCategory"
    }

})
export default mongoose.model("products", productSchema)