import { UserModel } from 'app/models/UserModel';
import { DBClient } from 'app/utility/databaseClient';
import { injectable } from 'tsyringe';
import { DBOperation } from './dbOperation';
import { ProfileInput } from 'app/models/dto/AddressInput';
import { AddressModel } from 'app/models/AddressModel';
@injectable()
export class UserRepository extends DBOperation {
    constructor() { 
        super()
    }
    async createAccount({ phone, email, password, salt, userType }: UserModel) {
        const queryString = "INSERT INTO users(phone,email , password , salt , user_type) VALUES($1, $2,$3,$4,$5) RETURNING *"
        const values = [phone, email, password, salt, userType]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount !== null && result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }
    }

    async findAccount(email: string) {
         const queryString = "SELECT user_id, email , password , phone , salt,verification_code , expiry  FROM users WHERE email=$1"
         const values = [email]
         const result = await this.executeQuery(queryString ,values)
         if(result?.rowCount === null || result.rowCount < 1){
             throw new Error("User does not exist with provided email id")
         }
         return result.rows[0] as UserModel
    }

    async updateVerificationCode(userId: number, code:number , expiry:Date ) {
        const queryString = "UPDATE users SET verification_code=$1 ,expiry=$2 WHERE user_id=$3 AND verified=FALSE  RETURNING *"
        const values = [code , expiry , userId]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount !== null && result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }else{
            throw new Error("user already verified")
        }
    }
    async updateVerifyUser(userId: number) {
        const queryString = "UPDATE users SET verified=TRUE  WHERE user_id=$1 AND verified=FALSE  RETURNING *"
        const values = [userId]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount !== null && result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }else{
            throw new Error("user already verified")
        }
    }
    async updateUser(user_id:number , firstName:string , lastName:string , userType:string){
        const queryString = "UPDATE users SET first_name=$1, last_name=$2 , user_type=$3 WHERE user_id=$4 AND verified=TRUE  RETURNING *"
        const values = [firstName , lastName , userType , user_id]
        const result = await this.executeQuery(queryString, values)
        if (result.rowCount !== null && result.rowCount > 0) {
            return result.rows[0] as UserModel;
        }else{
            throw new Error("Error updating user !")
        }
    }

    async createProfile(user_id: number, { firstName, lastName, userType, address: { addressLine1, addressLine2, city, country, postCode } }: ProfileInput) {
        const updatdedUser = await this.updateUser(user_id, firstName, lastName, userType)

        const queryString = "INSERT INTO address(user_id , address_line1 , address_line2 , city , country , post_code) VALUES($1,$2,$3,$4,$5,$6) RETURNING *"
        const values = [updatdedUser.user_id, addressLine1, addressLine2, city, country, postCode]
        const result = await this.executeQuery(queryString, values)

        if (result.rowCount !== null && result.rowCount > 0) {
            return result.rows[0] as UserModel;
        } 
        throw new Error("Error creating user profile  !")
    }

    async getUserProfile(user_id: number) {
        const queryString = "SELECT first_name, last_name , email , phone, user_type , verified FROM users WHERE user_id=$1"
        const values = [user_id]
        const result = await this.executeQuery(queryString, values)

        if (result.rowCount !== null && result.rowCount < 1) {
            throw new Error("User does not exist with provided user id")
        }
        const userProfile = result.rows[0] as UserModel 

        const addressQueryString = "SELECT address_line1 , address_line2 , city , country , post_code FROM address WHERE user_id=$1"
        const addressValues = [user_id]
        const addressResult = await this.executeQuery(addressQueryString, addressValues)

        if (addressResult.rowCount !== null && addressResult.rowCount < 1) {
            throw new Error("No address  found for provided user id")
        }

        const address = addressResult.rows as AddressModel[]
        const userProfileWithAddress = {
            ...userProfile,
            address: address
        }
        return userProfileWithAddress
        
    }

    async editProfile(user_id: number, { firstName, lastName, userType, address: { addressLine1, addressLine2, city, country, postCode , id } }: ProfileInput) {
        await this.updateUser(user_id, firstName, lastName, userType)
        const queryString = "UPDATE address SET  address_line1=$1 , address_line2=$2 , city=$3 , country=$4 , post_code=$5 WHERE id=$6 RETURNING *"
        const values = [addressLine1, addressLine2, city, country, postCode, id]
        const result = await this.executeQuery(queryString, values)

        if (result.rowCount !== null && result.rowCount < 1) {
            throw new Error("Error Updating  user profile  !")
        }
        return true

    }
    
}

