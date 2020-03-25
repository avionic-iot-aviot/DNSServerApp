const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

export default class AuthHelper {
    constructor() { }

    generateHash = (password: string) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    };

    validPassword = (password: string, encrPassword: string) => {
        return bcrypt.compareSync(password, encrPassword);
    };

    generateToken = (user_id: string, user_email: string, role_name: number) => {
        const payload = { id: user_id, email: user_email, role_name };
        return jwt.sign(payload, config.jwt.jwtSecret, { expiresIn: config.jwt.expiresIn });
    };

    generateResetPasswordToken = (user_id: string, email: string) => {
        const payload = { id: user_id, email: email };
        return jwt.sign(payload, config.jwt.jwtSecret, { expiresIn: config.jwt.expiresIn });
    };

    decodeToken = (token: string) => {
        return jwt.decode(token);
    }

}