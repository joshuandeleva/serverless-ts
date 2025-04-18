import { UserModel } from 'app/models/UserModel';
import { injectable } from 'tsyringe';
@injectable()
export class UserRepository{
    constructor(){}
    async createAccount({email , password , salt , phone , userType}:UserModel){
        // db operation
    }
}

