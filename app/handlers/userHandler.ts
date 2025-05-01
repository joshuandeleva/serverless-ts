import { ErrorResponse } from 'app/utility/response'
import { UserService } from '../service/userService'
import { APIGatewayProxyEventV2 } from 'aws-lambda'
import middy from '@middy/core'
import bodyParser from '@middy/http-json-body-parser'
import { container } from 'tsyringe'
import { UserRepository } from 'app/repository/userRepository'
import { conditionalBodyParser } from 'app/utility/requestMiddleware'

// register repository
container.register('UserRepository', { useClass: UserRepository });


// container.register('UserService', { useClass: UserService }); => its already register since we use @inject decorator
// middy parses json requests from body
const service = container.resolve(UserService)

export const SignUp = middy((event: APIGatewayProxyEventV2) => {
    return service.CreateUser(event)
}).use(bodyParser())


export const Login = middy ((event: APIGatewayProxyEventV2) => {
    return service.UserLogin(event)
}).use(bodyParser())

export const Verify = middy((event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if(httpMethod === "post"){
        return  service.VerifyUser(event);
    }else if(httpMethod === "get"){
        return service.getVerificationToken(event);
    }else{
        return service.ResponseWithError(event);
    }
}).use(conditionalBodyParser())
export const Profile = middy ((event: APIGatewayProxyEventV2) => {
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
}).use(conditionalBodyParser())

export const Cart = middy((event: APIGatewayProxyEventV2) => {
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
}).use(conditionalBodyParser())

export const Payment = middy ((event: APIGatewayProxyEventV2) => {
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
}).use(conditionalBodyParser())