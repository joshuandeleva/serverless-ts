import twilio from 'twilio'
const accountSid = 'ACbda26149cf56c03be9f2aa28f8bca511';
const authToken = 'c32c56419382fdf1736bc89873743886'
const client = twilio(accountSid, authToken)
// atsk_a2fae89dc250ebfcc150ea046c0f03490891cbe270856c20f3d7e386f3fac18d7174cd0c


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