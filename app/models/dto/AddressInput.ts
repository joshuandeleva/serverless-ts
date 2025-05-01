import { Length } from "class-validator";

export class AddressInput {
    id!: number;

    @Length(3, 100)
    addressLine1!: string;
    addressLine2!: string;

    @Length(3, 100)
    city!: string;

    @Length(3, 100)
    country!: string;

    @Length(3, 10)
    postCode!: string;
}


export class ProfileInput {
    @Length(3, 100)
    firstName!: string;

    @Length(3, 100)
    lastName!: string;

    @Length(3, 100)
    userType!: string;

    address!: AddressInput;
}