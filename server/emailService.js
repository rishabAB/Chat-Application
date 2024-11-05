const nodemailer = require("nodemailer");
const subject = "test email";
const text = " Hello world";
const from = "cb7efd79-122b-4af5-a9dc-a9af5376187b@mailslurp.net";
const to = "rishabmehta12480@gmail.com";

const transport = nodemailer.createTransport({
  host: "mxslurp.click",
  port: "2525",
  secure: false,
  auth: {
    user: "cb7efd79-122b-4af5-a9dc-a9af5376187b@mailslurp.net",
    pass: "27t8hJPr1yVLYFtfzzXUTWQfQiKClBYe",
  },
});

transport
  .sendMail({ subject, text, from, to })
  .then(() => console.log("Email sent"))
  .catch((ex) => console.error("An error occureed", ex));
