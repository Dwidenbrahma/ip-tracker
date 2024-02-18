//variable declaration
let btn = document.getElementById("btn"); //targetting the btn id
let h5s = document.querySelectorAll("h5"); //query selecting all h5 using querySelectorAll

let map = null; //initially declaring map as Null

const API_KEY = "17831cdd0f574e80861b7b81c7b69c55";

//Map function Start
function initMap(lat, long, org) {
  var myLatLng = [lat, long]; //getting longitute and latitute from ip-api

  //creating map if there is no map is already created
  if (!map) {
    map = L.map("map").setView(myLatLng, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "mymap",
    }).addTo(map);
  } else {
    map.setView(myLatLng); //else default loading
  }

  //if there is existing marker it will remove
  if (map.marker) {
    map.removeLayer(map.marker);
  }

  //marking the desire location
  map.marker = L.marker(myLatLng, {
    icon: L.icon({
      iconUrl: "./images/icon-location.svg", //loading svg file from local
      iconSize: [25, 41], //icon size
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
  })
    .addTo(map)
    .bindPopup(org) //it will pop the where marker is point
    .openPopup();
}

//map function end

//time calculation

function calculateSolarTime(longitude, altitude) {
  // Get current date and time
  var date = new Date();

  // Calculate the solar declination (in radians)
  var daysSinceJan1 = date.getUTCDate() - 1;
  var solarDeclination =
    23.44 * Math.sin((2 * Math.PI * (daysSinceJan1 + 10)) / 365.25);

  // Calculate the equation of time (in minutes)
  var equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(((daysSinceJan1 - 4) * Math.PI) / 182.625) -
      0.032077 * Math.sin(((daysSinceJan1 - 8) * Math.PI) / 182.625) -
      0.014615 * Math.cos(((daysSinceJan1 - 39) * Math.PI) / 182.625) -
      0.040849 * Math.sin(((daysSinceJan1 - 40) * Math.PI) / 182.625));

  // Calculate the solar time offset (in minutes)
  var solarTimeOffset = equationOfTime + 4 * longitude;

  // Calculate the hour angle (in radians)
  var hourAngle =
    (date.getUTCHours() * 60 + date.getUTCMinutes() + solarTimeOffset) / 4;

  // Calculate the solar time (in minutes since midnight)
  var solarTime = 720 + hourAngle - 4 * longitude - equationOfTime;

  // Adjust for altitude (add 4 minutes per degree of altitude)
  var adjustedTime = solarTime + altitude * 4;

  // Convert time to hours and minutes
  var hours = Math.floor(adjustedTime / 60);
  var minutes = Math.floor(adjustedTime % 60);

  var ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  return { hours: hours, minutes: minutes, ampm: ampm };
}

//API fetching
async function fetchData() {
  let getInput = document.querySelector("input"); //targeting input value

  const URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${getInput.value}`; //getting value from input
  const apiUrl = URL; //complete url

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(alert("Opps! error"));
    }

    //success response data
    const data = await response.json();
    h5s[0].innerHTML = data.ip;
    h5s[1].innerHTML = `${data.city}, ${data.country_name}`;

    h5s[3].innerHTML = data.isp;
    var time = calculateSolarTime(data.latitude, data.longitude);
    h5s[2].innerHTML = `UTC - ${time.hours} : ${time.minutes} ${time.ampm}`;

    initMap(data.latitude, data.longitude, data.organization); //passing the longitude , latitude and org data to initMap
  } catch (error) {
    //catching error
    alert(error); //alerting if there is an error
  }
}

//addting event in btn
btn.addEventListener("click", () => {
  fetchData();
});

//as of now end of the code
