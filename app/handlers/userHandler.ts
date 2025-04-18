import { ErrorResponse } from 'app/utility/response'
import { UserService } from '../service/userService'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import middy from '@middy/core'
import bodyParser from '@middy/http-json-body-parser'
import { container } from 'tsyringe'
import { UserRepository } from 'app/repository/userRepository'

// register repository
container.register('UserRepository', { useClass: UserRepository });


// container.register('UserService', { useClass: UserService }); => its already register since we use @inject decorator
const service = container.resolve(UserService)

export const SignUp = middy((event: APIGatewayProxyEventV2) => {
    return service.CreateUser(event)
}).use(bodyParser())


export const Login = async (event: APIGatewayProxyEventV2) => {
    return service.UserLogin(event)
}

export const Verify = async (event: APIGatewayProxyEventV2) => {
    return service.VerifyUser(event)

}
export const Profile = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase()
    switch(httpMethod){
        case "post":
            return service.CreateProfile(event)
        case "put":
            return service.EditProfile(event)
        case "get":
            return service.GetProfile(event)
        default:
            return ErrorResponse(404 , "requested method is not supported")
    }
}

export const Cart = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase()
    switch(httpMethod){
        case "post":
            return service.CreateCart(event)
        case "put":
            return service.UpdateCart(event)
        case "get":
            return service.GetCart(event)
        default:
            return ErrorResponse(404 , "requested method is not supported")
    }
}

export const Payment = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase()
    switch(httpMethod){
        case "post":
            return service.CreatePaymentMethod(event)
        case "put":
            return service.UpdatePaymentMethod(event)
        case "get":
            return service.GetPaymentMethods(event)
        default:
            return ErrorResponse(404 , "requested method is not supported")
    }
}