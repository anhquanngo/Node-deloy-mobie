const nodemailler = require("nodemailer");
const config = require("config");

const mailConfig = config.get("mail");

const transporter = nodemailler.createTransport(mailConfig);

module.exports = transporter;
