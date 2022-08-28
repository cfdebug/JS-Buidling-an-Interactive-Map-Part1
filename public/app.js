function getLocation() {
  navigator.geolocation.getCurrentPosition(createMap, showError);
}

function createMap(position) {
  let markerResult = [];
  let layerGrp;

  // Create Main Map
  var myMap = L.map("map").setView(
    [position.coords.latitude, position.coords.longitude],
    12
  );

  // Add OpenStreetMap tiles:
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  }).addTo(myMap);

  //Add Geolocation Marker for User
  let marker = L.marker([
    position.coords.latitude,
    position.coords.longitude,
  ]).addTo(myMap);
  marker.bindPopup("<b>You Are Here</b>").openPopup();

  // Add Event Listener to Select Menu
  let userSelection = document.querySelector(".map-select");
  userSelection.addEventListener("change", function () {
    findBusiness(this.options[this.selectedIndex].text, position);
  });

  //  Find Local Businesses
  async function findBusiness(search, location) {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };
    if (search != "Business Type:") {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${search}&location=${location.coords.latitude}%2C${location.coords.longitude}&radius=8047&key=AIzaSyAN0dWXG8p1I9qbLsosB8EJ5uoI71wGcTw`,
        options
      );
      const result = await response.json();
      const list = result.results;
      createMarker(list);
    }
  }

  //   Create Markers for Found Businesses/Clear Old Markers
  async function createMarker(businesses) {
    if (markerResult.length > 0) {
      layerGrp.remove();
      layerGrp = null;
      markerResult = [];
    }
    await businesses.forEach((business) => {
      const myIcon = L.icon({
        iconUrl: business.icon,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
      });

      const element = L.marker(
        [business.geometry.location.lat, business.geometry.location.lng],
        { icon: myIcon }
      ).bindPopup(business.name);
      markerResult.push(element);
    });
    layerGrp = L.layerGroup(markerResult).addTo(myMap);
  }
}

// Location Error Handling
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      window.alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      window.alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      window.alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      window.alert("An unknown error occurred.");
      break;
  }
}

getLocation();
