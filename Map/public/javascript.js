let NASA = [];
let earthObject = [];
let ChatArray = [1];
const icons = {
  wildfires: L.icon({ iconUrl: "wildfire.jpeg", iconSize: [20, 20] }),
  seaLakeIce: L.icon({ iconUrl: "iceberg.jpeg", iconSize: [20, 20] }),
  volcanoes: L.icon({ iconUrl: "volcano.jpeg", iconSize: [20, 20] }),
  severeStorms: L.icon({ iconUrl: "severestorm.jpeg", iconSize: [20, 20] }),
  earthquake: L.icon({ iconUrl: "earthquick.jpeg", iconSize: [20, 20] }),
};

document.addEventListener("DOMContentLoaded", function () {
  const toggleSatelliteButton = document.getElementById(
    "toggleSatelliteButton"
  );
  const disasterFilters = document.getElementById("toolbar");
  const southWest = L.latLng(-90, -180);
  const northEast = L.latLng(90, 180);
  const bounds = L.latLngBounds(southWest, northEast);
  const map = L.map("map", {
    maxBounds: bounds,
    layers: [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 16,
        minZoom: 2,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
  }).setView([0, 0], 2);

  let satelliteLayer = null;

  toggleSatelliteButton.addEventListener("click", function () {
    if (satelliteLayer) {
      map.removeLayer(satelliteLayer);
      satelliteLayer = null;
    } else {
      satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
          minZoom: 2,
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }
      ).addTo(map);
    }
  });

  function updateMap() {
    const selectedCategories = Array.from(
      disasterFilters.querySelectorAll("input[type=checkbox]:checked")
    ).map((checkbox) => checkbox.value);

    const apiUrl = `https://eonet.gsfc.nasa.gov/api/v3/events?category=${selectedCategories.join(
      ","
    )}&days=50&status=open`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon || layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        if (data && data.events && data.events.length > 0) {
          const currentDate = new Date("2023-12-15");
          const filteredData = data.events.filter((e) => {
            const eventStartDate = new Date(e.geometry[0].date);
            return eventStartDate >= currentDate || e.closed === null;
          });

          filteredData.forEach((event) => {
           // iceberg
            // if(event.categories[0].id==='seaLakeIce')
            // {
            //   return
            // }
            NASA.push({
              category: event.categories[0].id,
              coordinates: event.geometry[0].coordinates,
              description: event.title,
              DateBegin: new Date(event.geometry[0].date).toLocaleString(),
              latitude: event.geometry[0].coordinates[1],
              longitude: event.geometry[0].coordinates[0],
            });
          });

          fetchEarthquakeData();
        } else {
          console.log(
            "No ongoing events data available for the selected categories."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  function fetchEarthquakeData() {
    const EarthApiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-12-31&endtime=2024-01-2&minmagnitude=5`;
    fetch(EarthApiUrl)
      .then((response) => response.json())
      .then((data) => {
        const earthquakes = data.features;

        earthquakes.forEach((earthquake) => {
          earthObject.push({
            category: "earthquake",
            description: earthquake.properties.place,
            DateBegin: new Date(earthquake.properties.time),
            latitude: earthquake.geometry.coordinates[1], // Latitude
            longitude: earthquake.geometry.coordinates[0],
          });
        });
   console.log(NASA);
   console.log(earthObject);
        NASA = NASA.concat(earthObject);
        
       
        NASA.forEach((event) => {
          try {
            const marker = L.marker([event.latitude, event.longitude], {
              icon: icons[event.category],
            }).addTo(map);
            marker.bindPopup(event.description || "No description available");
            marker.on("click", () => {
              ChatArray.push({
                category: event.category,
                description: event.description,
                DateBegin: event.DateBegin,
                latitude: event.latitude,
                longitude: event.longitude,
              });
              if (ChatArray.length > 0) {
                ChatArray.shift();
              }
              console.log(ChatArray);
            });
          } catch (error) {
            console.error("Error processing event:", error);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching earthquake data:", error);
      });
  }

  disasterFilters.addEventListener("change", updateMap);
  updateMap();
});
