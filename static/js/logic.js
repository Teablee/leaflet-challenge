// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data.features);
    
    // Make function to specify color
    function getColor(depth) {
      switch(true) {
        case depth > 100:
          return "#FF0D0D";
        case depth > 75:
          return "#FF4E11";
        case depth > 50:
          return "#FF8E15";
        case depth > 25:
          return "#FAB733";
        case depth > 10:
          return "#ACB334";
        default:
          return "#69B34C" 
      }
    }
    createFeatures(data.features);


// Make function to store locations of earthquakes
function createFeatures(earthquakeData) {

  // Pop up information
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Circles with dynamic magnitude
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius:feature.properties.mag * 7,
          fillOpacity: 0.5,
          color: getColor(feature.geometry.coordinates[2])
        })
      },
      onEachFeature: onEachFeature
    });

    createMap(earthquakes);

}

});

// Make maps
function createMap(earthquakes) {
    // Add base layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
      });
      
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

      // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite": satellite
     };

     // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
     };

      var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [satellite, streetmap, earthquakes]
      });

       // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


