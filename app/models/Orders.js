const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const Orders = new mongoose.Schema({
    user: {
        _id: {type: ObjectId, required: true, ref: 'users'},
        name: {type: String, required: [true, 'Please add your name']},
        phone: {type: String, required: [true, 'Please add phone number']},
        address: {
            city: {type: String, required: [true, 'Please add your address']},
            district: {type: String, required: [true, 'Please add your address']},
            ward: {type: String, required: [true, 'Please add your address']},
            street: {type: String, required: [true, 'Please add your address']}
        },
    },
    foods: [{
        _id: {type: ObjectId, required: true, ref: 'foods'},
        name: {type: String},
        image: {type: String},
        price: {type: Number},
        slug: {type: String},
        category: {type: ObjectId, ref: 'categories'},
        quantity: {type: Number}
    }],
    shippingCost: {type: Number},
    foodTotalPrice: {type: Number},
    totalPrice: {type: Number},
    //to-ship: wait to prepare food, to-receive: in delivery, completed, cancel
    status: {type: String, enum: ['to-ship', 'to-receive', 'completed', 'cancel'], default: 'to-ship'},
    statusHistory: [{
        status: {type: String, enum: ['to-ship', 'to-receive', 'completed', 'cancel']},
        note: {type: String},
        date: {type: Date, default: new Date()}

    }],
    orderDate: {type: Date, default: new Date()}
}, {
    timestamps: true,
})

module.exports = mongoose.model("orders", Orders);
