import { getRepository } from "typeorm";
import { User } from "../entity/user";
import IUser from "../interfaces/user";
import * as encriptar from '../funciones/encriptar';

export default class UserService {
    async createUser( user: IUser, callback: Function ) {
        if ( user.password ) {
            const { salt, passwordHash } = await encriptar.genPassword( user.password );
            user.password = passwordHash;
            user.salt = salt;
        }

        await getRepository(User).create(user).save()
        .then(( userDB ) => {
            userDB.password = ':D';
            userDB.salt = ':D';
            return callback({ ok: true, mensaje: 'Usuario creado con exito', respuesta: userDB, codigo: 200 });
        }).catch((err) => {
            return callback({ ok: false, mensaje: 'Error al crear usuario', respuesta: err, codigo: 500 });
        })
    }

    async loginUser(email: string, password: string, callback: Function ) {
        await getRepository(User).findOne( { email: email } ).then(async( userDB ) => {
            if ( !userDB ) {
                return callback({ ok: false, mensaje: 'No existe este usuario', respuesta: null, codigo: 400 });
            }

            const passwordEncrip = encriptar.sha512(password, userDB.salt);

            if ( userDB.password !== passwordEncrip.passwordHash ) {
                return callback({ ok: false, mensaje: 'Datos incorrectos', respuesta: null, codigo: 401 });
            }

            const userToken = {
                id: userDB.id,
                name: userDB.name,
                email: userDB.email
            }

            const token = await encriptar.generarToken(userToken)
            .catch((err) => { return callback({ ok: false, mensaje: 'Error al generar token', respuesta: err, codigo: 500 })})

            return callback({ ok: true, mensaje: 'Logueado con exito', respuesta: null, token: token,codigo: 200 });
        });
    }

    async listUsers( callback: Function ) {
        await getRepository(User).find({ select: ["id", "name" ,"email" ]}).then((usersDB) => {
            if ( usersDB.length < 1 ) {
                return callback({ ok: false, mensaje: 'No existen usuarios', respuesta: null, codigo: 400 });
            }

            return callback({ ok: true, mensaje: 'Usuarios listados con exito', respuesta: usersDB, codigo: 200 });
        });
    }
}