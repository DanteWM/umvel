import { Router, Request, Response, response } from 'express';
import UserService from '../controladoras/user';
import { IResponse } from '../interfaces/response';

const userRoutes = Router();
const userService = new UserService;

userRoutes.get('/', async( req: Request, res: Response ) => {
    await userService.listUsers(( response: IResponse ) => {
        return res.status( response.codigo ).json(response);
    });
});

userRoutes.post('/login', async( req: Request, res: Response ) => {
    const { email } = req.body;
    const { password } = req.body;

    await userService.loginUser( email, password, ( response: IResponse ) => {
        return res.status( response.codigo ).json( response );
    });
});

userRoutes.post('/create', async( req: Request, res: Response ) => {
    const { user } = req.body;

    await userService.createUser( user, ( response: IResponse ) => {
        return res.status( response.codigo ).json( response );
    })
})

export default userRoutes;