// get dom elements from confirmed.html
const flightNum = document.getElementById("flight");
const seatNum = document.getElementById("seat");
const fullname = document.getElementById("name");
const givenEmail = document.getElementById("email");

// this calls our /user backend endpoint and shows the last added user
const renderConfirmation = () => {
  fetch("/users")
    .then((res) => res.json())
    .then((data) => {
      flightNum.innerText = `${
        data.reservations[data.reservations.length - 1].flight
      }`;
      seatNum.innerText = `${
        data.reservations[data.reservations.length - 1].seat
      }`;
      fullname.innerText = `${
        data.reservations[data.reservations.length - 1].givenName
      } ${data.reservations[1].surname}`;
      givenEmail.innerText = `${
        data.reservations[data.reservations.length - 1].email
      }`;
    });
};

// call the function when the pages loads
window.onload = function () {
  renderConfirmation();
};
