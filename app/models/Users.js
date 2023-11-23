const mongoose = require("mongoose");

const Users = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique:  [true, 'Email is already exists'],
        validate: [
            {
                validator: function(v){
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
                },
                message: 'Invalid email! format is not correct'
            }
        ]
    },
    phone: {
        type: String,
        validate: [
            {
                validator: function (v) {
                    return /^0\d{9}$/.test(v);
                },
                message: "Invalid phone! Must be 10 digit and start with 0",
            },
        ],
        unique: [true, 'Phone is already exists'],
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
    isVerified: {type: Boolean, default: false},
    otpCode: {type: Number, default: 0},
    isAdmin: {type: Boolean, default: false},
    isShipper: {type: Boolean, default: false}
}, {
    timestamps: true,
});

module.exports = mongoose.model("users", Users);
