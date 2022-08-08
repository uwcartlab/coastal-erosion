/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin */

(function(){
    
    function setListeners(){
        document.getElementById("calcSetback").addEventListener("click", function(){
            calcSetback();
        })
    }
    
    function createMap(){
        //map variable
        let map = L.map('map').setView([43.3202, -87.9256], 13);
        //openstreetmap basemap
        var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);
        //add bluff crest data
        addData(map);
    }

    function addData(map){
        let crest, bufferData, buffer;
        
        fetch("data/Grafton_BluffCrest.geojson")
            .then(res => res.json())
            .then(function(data){
                crest = L.geoJSON(data).addTo(map);

                bufferData = data;
                bufferData.features[0].geometry.coordinates.forEach(function(coord){
                    coord.forEach(function(latlng){
                        latlng[0] = latlng[0] - 0.02
                    })
                })

                buffer = L.geoJSON(bufferData).addTo(map);
            })
    }

    // This function calculates the setback based on user input
    function calcSetback(){
        // read in input and format correctly
        let localReg = parseInt(document.getElementById('local_reg').value),
            height = parseInt(document.getElementById('bluff_height').value),
            curr_angle = parseInt(document.getElementById('curr_bluff_angle').value),
            stable_angle = parseInt(document.getElementById('stable_bluff_angle').value);

        //TODO: calculate the stable angle setback(default example should return 74)
        // See simple_bluff.jpg for the math
        let sas = 0;
            document.getElementById('setback_angle').value = sas;

        let rec_rate = parseInt(document.getElementById('rec_rate').value);
        //calculate the recession setback(default example should return 100)
        let rec_set = rec_rate*50;
            document.getElementById('rec_setback').value = rec_set;

        //calculate the total setback in ft(example should be 199 [25 + 74 + 100])
        let setback = parseInt(localReg + sas + rec_set);
        document.getElementById('setback_ft').value = setback;
    }

    document.addEventListener('DOMContentLoaded', function(){
        createMap();
        setListeners();
    })

})()
