const mongoose = require("mongoose");

const Categories = new mongoose.Schema({
    name: {type: String, required: [true, 'Please enter name'],},
    decs: {type: String},
}, {
    timestamps: true,
});

module.exports = mongoose.model("categories", Categories);
