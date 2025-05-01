import {IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class VerficationInput {
    @IsNotEmpty()
    @IsNumberString({}, { message: 'Code must be a numeric string' })
    @Length(4, 4, { message: 'Code must be exactly 4 digits' })
    code!: string
}