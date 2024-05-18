const nodeMailer = require('nodemailer');

exports.sendEmail = function sendmail(destino, asunto, bodyHTML){
    const config = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'juanchi3336@gmail.com',
            pass: 'jupmsyluuhvjrodu'
        }
    };

    let mail ={
        from:'Cuidamor <updates-noreply@cuidamor.com>',
        to: destino ,
        subject: asunto,
        html: bodyHTML
    }

    transporter = nodeMailer.createTransport(config);

    transporter.sendMail(mail, (error, info) => {
        if(error){
            console.log(error);
            return 'Error al enviar el correo';
        }else{
            console.log(info);
            return 'Correo enviado correctamente';
        }
    });
};