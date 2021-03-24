/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const express = require('express');
const fs = require('fs');
//const cors = require('cors');
const app = express();
const port = 3000;
const jsonPath = 'resList.json';
//app.use(cors());

app.get("/client.js", function (req, res) {
    fs.readFile("./client.js", function (err, data) {
        if (err)
            throw err;
        res.writeHead(200, {"Content-type": "text/javascript;charset=UTF8"});
        res.end(data);
    });
});

app.get("/", function (req, res) {
    fs.readFile("./index.html", function (err, data) {
        if (err)
            throw err;
        res.writeHead(200, {"content-type": "text/html"});
        res.end(data);
    });
});

app.post("/add-username/:username", function (req, res) {
    let newUser = {};
    newUser.name = req.params.username;
    newUser.startDate = "";
    newUser.startTime = "";
    newUser.num = "00";
    let currentList = [];
    let isDuplicateName = false;

    if (fs.existsSync(jsonPath)) {
        fs.readFile(jsonPath, (err, data) => {
            if (err)
                throw err;
            currentList = JSON.parse(data);
            currentList.forEach((elt) => {
                if (elt.name === newUser.name)
                    isDuplicateName = true;
            });

            if (isDuplicateName) {
                res.writeHead(404, {"content-type": "text/plain"});
                let info = "Sorry! The name, " + newUser.name + ", is already in the system!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else {
                currentList.push(newUser);
                fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
                    if (err)
                        throw err;
                    console.log(newUser.name + " has add to the system! By the way, this is a " + req.method + " HTTP request.");
                    res.writeHead(200, {"content-type": "text/plain"});
                    res.end();
                });
            }
        });
    } else {
        currentList.push(newUser);
        fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
            if (err)
                throw err;
            console.log(newUser.name + " has add to the system! By the way, this is a " + req.method + " HTTP request.");
            res.writeHead(200, {"content-type": "text/plain"});
            res.end();
        });
    }
});

app.get("/retrieve-reservation/:username", function (req, res) {
    let theUser = {};
    theUser.name = req.params.username;
    theUser.startDate = "";
    theUser.startTime = "";
    theUser.num = "00";
    let currentList = [];
    let noReservation = false;
    let noUser = true;
    let info = "";
    if (fs.existsSync(jsonPath)) {
        fs.readFile(jsonPath, (err, data) => {
            if (err)
                throw err;
            currentList = JSON.parse(data);
            currentList.forEach((elt) => {
                if (elt.name === theUser.name) {
                    noUser = false;
                    if (elt.startDate === theUser.startDate && elt.startTime === theUser.startTime && elt.num === theUser.num) {
                        noReservation = true;
                    } else {
                        theUser.startDate = elt.startDate;
                        theUser.startTime = elt.startTime;
                        theUser.num = elt.num;
                    }
                }
            });
            if (noReservation) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", doesn't have a reservation!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else if (noUser) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", is not in the system!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else {
                info = theUser.name + ": " + "Start Date is " + theUser.startDate + ", Start Time is " + theUser.startTime + ", Number of Hour is " + theUser.num;
                res.writeHead(200, {"content-type": "text/plain"});
                console.log(info + ". By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            }
        });
    } else {
        fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
            if (err)
                throw err;
            res.writeHead(404, {"content-type": "text/plain"});
            info = "The user, " + theUser.name + ", is not in the system!";
            console.log(info + " By the way, this is a GET HTTP request.");
            res.end(info);
        });
    }
});

//test
app.get("/reservation-list", function (req, res) {
    let userList = [];
    let reservationList = [];
    var info = "";
    if (fs.existsSync(jsonPath)) {
        fs.readFile(jsonPath, (err, data) => {
            if (err)
                throw err;
            userList = JSON.parse(data);
            userList.forEach((elt) => {
                if (!(elt.startDate === "" && elt.startTime === "" && elt.num === "00")) {
                    reservationList.push(elt);
                }
            });
            if (reservationList.length === 0) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "No one has make a reservation yet.";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else {
                res.writeHead(200,{"content-type": "application/json"});
                console.log("Send a reservation list. By the way, this is a " + req.method + " HTTP request.");
                reservationList.sort(function(a, b){
                    return new Date(b.startDate+" "+b.startTime) < new Date(a.startDate+" "+a.startTime) ? 1 : -1;
                });
                res.end(JSON.stringify(reservationList));
            }
        });
    } else {
        fs.writeFile(jsonPath, JSON.stringify(userList), err => {
            if (err)
                throw err;
            res.writeHead(404, {"content-type": "text/plain"});
            info = "No one has make a reservation yet.";
            console.log(info + " By the way, this is a " + req.method + " HTTP request.");
            res.end(info);
        });
    }
});

app.put("/create-reservation/:username/:startDate/:startTime/:number", function (req, res) {
    let theUser = {};
    theUser.name = req.params.username;
    theUser.startDate = req.params.startDate.replace(/\-/g, "/");
    theUser.startTime = req.params.startTime.replace(/\-/g, ":");
    theUser.num = req.params.number;
    let currentList = [];
    let hasReservation = false;
    let noUser = true;
    let counter = 0;
    let index = 0;
    if (fs.existsSync(jsonPath)) {
        fs.readFile(jsonPath, (err, data) => {
            if (err)
                throw err;
            currentList = JSON.parse(data);
            currentList.forEach((elt) => {
                if (elt.name === theUser.name) {
                    noUser = false;
                    if (!(elt.startDate === "" && elt.startTime === "" && elt.num === "00")) {
                        hasReservation = true;
                    } else {
                        index = counter;
                    }
                }
                counter += 1;
            });
            if (hasReservation) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", already have a reservation! Try \"Update the reservation for above user\"!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else if (noUser) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", is not in the system!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else {
                currentList[index] = theUser;
                fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, {"content-type": "text/plain"});
                    console.log("The user," + theUser.name + " create a reservation. By the way, this is a " + req.method + " HTTP request.");
                    res.end();
                });
            }
        });
    } else {
        fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
            if (err)
                throw err;
            res.writeHead(404, {"content-type": "text/plain"});
            info = "The user, " + theUser.name + ", is not in the system!";
            console.log(info + " By the way, this is a " + req.method + " HTTP request.");
            res.end(info);
        });
    }
});
app.put("/update-reservation/:username/:startDate/:startTime/:number", function (req, res) {
    let theUser = {};
    theUser.name = req.params.username;
    theUser.startDate = req.params.startDate.replace(/\-/g, "/");
    theUser.startTime = req.params.startTime.replace(/\-/g, ":");
    theUser.num = req.params.number;
    let currentList = [];
    let noReservation = false;
    let noUser = true;
    let counter = 0;
    let index = 0;
    if (fs.existsSync(jsonPath)) {
        fs.readFile(jsonPath, (err, data) => {
            if (err)
                throw err;
            currentList = JSON.parse(data);
            currentList.forEach((elt) => {
                if (elt.name === theUser.name) {
                    noUser = false;
                    if (elt.startDate === "" && elt.startTime === "" && elt.num === "00") {
                        noReservation = true;
                    } else {
                        index = counter;
                    }
                }
                counter += 1;
            });
            if (noReservation) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", doesn't have a reservation! Try \"Create the reservation for above user\"!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else if (noUser) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", is not in the system!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else {
                currentList[index] = theUser;
                fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, {"content-type": "text/plain"});
                    console.log("The user," + theUser.name + " create a reservation. By the way, this is a " + req.method + " HTTP request.");
                    res.end();
                });
            }
        });
    } else {
        fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
            if (err)
                throw err;
            res.writeHead(404, {"content-type": "text/plain"});
            info = "The user, " + theUser.name + ", is not in the system!";
            console.log(info + " By the way, this is a " + req.method + " HTTP request.");
            res.end(info);
        });
    }
});
app.delete("/delete-reservation/:username", function (req, res) {
    let theUser = {};
    theUser.name = req.params.username;
    theUser.startDate = "";
    theUser.startTime = "";
    theUser.num = "00";
    let currentList = [];
    let noReservation = false;
    let noUser = true;
    let info = "";
    let counter = 0;
    let index = 0;
    if (fs.existsSync(jsonPath)) {
        fs.readFile(jsonPath, (err, data) => {
            if (err)
                throw err;
            currentList = JSON.parse(data);
            currentList.forEach((elt) => {
                if (elt.name === theUser.name) {
                    noUser = false;
                    if (elt.startDate === "" && elt.startTime === "" && elt.num === "00") {
                        noReservation = true;
                    } else {
                        index = counter;
                    }
                }
                counter += 1;
            });
            if (noReservation) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", doesn't have a reservation! So I can't delete the reservation for you.";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else if (noUser) {
                res.writeHead(404, {"content-type": "text/plain"});
                info = "The user, " + theUser.name + ", is not in the system!";
                console.log(info + " By the way, this is a " + req.method + " HTTP request.");
                res.end(info);
            } else {
                currentList[index] = theUser;
                fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
                    if (err)
                        throw err;
                    res.writeHead(200, {"content-type": "text/plain"});
                    console.log("The user," + theUser.name + " create a reservation. By the way, this is a " + req.method + " HTTP request.");
                    res.end();
                });
            }
        });
    } else {
        fs.writeFile(jsonPath, JSON.stringify(currentList), err => {
            if (err)
                throw err;
            res.writeHead(404, {"content-type": "text/plain"});
            info = "The user, " + theUser.name + ", is not in the system!";
            console.log(info + " By the way, this is a " + req.method + " HTTP request.");
            res.end(info);
        });
    }
});
app.listen(port, () => console.log(`Server on: 127.0.0.1:${port}!`));
