const mongoose = require("mongoose")


mongoose.connect("mongodb+srv://psaruna748:aQH3wHrSPNNCbn3B@cluster0.hzs68mc.mongodb.net/?retryWrites=true&w=majority").then(res=>{
    console.log("Connected to database")
}).catch(err=>{
    console.log("Failed to connect DB")
})
