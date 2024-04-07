import Mail from '../modules/mail.module.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UserRepository } from '../services/index.js';
import { generateToken, isValidPassword, createHash } from '../utils.js';

const mailModule= new Mail();

export const register= async (req, res) => {

    res.redirect('/api/session/login');
}

export const login= async (req, res) => {

    res.cookie('cookieUS', req.user.token).redirect('/');
}

export const current= async (req, res) => {

    req.session.destroy(error => { if (error) return res.send('Error al cerrar session') });
    res.clearCookie('cookieUS');

    return res.redirect('/api/session/login')
}

export const githubcallback= (req, res) => {
    res.cookie('cookieUS', req.user.token).redirect('/');
}

export const userId= async (req, res) =>{
    const {user}= req.user;

    res.send({result:user._id})
}

export const sendEmail= async (req,res) => {

    const {email}= req?.params

    const token= generateToken(email);

    const html = `<button><a href="http://localhost:${config.PORT}/api/session/recoverPassword/${token}" >Recuperar contraseña</a></button>`

    await mailModule.send(email, "Restablecer contraseña", html);

}

export const recoverPassword= async (req,res) => {

    const {token}= req?.params;

    if(!token) return res.status(400).send({error:"Token is not correct"});

    let catchError= false

    const result = jwt.verify(token, config.KEY, (error, credentials) => {
        if (error?.message.includes('expired')) {
            catchError = true
        }

        return credentials
    })

    if(catchError == false) res.cookie('active', token, { maxAge: 3600000 }); 

    res.render(catchError == false ? 'recoverPassword' : 'foundEmail',{style: 'index.css'})
}

export const changePassword= async (req,res) =>{

    const {pass}= req?.params;

    const hashPassword= createHash(pass)

    const userReminder = req?.cookies?.active

    const result = jwt.verify(userReminder, config.KEY, (error, credentials) => {
        return credentials
    });

    const userNeeded = await UserRepository.getUserByEmail(result.user);
    const comparative= isValidPassword(userNeeded, pass);

    userNeeded.password= hashPassword

       if(comparative == true){
        return res.send(comparative )
       }

       if(comparative == false){
        await UserRepository.updateUser({ _id: userNeeded._id}, userNeeded)
        res.clearCookie('active');
        return res.send(false)
       }

}




