const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_Key)

const sendWelcomeEmail = async (name, email) => {
    sgMail.send({
        to: email,
        from: 'ayodejigreatest@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendDeleteEmail = async (name, email) => {
    sgMail.send({
        to: email,
        from: 'ayodejigreatest@gmail.com',
        subject: 'Sorry to see you go',
        //text: `Goodbye, ${name}, I hope to see you back sometime soon`,
        html: `Goodbye, ${name},
        <p>I hope to see you back sometime soon</p><br>, 
        <b><i>Please come back!</i></b>`
    })
}

const forgetPassword = async (email) => {
    sgMail.send({
        to: email,
        from: 'ayodejigreatest@gmail.com',
        subject: 'Forget Password',
        html: `<p>Forgot your password? I'll fix that soon</p><br> 
        <b><i>Hold on!</i></b>`
    })
}
// const newsletter = async (name, email) => {
//     sgMail.send({
//         to: email,
//         from: 'ayodejgreatest@gmail.com',
//         subject: 'Task Manager',
//         text: `Hello ${name}, I hope you are enjoying the app`
//     })
// }

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail,
    forgetPassword
    //newsletter
}