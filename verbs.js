/* 
Verbs, app for Questions & Answers regarding english verbs
Usage: node verbs.js
MRS, 6/3/2017
*/



/* Global variables */

var express = require('express');
var app = express();
var fs = require('fs');
var verbs = [];
var weights =[];
var path = require('path');
var debug = 0;



/* Functions */

//Return random index of verbs[], from 0 to length-1
function getRandomIndex() {
    var prob = [];
    for (i = 0; i < weights.length; i++) 
        for (j = 0; j < weights[i]; j++) 
            prob.push(i);
    var idx = Math.floor(Math.random() * prob.length);
    if (prob.length == 0)
        return -1;
    else 
        return prob[idx];
}

function updateWeights(question, status) {
    if (status == 1) weights[question] = 5;
    else if (status == 2) weights[question] = 2;
    else if (status == 3) weights[question] = 0;
    else weights[question] = 3;
    if (debug == 1) console.log('updateWeights:', weights);
    return;
}



/* Initialization */

//Load the file verbs.txt containing the question:answer rows in array
//Then, load the weights array with a probability of 10/10
//The pop removes a blank line added by split
verbs = fs.readFileSync('./verbs.txt').toString().split('\n');
verbs.pop();
for(i=0; i<verbs.length; i++) {
    weights[i] = 3;
}

if (debug == 1) console.log('initialization:', verbs, weights);



/* Routes */

//Route for the main page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//Route for the API, get a plain Q&A
app.get('/qa', function(req, res) {
    //Update the weights array with the url parameters
    if (debug == 1) console.log('url pars for the record:', req.query.question, req.query.status);
    if (!(req.query.question == null || req.query.status == null))
        updateWeights(req.query.question, req.query.status);

    //Send new question:answer:index
    var i = getRandomIndex();
    if (debug == 1) console.log('sending index:', i);
    if (i == -1)
        res.send('You got it:Congratulations!:-1');
    else
        res.send(verbs[i] + ':' + i.toString());
});

//Listen on port 8080
app.listen(8080, function () {
    console.log('App started, listening on port 8080');
})
