/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let request = new XMLHttpRequest();
let head = new Array("Username", "Start Time", "Start Date", "Number of Hours");

function addUserToSystem() {
    var info = document.getElementById("userToSystem");
    var username = document.getElementById("username1").value;
    if (username === "") {
        info.innerHTML = "You have not even entered your username yet...";
    } else {
        request.open("POST", "http://127.0.0.1:3000/add-username/" + username, true);

        request.onload = function ()
        {
            if (request.status === 200) {
                info.innerHTML = "Hello " + username + "! Welcome! your name has now in the system!";
            } else if (request.status === 404) {
                info.innerHTML = request.response + " Retry!";
            }
        };
        request.send();
    }
}

function retrieveTheReservation() {
    var info = document.getElementById("retrieveReservation");
    var username = document.getElementById("username1").value;

    if (username === "") {
        info.innerHTML = "You have not even entered your username yet...";
    } else {
        request.open("GET", "http://127.0.0.1:3000/retrieve-reservation/" + username, true);

        request.onload = function ()
        {
            if (request.status === 200) {
                info.innerHTML = request.response;
            } else if (request.status === 404) {
                info.innerHTML = "Sorry! " + request.response;
            }
        };
        request.send();
    }
}

function showReservationList() {
    var info = document.getElementById("reservationList");
    var table = document.createElement("table");
    var err = document.createElement("p");
    if (info.hasChildNodes()) {
        while (info.firstChild) {
            info.removeChild(info.lastChild);
        }
    }

    request.open("GET", "http://127.0.0.1:3000/reservation-list", true);

    request.onload = function ()
    {
        if (request.status === 200) {
            var data = [];
            data = JSON.parse(request.response);
            generateTableHead(table, head);
            generateTable(table, data);
            table.style.borderStyle = "Solid";
            table.style.backgroundColor = "AliceBlue";
            table.rows[0].style.backgroundColor = "CornflowerBlue";
            info.appendChild(table);
        } else if (request.status === 404) {
            err.innerHTML = "Sorry! " + request.response;
            info.appendChild(err);
        }
    };
    request.send();
}

function createReservation() {
    var info = document.getElementById("createReservationInfo");
    var username = document.getElementById("username2").value;
    var startDate = document.getElementById("date").value;
    var startTime = document.getElementById("time").value;
    var number = document.getElementById("hour").value;

    if (username === "" || startDate === "" || startTime === "" || number === "" || number === "00") {
        info.innerHTML = "Check your information please! No empty string!";
    } else if (!(isDate(startDate) && isTime(startTime) && isNumber(number))) {
        info.innerHTML = "Check your information please! You either not follow the format or not enter the correct number";
    } else {
        startDate = startDate.replace(/\//g, "-");
        startTime = startTime.replace(/\:/g, "-");
        request.open("PUT", "http://127.0.0.1:3000/create-reservation/" + username + "/" + startDate + "/" + startTime + "/" + number, true);
        request.onload = function ()
        {
            if (request.status === 200) {
                info.innerHTML = "You have successfully created your reservation! Remember to pick up your skateboard!";
            } else if (request.status === 404) {
                info.innerHTML = "Sorry! " + request.response;
            }
        };
        request.send();
    }
}

function updateReservation() {
    var info = document.getElementById("updateReservationInfo");
    var username = document.getElementById("username2").value;
    var startDate = document.getElementById("date").value;
    var startTime = document.getElementById("time").value;
    var number = document.getElementById("hour").value;

    if (username === "" || startDate === "" || startTime === "" || number === "" || number === "00") {
        info.innerHTML = "Check your information please! No empty string!";
    } else if (!(isDate(startDate) && isTime(startTime) && isNumber(number))) {
        info.innerHTML = "Check your information please! You either not follow the format or not enter the correct number";
    } else {
        startDate = startDate.replace(/\//g, "-");
        startTime = startTime.replace(/\:/g, "-");
        request.open("PUT", "http://127.0.0.1:3000/update-reservation/" + username + "/" + startDate + "/" + startTime + "/" + number, true);
        request.onload = function ()
        {
            if (request.status === 200) {
                info.innerHTML = "You have successfully updated your reservation! Remember to pick up your skateboard! :)";
            } else if (request.status === 404) {
                info.innerHTML = "Sorry! " + request.response;
            }
        };
        request.send();
    }
}

function deleteReservation() {
    var info = document.getElementById("deleteReservationInfo");
    var username = document.getElementById("username3").value;

    if (username === "") {
        info.innerHTML = "You have not even entered your username yet...";
    } else {
        request.open("DELETE", "http://127.0.0.1:3000/delete-reservation/" + username, true);
        request.onload = function ()
        {
            if (request.status === 200) {
                info.innerHTML = "You have successfully deleted your reservation! Hope we can cooperate next time. T^T";
            } else if (request.status === 404) {
                info.innerHTML = "Sorry! " + request.response;
            }
        };
        request.send();
    }
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

//YYYY/MM/DD
function isDate(num) {
    var regexp = /^([1][9][9][9]|[2][0-9][0-9][0-9])(\/)([0][1-9]|[1][0-2])(\/)([0-2][1-9]|[3][0-1])$/g;
    //1999-01-01 ----2999-01-01 　
    return regexp.test(num);
}

//HH:MM
function isTime(num) {
    var regexp = /^([0-1][0-9]|[2][0-3])(:)([0-5][0-9])$/g;
    return regexp.test(num);
}

//HH
function isNumber(num) {
    var regexp = /^([0-1][0-9]|[2][0-4])$/g;
    return regexp.test(num);
}