import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class LoginInput {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })

    email!: string

    @Length(6, 32)
    @IsNotEmpty({ message: 'Password is required' })
    password!: string;
}