const express = require("express")
const app = express();
const mongoose = require("mongoose")
const users = require("./Models/UserAuth")
const customer = require("./Models/Customer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieparser = require("cookie-parser")
const cors = require("cors")

require("./connection")

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true

}
))
app.listen(5000, () => {
    console.log("Server is running at port:5000")
})


// sign Up

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.json({ "msg": "All fields are mandatory" })
    }


    const checkUser = await users.findOne({ email });

    if (checkUser) {
        return res.status(400).json({ "msg": "User already registered with this email address, please try with different email" })
    }

    else {
        const hashpassword = await bcrypt.hash(password, 12)
        const createUser = await users.create({
            username,
            email,
            password: hashpassword
        })

        return res.status(201).json("Registered successfully!")


    }
})



// Login 

app.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.json({ "msg": "All fields are mandatory" })
    }

    const checkExistinguser = await users.findOne({ email })

    if (checkExistinguser && await bcrypt.compare(password, checkExistinguser.password)) {

        const token = jwt.sign({
            useremail: checkExistinguser.email
        }, "ABCD")


        res.status(200).cookie("Token", token).json({ "msg":"Logged in successfully!" })
        console.log(req.cookies)
    }

    else {
        return res.status(400).json({ "msg": "Invalid email or password" })
    }
})


// logout

app.post("/logout", async(req, res)=>{
   const logout = await res.clearCookie("Token");

   
if (logout) {
    return res.status(200).json("Logged out successfully")
}   
else {
    return res.json("Failed to logout")
}
})


// Creae Users

app.post("/customer/createuser", async(req, res)=>{
    const {firstname, lastname, email, phone, emailref} = req.body;

    const token = req.cookies.Token;


    const getEmail = await jwt.verify(token, "ABCD");
    const userEmail = getEmail.useremail;

const createCustomer = await customer.create({
    firstname,
    lastname,
    email,
    phone,
    emailref: userEmail
});

if (createCustomer) {
    return res.json({"msg":"Customer created successfully!"})
}

else{
    return res.json({"msg":"Failed to create customer"})
}

});


// Get Users

app.get("/customer/getusers", async(req, res)=>{

    const token = req.cookies.Token;


    const getEmail = await jwt.verify(token, "ABCD");
    const userEmail = getEmail.useremail;

    const getUsers = await customer.find({emailref:userEmail});

    if (getUsers){
        return res.json({getUsers})
    }

    else {
        return res.json({"msg":"Failed to get users"})
    }
})


// delete user

app.delete("/customer/deleteuser/:id", async(req, res)=>{
    const uid = req.params.id;

    const deleteUser = await customer.findByIdAndDelete(uid)

    if(deleteUser){
        return res.json({"msg":"Customer deleted successfully!"})
    }

    else {
        return res.json({"msg":"Failed to delete customer"})
    }
})

//getParticularuser

app.get("/customer/getuser/:id", async(req, res) =>{
    const uid = req. params.id;

    const getsingleUser = await customer.findOne({_id:uid})

    if(getsingleUser) {
        return res.json(getsingleUser)
    }

    else {
        return res.json({"msg" : "Failed to get User"})
    }
} )

// update user

app.put("/customer/update/:id" , async (req, res) =>{
    const uid = req.params.id;
    const {firstname, lastname, email, phone} = req.body

    const editUser = await customer.findByIdAndUpdate(uid, {firstname, lastname, email, phone});

    if(editUser) {
        return res.json("Updated successfully")
    }

    else {
        res.json("Failed to update details")
    }
})