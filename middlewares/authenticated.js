

const {decodedToken} = require('../utils/jwt');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

//middleware que verifica si el usuário está autenticado
function asureAuth(req,res,next){
    const token = req.headers.authorization
    //console.log(token);
    if(!token){
        return res.status(403).send({message:"No hay token de autorizacion"});
    }

    try {
        //el payload es el objeto que se envio al momento de crear el token
        const payload = decodedToken(token);
        // el exp es el tiempo de expiracion del token
        const {exp} = payload;
        //console.log(exp);
        const exp_mode_date = new Date(exp);
        const format_date = exp_mode_date.toLocaleString();
        console.log(format_date);
        const now = new Date().getTime();
        //si el token ya expiro
        if(now >= exp){
            return res.status(403).send({message:"Token expirado"});
        }
        //si el token no expiro y es valido lo guardamos en el request
        req.user = payload;
        next();

    } catch (error) {
        return res.status(401).send({message:"Token invalido"});
    }



}


const tokenClient = (req,res,next) => {
    const token_client = req.headers.authorization;
    if(!token_client){
        return res.status(403).send({message:"No hay token de autorizacion"});
    }
    next();
}

const tokTom = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(403).send({message:"No hay token de autorizacion"});
    }else if (token !== process.env.TOKEN_TOM){
        return res.status(403).send({message:"Token invalido"});
    }
    next();
}


module.exports = {
    asureAuth,
    tokenClient,
    tokTom
}