const mongoose = require('mongoose');
require('dotenv').config();

const connection = mongoose.connect(process.env.mongoURL);

module.exports = { connection };

// {
//     "Name":"Jignesh",
//     "Email":"jigsvadiyatar6557@gmail.com",
//     "PhoneNumber":6332927800,
//     "Image":"https://avatars.githubusercontent.com/u/119413894?v=4",
//     "Password":"$2b$05$9CzUhC9BejLIOdMUMFcvweoir2DTg8pn8mxM4bOgXglWNOdPBee3e",
//     "role":"admin"
// }
