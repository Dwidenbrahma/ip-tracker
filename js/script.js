//variable declaration
let btn = document.getElementById("btn"); //targetting the btn id
let h5s = document.querySelectorAll("h5"); //query selecting all h5 using querySelectorAll

let map = null; //initially declaring map as Null

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

//API fetching
async function fetchData() {
  let getInput = document.querySelector("input"); //targeting input value

  const URL = `http://ip-api.com/json/${getInput.value}`; //getting value from input
  const apiUrl = URL; //complete url

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(alert("Opps! error"));
    }

    //success response data
    const data = await response.json();
    h5s[0].innerHTML = data.query;
    h5s[1].innerHTML = `${data.city}, ${data.country}`;
    h5s[2].innerHTML = data.timezone;
    h5s[3].innerHTML = data.isp;

    initMap(data.lat, data.lon, data.org); //passing the longitude , latitude and org data to initMap
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
