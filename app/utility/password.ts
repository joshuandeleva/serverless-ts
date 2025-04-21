import { UserModel } from 'app/models/UserModel';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const APP_SECRET="B/gMue+molY21/+/j3MUeC5YxbeGtcuCgTiTEFIKFGtuPPEZrZncfOdC4mbzaxQ8pSKsmXYM32bzlKAfECAh5g=="

export const GetSalt = async () => {
    return await bcrypt.genSalt()
}
export const GetHashedPassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}
export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GetHashedPassword(enteredPassword, salt) === savedPassword
}
export const getToken = ({email , user_id , phone , userType}:UserModel) =>{
    return jwt.sign({
        user_id ,
        email ,
        phone,
        userType
    }, APP_SECRET,{expiresIn:"1hr"})

}
export const verifyToken = async (token: string): Promise<UserModel | false> => {
    try {
        if (token !== "") {
            const payload = await jwt.verify(token.split(" ")[1], APP_SECRET)
            return payload as UserModel
        }
        return false
    } catch (error) {
        console.log(error , 'Error verifying token')
        return false
    }
}