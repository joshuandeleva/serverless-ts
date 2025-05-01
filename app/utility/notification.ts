import twilio from 'twilio'
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)


export const generateAccessCode = () => {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += Math.floor(Math.random() * 10);
    }
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + 1 * 60 * 1000)
    return { code, expiry }
}

export const sendVerificationCode = async (code: string, toPhoneNumber: string) => {
    const response = await client.messages.create({
        body:`Your verification code is ${code}`,
        from:"+17076348641",
        to:"+254728270626",
    }).then(message => 
        console.log(message , `sedning sms hereeeee `)
    );
    console.log(response , `Sending verification code to ${toPhoneNumber}`)
    return response
}