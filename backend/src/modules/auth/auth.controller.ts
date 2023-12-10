import {Request, Response} from "express";
import {AuthLoginDto, AuthUserDto} from "./auth.dtos";
import {Errors, ResponseApi, validateError} from "../../config/error_codes";
import {findAuthUserByUsername} from "./auth.gateway";
import {generateToken} from "../../config/jwt";
import {validatePassword} from "../../utils/generalFunctions";


const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const payload = {...req.body} as AuthLoginDto;
        if (!payload.username || !payload.password) throw Error(Errors.INVALID_FIELDS);
        const user = await findAuthUserByUsername(payload.username);
        if (!user) throw Error(Errors.INCORRECT_CREDENTIALS);
        if (!await validatePassword(payload.password, user.password ? user.password : '')) throw Error(Errors.INCORRECT_CREDENTIALS);
        if (!user.status) throw Error(Errors.USER_DISABLED);

        const token = generateToken(user);
        const body: ResponseApi<AuthUserDto> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: {...user, password: undefined}
        }

        return res.status(body.code).json({...body, token});
    } catch (e) {
        const error = validateError(e as Error)
        return res.status(error.code).json(error)
    }
}


export {
    login
}