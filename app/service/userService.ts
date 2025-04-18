import { UserRepository } from '../repository/userRepository'
import { ErrorResponse, SuccessResponse } from 'app/utility/response'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import { inject, injectable } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import { SignupInput } from 'app/models/dto/SignUp';
import { AppValidation } from 'app/utility/error';
import { GetHashedPassword, GetSalt } from 'app/utility/password';



@injectable()
export class UserService{
    constructor( @inject('UserRepository') private userRepository: UserRepository){ }

    // user creation

    async CreateUser(event:APIGatewayProxyEventV2){
        const input = plainToClass(SignupInput , event.body)
        const error = await AppValidation(input)
        if(error) return ErrorResponse(404 , error)

        const salt  = await GetSalt();
        const hashedpassword = await GetHashedPassword(input.password ,salt) ;
        const data = await this.userRepository.createAccount({
            email:input.email,
            password:hashedpassword,
            userType:'BUYER',
            phone:input.phone,
            salt:salt
        })
        return SuccessResponse(data)
    }

    async UserLogin(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from login user'})
    }

    async VerifyUser(event:APIGatewayProxyEventV2){
        return SuccessResponse({message:'response from verify user'})
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