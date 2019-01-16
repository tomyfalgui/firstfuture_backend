process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const Imap = require("imap");
const MailParser = require("mailparser").MailParser;
const Promise = require("bluebird");
require('dotenv').config({ path: '.env' });
Promise.longStackTraces();

const imapConfig = {
    user: process.env.MAILER_SERVICE_USER,
    password: process.env.MAILER_SERVICE_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true
};

const imap = new Imap(imapConfig);
Promise.promisifyAll(imap);

imap.once("ready", execute);
imap.once("error", function(err) {
    console.log("Connection error: " + err.stack);
});

imap.connect();

function execute() {
    imap.openBox("INBOX", true, function(err, mailBox) {
        if (err) {
            console.error(err);
            return;
        }
        imap.search(["UNANSWERED", ['SUBJECT', 'First Future - Email Verification']], function(err, results) {
            if (!results || !results.length) {
                console.log("No unread mails");
                imap.end();
                return;
            }
            let f = imap.fetch(results, { bodies: "" });
            f.on("message", processMessage);
            f.once("error", function(err) {
                return Promise.reject(err);
            });
            f.once("end", function() {
                //console.log("Done fetching all unseen messages.");
                imap.end();
            });
        });
    });
}


function processMessage(msg, seqno) {
    let parser = new MailParser();

    parser.on('data', data => {
        if (data.type === 'text') {
            let output = data.text.slice(
                data.text.indexOf('[') + 1,
                data.text.indexOf(']')
            )
            console.log(output);
        }
    });

    msg.on("body", function(stream) {
        stream.on("data", function(chunk) {
            parser.write(chunk.toString("utf8"));
        });
    });
    msg.once("end", function() {
        parser.end();
    });
}

module.exports = execute;