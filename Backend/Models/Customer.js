const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required : true
    },

    lastname : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },

    phone : {
        type: Number,
        required: true
    },

    emailref : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Customers", customerSchema)