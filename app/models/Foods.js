const mongoose = require("mongoose");
const slugify = require('slugify')

const Foods = new mongoose.Schema({
    name: {type: String, required: true},
    desc: {type: String},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    size: [{type: String}],
    slug: {type: String, default: function(){
        return slugify(`${this.name}-${this._id.toString().slice(-5)}`, { lower: true, locale: 'vi', trim: true })
    }},
}, {
    timestamps: true,
});

module.exports = mongoose.model("foods", Foods);
