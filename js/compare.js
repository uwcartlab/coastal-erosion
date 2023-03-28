/*****COASTAL EROSION HISTORICAL COMPARISON*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Jake Steinberg */
(function(){
    //global variables
    let compareMap, //map container variable
        date = 1937, //currently selected date
        shorelineData,
        shoreline,
        crestData,
        crest; //shoreline layer variable 
    //function to create the map and populate it
    function createMap(){
        compareMap = L.map('compare-map', {
            center: [43.135, -87.91], 
            maxBounds: [
                [43.7, -88.17],
                [42.35, -87.09]
            ],
            zoom: 12,
            minZoom: 11,
            maxZoom: 18,
            scrollWheelZoom:false,
            attributionControl:false
        });
        
        //add the basemap layers
        //imagery
        let imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            opacity: 0.8
        }).addTo(compareMap);
        //labels
        var labels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
        }).addTo(compareMap);

        // create legend control holding svg legend
        let legend = L.Control.extend({
            options: {
                position: "topright"
            },
            onAdd:function(){
                var container = L.DomUtil.create('div','legend-control-container');

                //svgs for the legend elements
                let toeLegend = '<svg id="leg-1937"><polyline points="10,10 40,40"style="fill:none;stroke:#ff8000;stroke-width:4;stroke-linecap:round;stroke-opacity:0.8"/></svg><p id="toe-legend">1937 Bluff Toe</p><br/>'
                let crestLegend = '<svg id="leg-1937"><polyline points="10,10 40,40"style="fill:none;stroke:#000000;stroke-width:4;stroke-linecap:round;stroke-opacity:0.8"/></svg><p id="crest-legend">1937 Bluff Crest</p>'

                container.insertAdjacentHTML('beforeend',toeLegend);
                container.insertAdjacentHTML('beforeend',crestLegend);

                return container;
            }
        });
        //add legend to map
        compareMap.addControl(new legend());
        //add data and populate page
        getData();
        createPopUps();
        createTimeline();
        setListeners();
    };

    //function to create the timeline control
    function createTimeline(){
        let years = [1937, 1956, 1970, 1980, 1995, 2005, 2015],
            length = years.length -1;
        //create timeline control
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
        //add timeline control to the map
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
        //update year 
        function updateYear(){
            let slider = document.querySelector(".slider"),
                offset = (slider.value / slider.max) * slider.clientWidth;
            document.querySelector(".selected").innerHTML = date;
            document.querySelector(".selected").style.left = offset + "px";

            compareMap.removeLayer(shoreline);
            shoreline = createLayer(shorelineData, "toe");

            compareMap.removeLayer(crest);
            crest = createLayer(crestData, "crest");

            document.querySelector("#toe-legend").innerHTML = date + " Bluff Toe";
            document.querySelector("#crest-legend").innerHTML = date + " Bluff Crest";

        }
    }

    //function to retrieve the data and place it on the map
    function getData(){
        fetch("./data/compare/total_blufftoe.geojson")
            .then(function(response){
                return response.json();
            })
            .then(function(json){
                shorelineData = json; 
                shoreline = createLayer(shorelineData, "toe");
            })
        fetch("./data/compare/total_bluffcrest.geojson")
            .then(function(response){
                return response.json();
            })
            .then(function(json){
                crestData = json; 
                crest = createLayer(crestData, "crest");
            })
    };

    //function to create shoreline layer
    function createLayer(json, type){
        let layer = L.geoJson(json, {
            style: function(feature){
                return style(feature, type);
            }
        }).addTo(compareMap);
        return layer; 
    }

    //style function style relevant years
    function style(feature, type){
        //color selected year
        if (feature.properties.date === date.toString()){
            return {
                color: type == 'toe' ? '#ff8000': '#0d0d0d', //color selected line based on type
                weight: 2.5,
                opacity: 1,
                pane:"popupPane"
            }
        //unselected years are transparent
        }else {
            return {
                color: '#ffffff',
                opacity: 0.25,
                weight:3.5,
                dashArray: "5 10",
                pane:"shadowPane"
        }}
    };
    //function to create popup indicators
    function createPopUps(){
        fetch('./data/popUps.geojson')
            .then(res => res.json())
            .then(function(data){
                L.geoJson(data, {
                    pointToLayer: function(feature, latlng){
                        let marker = L.marker(latlng);
                        return marker;
                    }
                }).addTo(compareMap);
            })

    };
    //function to set listeners for the "see on map" buttons
    function setListeners(){
        document.querySelectorAll(".see-on-map").forEach(function(elem){
            let lon = parseFloat(elem.getAttribute("data-lon")),
                lat = parseFloat(elem.getAttribute("data-lat"));
                zoom = parseFloat(elem.getAttribute("data-zoom"));
            elem.addEventListener("click",function(){
                compareMap.flyTo([lat,lon], zoom);
            })
        })
    }

    document.addEventListener('DOMContentLoaded', createMap);
})()