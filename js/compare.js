/*****COASTAL EROSION HISTORICAL COMPARISON*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Jake Steinberg */

let compareMap;

function createMap(){
    compareMap = L.map('compare-map', {
        center: [43.235, -87.91], 
        zoom: 17
    });
    
    //add the basemap layer
    let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(compareMap);

    //svgs for the legend elements
    let legSvg1 = '<svg id="leg1937"><polyline points="20,20 40,40"style="fill:none;stroke:#998ec3;stroke-width:4" /></svg>'
    legSvg1 += '<text id="year1Legend" x="100" y="100"><br>1937 shoreline<br></text>';
    let legSvg2 = '<svg id="leg2015"><polyline points="20,20 40,40"style="fill:none;stroke:#f1a340;stroke-width:4" /></svg>'
    legSvg2 += '<text id="year2Legend" x="100" y="100"><br>2015 shoreline<br></text>';

    // create legend control holding svg legend and add to map
    let legend = L.Control.extend({
        options: {
            position: "topright"
        },
        onAdd:function(){
            var container = L.DomUtil.create('div','legend-control-container');
            container.insertAdjacentHTML('beforeend',legSvg1);
            container.insertAdjacentHTML('beforeend',legSvg2);
            return container;
        }
    });
    compareMap.addControl(new legend());

    getData();
};

//function to retrieve the data and place it on the map
function getData(){
    fetch("data/compare/kenoshaShoreline.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            addData(json);
        })
    fetch("data/compare/racineShoreline.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            addData(json);
        })
    fetch("data/compare/milwaukeeShoreline.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            addData(json);
        })
    fetch("data/compare/ozaukeeShoreline.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            addData(json);
        })
};

function addData(data){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        style: function(feature){
            return toLayer(feature);
        }
    }).addTo(compareMap);
};

//function to add only relevant years
function toLayer(feature){
    //sort data into two colors
    if (feature.properties.Date_ === '1937'){
        return {
            color: '#998ec3',
            weight: 4,
            opacity: 1
        }
    } else if (feature.properties.Date_ === '2015'){
        return {
            color: '#f1a340',
            weight: 4,
            opacity: 1
        }
    //make nonrelevant years invisible. TODO: change cursor behavior
    } else {
        return {
            color: '#000000',
            opacity: 0,
        }}
    };

document.addEventListener('DOMContentLoaded', createMap);