import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { JwtTokenSecret } from "../config/environment";

export async function verifyToken( req: Request, res: Response, next: NextFunction ) {
    const token: any = req.headers.authorization;

    verify(token, JwtTokenSecret, async ( err: any, decodificado: any ) => {
        if ( err ) {
            return res.status( 401 ).json({ ok: false, mensaje: 'Existe un problema con el token ', err });
        }

        req.body.user = decodificado;

        next();
    });
}