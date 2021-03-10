var fs = require("fs");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'testmail@zoho.com',
        pass: '123456'
    }
});

ejs.render("/mail.ejs", { name: 'Stranger' }, function (err, data) {
if (err) {
    console.log(err);
} else {
    console.log("hrtr")
    var mainOptions = {
        from: '"Tester" indrasena.reddy@zee.com',
        to: "indrasena1000@gmail.com",
        subject: 'Hello, world',
        html: data
    };
    console.log("html data ======================>", mainOptions.html);
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

});

module.exports = mail