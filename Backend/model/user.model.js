const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    Name: {
        type: String, 
        required:true
    },
    Email: {
        type: String, 
        unique:true , 
        required:true
    },
    PhoneNumber: {
        type: Number,
        unique:true , 
        required:true
    },
    Image: {
        type: String, 
        required:true
    },
    Password: {
        type: String, 
        required:true
    },
    role :{
        type : String,
        required : true,
        default : "user",
        enum : ["admin", "user"]
    }
},{
    versionKey:false
})

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };

