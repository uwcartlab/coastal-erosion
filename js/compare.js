/*****COASTAL EROSION HISTORICAL COMPARISON*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Jake Steinberg */

let compareMap, date = 1937, shoreline;

function createMap(){
    compareMap = L.map('compare-map', {
        center: [43.235, -87.91], 
        maxBounds: [
            [43.7, -88.17],
            [42.35, -87.09]
        ],
        zoom: 17,
        minZoom: 11,
        maxZoom: 18,
        attributionControl:false
    });
    
    //add the basemap layer
    let EsriWorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        opacity: 0.8
    }).addTo(compareMap);

    
    var CartoDBVoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
    }).addTo(compareMap);


    //svgs for the legend elements
    let legSvg1 = '<svg id="leg-1937"><polyline points="10,10 40,40"style="fill:none;stroke:#FE2E2E;stroke-width:4;stroke-dasharray:5,10;stroke-linecap:round;stroke-opacity:0.8"/></svg>'
    legSvg1 += '<p id="year1-legend">1937 shoreline</p>';

    // create legend control holding svg legend and add to map
    let legend = L.Control.extend({
        options: {
            position: "topright"
        },
        onAdd:function(){
            var container = L.DomUtil.create('div','legend-control-container');
            container.insertAdjacentHTML('beforeend',legSvg1);
            return container;
        }
    });
    compareMap.addControl(new legend());

    getData();
    createPopUps();
    createTimeline();
    setListeners();
};

//function to create the timeline control
function createTimeline(){
    let years = [1937, 1956, 1970, 1980, 1995, 2005, 2015],
        length = years.length -1;
    // create legend control holding svg legend and add to map
    let timeline = L.Control.extend({
        options: {
            position: "bottomleft"
        },
        onAdd:function(){
            var container = L.DomUtil.create('div','timeline-control-container');
            container.insertAdjacentHTML('beforeend','<p class="selected">1937</p>');
            container.insertAdjacentHTML('beforeend','<button class="step" id="reverse"><</button>');
            container.insertAdjacentHTML('beforeend','<input type="range" min="0" max="' + length +'" value="0" step="1" class="slider" id="timeline">');
            container.insertAdjacentHTML('beforeend','<button class="step" id="forward">></button>');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    compareMap.addControl(new timeline());

    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){

            var index = document.querySelector('.slider').value;
            
            //increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //if past the last attribute, wrap around to first attribute
                index = index > length ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //if past the first attribute, wrap around to last attribute
                index = index < 0 ? length : index;
            };
            //update slider
            document.querySelector('.slider').value = index;
            date = years[index];
            updateYear();

        })
    })
    document.querySelector('.slider').addEventListener('input', function(){            
        var index = this.value;
        date = years[index];
        updateYear();
    });

    function updateYear(){
        let slider = document.querySelector(".slider"),
            offset = (slider.value / slider.max) * slider.clientWidth;
        document.querySelector(".selected").innerHTML = date;
        document.querySelector(".selected").style.left = offset + "px";

        shoreline.setStyle(toLayer)
        document.querySelector("#year1-legend").innerHTML = date + " Shoreline";
    }
}

//function to retrieve the data and place it on the map
function getData(){
    /*fetch("data/compare/kenoshaShoreline.geojson")
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
        })*/
    fetch("data/compare/totalShoreline.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            addData(json);
        })
};

function addData(data){
    //create a Leaflet GeoJSON layer and add it to the map
    shoreline = L.geoJson(data, {
        style: function(feature){
            return toLayer(feature);
        }
    }).addTo(compareMap);
};

//function to add only relevant years
function toLayer(feature){
    //sort data into two colors
    if (feature.properties.Date_ === date.toString()){
        return {
            color: '#FE2E2E',
            weight: 5,
            opacity: 0.7,
            dashArray: "5 10"
        }
    }else {
        return {
            color: '#000000',
            opacity: 0,
    }} /*else if (feature.properties.Date_ === '2015'){
        return {
            color: '#610B0B',
            weight: 5,
            opacity: 0.7,
            dashArray: "5 10"
        }
    //make nonrelevant years invisible. TODO: change cursor behavior
    } */
};

function createPopUps(){

    fetch('data/popUps.geojson')
        .then(res => res.json())
        .then(function(data){
            L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    let marker = L.marker(latlng);
                    //code for pop ups - removed after moving images to html body
                    /*marker.bindPopup("<div class= popup-content><img id ='popup-img' src=" + feature.properties.image + 
                    "><br><p class>" +feature.properties.text + "</p><div>");*/
                    return marker;
                }
            }).addTo(compareMap);
        })

};

function setListeners(){
    document.querySelectorAll(".see-on-map").forEach(function(elem){
        let lon = parseFloat(elem.getAttribute("data-lon")),
            lat = parseFloat(elem.getAttribute("data-lat"));
        console.log([lat,lon])
        elem.addEventListener("click",function(){
            compareMap.flyTo([lat,lon]);
        })
    })
}

document.addEventListener('DOMContentLoaded', createMap);