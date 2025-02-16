import {registerUser,loginUser, userCredits, placeOrderStripe, verifyStripe} from '../controllers/userController.js'
import express from 'express'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/credits',userAuth,userCredits)
userRouter.post('/pay-stripe',userAuth,placeOrderStripe)
userRouter.post('/verifyStripe',verifyStripe)

export default userRouter
