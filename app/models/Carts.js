const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const CartItem = new mongoose.Schema({
    user: {type: ObjectId, required: true, ref: 'users'},
    food: {type: ObjectId, required: true, ref: 'foods'},
    quantity: {type: Number, default: 1}
}, {
    timestamps: true,
})

module.exports = mongoose.model("carts", CartItem);
