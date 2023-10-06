const authRole = (permittedRoles) =>{
    return (req, res, next) =>{

        if(permittedRoles[0] === "admin"){
            next()
        }
        else{
            return res.status(401).send("Unauthorized Access !!")
        }
    }
}

module.exports = { authRole }