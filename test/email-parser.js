process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Imap = require("imap");
var MailParser = require("mailparser").MailParser;
var Promise = require("bluebird");
require('dotenv').config({path: '../.env'});
Promise.longStackTraces();

var imapConfig = {
    user: process.env.MAILER_SERVICE_USER,
    password: process.env.MAILER_SERVICE_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true
};

var imap = new Imap(imapConfig);
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
        imap.search(["UNSEEN", ['SUBJECT', 'First Future - Email Verification']], function(err, results) {
            if (!results || !results.length) {
                console.log("No unread mails");
                imap.end();
                return;
            }
            /* mark as seen
            imap.setFlags(results, ['\\Seen'], function(err) {
                if (!err) {
                    console.log("marked as read");
                } else {
                    console.log(JSON.stringify(err, null, 2));
                }
            });*/

            var f = imap.fetch(results, { bodies: "" });
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
    //console.log("Processing msg #" + seqno);
    // console.log(msg);

    var parser = new MailParser();


    parser.on('data', data => {
        if (data.type === 'text') {
            // console.log(seqno);
            console.log(data.text.slice(
                data.text.indexOf('[') + 1,
                data.text.indexOf(']')
            )); /* data.html*/
        }

        // if (data.type === 'attachment') {
        //     console.log(data.filename);
        //     data.content.pipe(process.stdout);
        //     // data.content.on('end', () => data.release());
        // }
    });

    msg.on("body", function(stream) {
        stream.on("data", function(chunk) {
            parser.write(chunk.toString("utf8"));
        });
    });
    msg.once("end", function() {
        // console.log("Finished msg #" + seqno);
        parser.end();
    });
}