"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { uuid } = require("uuidv4");
const { flights } = require("./test-data/flightSeating");
const users = require("./test-data/reservations");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  const { flightNumber } = req.params;
  // get all flight numbers
  const allFlights = Object.keys(flights); //return aray of the key of the object
  // is flightNumber in the array?
  //console.log("REAL FLIGHT: ", allFlights.includes(flightNumber));
  if (!allFlights.includes(flightNumber)) {
    return res.status(404).json({ message: "Not found" });
  }

  // find specifique flights
  //Object.entries()méthode renvoie un tableau de paires de propriétés énumérées propres à un objet donné , dans le même ordre que celui fourni par une boucle. (La seule différence importante est qu'une boucle énumère également les propriétés de la chaîne de prototypes). [key, value]for...infor...in
  let foundFlight = null;
  for (const [key, value] of Object.entries(flights)) {
    if (key == flightNumber) {
      foundFlight = value;
    }
  }
  /*or foundFlight = flights[flightNumber] */

  //response the flight informations
  res.status(200).json(foundFlight);
};

//returns an array of flight numbers
const handleAllFlights = (req, res) => {
  // get all flight numbers
  const allFlights = Object.keys(flights);

  //response the flight informations
  res.status(200).json(allFlights);
};

//returns an array of all users
const handleAllUsers = (req, res) => {
  //https://stackabuse.com/get-query-strings-and-parameters-in-express-js/
  let limit = req.query.limit;
  let start = req.query.start;
  //can't do the pagination??

  //response the users informations
  res.status(200).json(users);
};

const handleCreateUser = (req, res) => {
  const bodyRequestElements = req.body;
  const userUuid = uuid();

  let userDataToAdd = {
    id: userUuid,
    flight: bodyRequestElements.flightNum,
    seat: bodyRequestElements.seat,
    givenName: bodyRequestElements.givenName,
    surname: bodyRequestElements.surname,
    email: bodyRequestElements.email,
  };

  users.reservations.push(userDataToAdd);

  res.status(200).json(userDataToAdd);
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights/:flightNumber", handleFlight)
  //returns an array of flight numbers
  .get("/flights", handleAllFlights)
  .get("/users", handleAllUsers)
  .post("/users", handleCreateUser)
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
