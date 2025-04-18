import { injectable } from 'tsyringe';
@injectable()
export class UserRepository{
    constructor(){}
    async CreateUserOperation(){
        console.log('User created in db')
    }
}

