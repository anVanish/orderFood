const mongoose = require("mongoose");

const Users = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, "Please enter phone number"],
        validate: [
            {
                validator: function (v) {
                    return /^0\d{9}$/.test(v);
                },
                message: "Invalid phone! Must be 10 digit and start with 0",
            },
        ],
        unique: true,
    },
    password: { type: String, required: [true, "Please enter password"] },
    name: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[\p{L}\p{M}\s.'-]+$/u.test(v);
            },
            message: 'Name is invalid, not contain special character or digit'
        },
    },
    address: {
        city: {type: String},
        district: {type: String},
        ward: {type: String},
        street: {type: String}
    },
    isAdmin: {type: Boolean, default: false},
    isShipper: {type: Boolean, default: false}
});

module.exports = mongoose.model("users", Users);
