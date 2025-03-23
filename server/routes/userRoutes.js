import express from 'express';
import { registerUser, loginUser } from '../controllers/userController'; 

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;

//localhost:4000/api/users/register
//localhost:4000/api/users/login