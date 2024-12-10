const nodemailer = require("nodemailer");



 class emailService 
{

  constructor(email,)
  {
    this.email = email;
 
  }

   sendMail(otp)
  {
    return new Promise((resolve,reject) =>
    {
      const subject = "Talkapp Email Verification";
      const text = `Your OTP for Registering an Account on Talkapp is ${otp}`;
      const from = "user-432fcf2c-fc37-46bf-95a2-e16df93256f2@mailslurp.biz";
      const to = this.email;
      let transport = nodemailer.createTransport({
        host: "mailslurp.mx",
        port: "2465",
        secure: true,
        auth: {
          user: "6j2NMYV4JDx66wKIURh5Ny01k0mBBK0c@mailslurp.net",
          pass: "27t8hJPr1yVLYFtfzzXUTWQfQiKClBYe",
        },
      });
      
      transport
        .sendMail({ subject, text, from, to })
        .then(() => {
          console.log("Email sent")
          resolve();
        
          // Update In Db
        })
        .catch((ex) => {
          console.error("Email send Mail error occured", ex)
          reject(ex);
         
        });

    })
   

  }


  
}

module.exports = emailService;

