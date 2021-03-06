// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data.features);
    
    // Make function to specify color based on earthquake depth
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
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<hr><p>" + "Mag: " + feature.properties.mag + " Depth: " + feature.geometry.coordinates[2] + "</p>");
    }

    // Circles with dynamic magnitude and color by earthquake depth
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

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
        labels= ['<strong>Earthquake Depths(ft)</strong>'],
        categories = ['<10', '10-25', '25-50', '50-75', '75-100', '>100'];


    var colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
        

    for (var i = 0; i<categories.length; i++) {
        div.innerHTML +=
        labels.push(
            '<i class="circle" style="background:' + colors[i] + '"></i> ' +
            (categories[i] ? categories[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
        };
        
      legend.addTo(myMap)
    }