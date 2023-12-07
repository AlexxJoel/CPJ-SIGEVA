import jwt, {JwtPayload} from 'jsonwebtoken';
import env from 'dotenv';
import * as process from 'process';
import bcryptjs from 'bcryptjs';
import {NextFunction, Request, Response} from "express";
import {Errors, validateError} from "./error_codes";

/** Load environment variables */
env.config();
const SECRET_KEY = process.env.SECRET_KEY || 'sigeva';

interface RequestToken extends Request {
    token?: any
}

/** @description Handle Token and encrypt data */

export const generateToken = (payload: object) => {
    // token time 4hrs seconds*minutes*hours
    return jwt.sign(payload, SECRET_KEY, {expiresIn: 60*60*4});
}
export const decodeToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY)
    }catch (e) {
        if (e instanceof jwt.TokenExpiredError) throw Error(Errors.EXPIRED_TOKEN);
        if (e instanceof jwt.JsonWebTokenError) throw Error(Errors.INVALID_TOKEN);
        throw Error('Invalid Token')
    }
}

export const encodeString = async (data: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(data, salt);
}

export const compareEncrypt = async (data: string, dataEncrypt: string): Promise<boolean> => {
    return await bcryptjs.compare(data, dataEncrypt);
}

export const  generateRandomString = ():string => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYZ1234567890';
    for (let i = 0; i < 15; i++) result += characters.charAt(Math.floor(Math.random() *characters.length));
    return result;
}
export const checkAuth = (roles: string[]) => {
    return async (req: RequestToken, res: Response, next: NextFunction) => {
        try {
            // get data user token from header request
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) throw Error(Errors.INVALID_TOKEN);
            const dataToken = decodeToken(token);
            if (!dataToken) throw Error(Errors.EXPIRED_TOKEN);
            req.token = dataToken; // add dataUser to request
            if (roles.length > 0 && !roles.some(role => role === req.token.role)) throw Error(Errors.FORBIDDEN);
            return next();
        } catch (e) {
            const error = validateError(e as Error)
            return res.status(error.code).json(error)
        }
    }
}