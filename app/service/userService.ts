import { UserRepository } from '../repository/userRepository'
import { ErrorResponse, SuccessResponse } from 'app/utility/response'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { inject, injectable } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import { SignupInput } from 'app/models/dto/SignUp';
import { AppValidation } from 'app/utility/error';
import { GetHashedPassword, GetSalt, getToken, ValidatePassword, verifyToken } from 'app/utility/password';
import { LoginInput } from 'app/models/dto/Login';
import { generateAccessCode, sendVerificationCode } from 'app/utility/notification';



@injectable()
export class UserService{
    constructor( @inject('UserRepository') private userRepository: UserRepository){ }

    // user creation

    async CreateUser(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(SignupInput, event.body)
            const error = await AppValidation(input)
            if (error) return ErrorResponse(404, error)

            const salt = await GetSalt();
            const hashedpassword = await GetHashedPassword(input.password, salt);
            const data = await this.userRepository.createAccount({
                email: input.email,
                password: hashedpassword,
                userType: 'BUYER',
                phone: input.phone,
                salt: salt
            })
            if(!data){
                return ErrorResponse(400 , "No user created")
            }
            return SuccessResponse(data);
        } catch(e) {
            console.log(e , 'error occured when creating user')
            return ErrorResponse(500 , e)
        }
    }

    async UserLogin(event:APIGatewayProxyEventV2){
        try {
            const input = plainToClass(LoginInput, event.body)
            const error = await AppValidation(input)
            if (error) return ErrorResponse(404, error)

            const data = await this.userRepository.findAccount(input.email)
            const verified  = await ValidatePassword(input.password ,data.password, data.salt)
            if(!verified){
                throw new Error('Password does not match')
            }
            // generate jwt
            const token = getToken(data)
            return SuccessResponse({token:token});
        } catch(e) {
            console.log(e , 'error occured when creating user')
            return ErrorResponse(500 , e)
        }
    }

    async VerifyUser(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from verify user'})
    }

    async getVerificationToken(event:APIGatewayProxyEventV2){
        try{
            const token = event.headers.authorization
            if(token === "" || !token){
                throw new Error("No token provided")
            }
            const payload = await verifyToken(token)

            if(payload){
                const {code,expiry} = generateAccessCode()

                // save on DB to confirm verification
                const response = await sendVerificationCode(code , payload.phone)
                return SuccessResponse({message:`Verification code is sent to ${payload.phone}`})
            }

        }catch(e){
            return ErrorResponse(500 , e)
        }
       
    }

 
    //user profile

    async CreateProfile(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from create user profile'})
    }

    async EditProfile(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from update user profile'})
    }

    async GetProfile(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from get user profile'})
    }


    // cart

    async CreateCart(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from create cart'})
    }

    async UpdateCart(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from update cart'})
    }

    async GetCart(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from get cart'})
    }

    // payment

    async CreatePaymentMethod(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from create payment'})
    }

    async UpdatePaymentMethod(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from update payment method'})
    }

    async GetPaymentMethods(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from get payment methods'})
    }



}