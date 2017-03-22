
/// author Kyle Bannon
/// date 20-MAR-2017
/// purpose Opts prospects out in the target list if they have been opted out in the source list

// Changelog:
// Author          Date          Change

var pardot = require('pardot'); // npm install pardot
var csv = require("fast-csv"); // npm install fast-csv

// This is the old list, the source of the original data
var listFromId = '';
// This is the new list, the target for the update
var listToId = '';

// -- Credentials for pardot go here -- //
pardot({
    email: 'usernamegoeshere',
    password: 'passwordgoeshere',
    userKey: 'userkeygoeshere'
}).then(function(client) {

    // NOTE: Ensure csv has no headers, and only has two columns in this order: prospect id, opt out status
    csv
    .fromPath("csvnamegoeshere.csv") // -- Enter the name of the CSV here -- //
    .on("data", function(data) {

        // Ensure the prospect is in the target list before doing an update
        client.listMemberships.readByListIdAndProspectId(listToId, data[0], {
            // no params
        }).then(function(readData) {
            
            // The prospect has been found
            // Update the prospect's list opt out status
            // NOTE: can only opt out, cannot opt in
            client.listMemberships.updateByListIdAndProspectId(listToId, data[0], {
                opted_out: data[1]

            }).fail(function(updateErr) {
                console.log('bad update: '+updateErr);
            });

        }).fail(function(readErr) {
            console.log('bad read: '+readErr);
        });
    })
    .on("end", function() {
        console.log("done");
    });

}).fail(function(err) {
    // Failed to authenticate
    console.log('failed to autheniticate: ' + err);
});
