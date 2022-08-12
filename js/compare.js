/*****COASTAL EROSION HISTORICAL COMPARISON*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Jake Steinberg */

let map;

function createMap(){
    map = L.map('compare-map', {
        center: [43.03, -87.92], 
        zoom: 7
    });
    
    //add the basemap layer
    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    getData();
};

//function to retrieve the data and place it on the map
function getData(){
    fetch("data/compare/kenoshaShoreline.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var attributes = processData(json);
            addData(json, attributes);
        })
};

//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        attributes.push(attribute);
        };

    return attributes;
};

function addData(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        toLayer: function(feature, latlng){
            return toLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//function to add only relevant years
function pointToLayer(feature, latlng, attributes){
    //assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];

    //create marker options
    //sort data into two colors based on status
    if (feature.properties[attributes[1]] === '1937' || '2015'){
        var options = {
            fillColor: "#ffb703",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        }} else {
        var options = {
            opacity: 0,
            fillOpacity: 0
        }}

document.addEventListener('DOMContentLoaded',createMap);