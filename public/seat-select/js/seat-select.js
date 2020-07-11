const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");

// // const { flights } = require("../../../test-data/flightSeating");
// console.log(flights);

// const allFlightsNumber = Object.keys(flights);
// console.log(allFlightsNumber);
// allFlightsNumber.forEach((element) => {
//   let optionToAdd = document.createElement("option");
//   optionToAdd.textContent = "hello";
//   optionToAdd.value = "hello";
//   flightInput.appendChild(optionToAdd);
// });
// //Creat option and adding it in flight (dropdown id)
// //appendChild creat a child to insert element in parent (Child is the const)

let selection = "";

const renderSeats = (data) => {
  document.querySelector(".form-container").style.display = "block";

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`;
      const seat = document.createElement("li");

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      // TODO: render the seat availability based on the data...
      //how to look for what we want
      //store seat found in var
      const findAvailableSeat = data.find((seat) => seat.id === seatNumber);
      if (findAvailableSeat.isAvailable) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  //https://regex101.com/
  const regex = /[S][A][0-9][0-9][0-9]$/g;
  if (flightNumber.match(regex)) {
    //console.log("toggleFormContent: ", flightNumber);
    fetch(`/flights/${flightNumber}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data[0].id);
        renderSeats(data);
      });
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?

    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
  } else {
    alert("Not existing flight number");
  }
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  // TODO: everything in here!
  fetch("/users", {
    method: "POST",
    body: JSON.stringify({
      flightNum: document.getElementById("flight").value,
      seat: document.getElementById("seat-number").innerHTML,
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

flightInput.addEventListener("blur", toggleFormContent);
