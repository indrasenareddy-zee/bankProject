var fs = require("fs");
const express = require('express')
var nodemailer = require("nodemailer");
var ejs = require("ejs");
require('dotenv').config()

const app = express();
var paymentRecieved = async function(data,transaction){
var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: process.env.MAILID,
        pass: process.env.MAILPASSWORD
    }
});

await app.render("paymentRecieved.ejs", { details: data,transaction:transaction }, function (err, html) {
if (err) {
    console.log(err);
} else {
    console.log("hrtr")
    var mainOptions = {
        from: `"Tester" ${process.env.MAILID}`,
        to: 'daggulashashi1000@gmail.com',
        subject: 'Testing Amount Recieved',
        html: html
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
}
var paymentSent = async function(data,transaction){
    var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: process.env.MAILID,
            pass: process.env.MAILPASSWORD
        }
    });
    
    await app.render("paymentSent.ejs", { details: data,transaction:transaction }, function (err, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log("hrtr")
        var mainOptions = {
            from: '"Tester" indrasena.reddy@zee.com',
            to: "indrasena1000@gmail.com",
            subject: 'tesing Amount sent',
            html: html
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
    }


module.exports = {
    paymentRecieved,
    paymentSent
}