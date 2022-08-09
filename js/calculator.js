/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin */

(function(){
    
    var map, data, buffer;

    function setListeners(){
        //reset inputs
        document.querySelectorAll("input").forEach(function(elem){
            console.log(elem)
            //elem.reset();
        })
        //set calculator listener
        document.getElementById("calcSetback").addEventListener("click", function(){
            calcSetback();
        })
    }
    
    function createMap(){
        //map variable
        map = L.map('map').setView([43.3202, -87.9256], 13);
        //openstreetmap basemap
        var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);
        //add bluff crest data
        addData();
    }

    function addData(){
        let crest;
        
        fetch("data/Grafton_BluffCrest.geojson")
            .then(res => res.json())
            .then(function(res){
                crest = L.geoJSON(res).addTo(map);

                data = res;
            })
    }

    // This function calculates the setback based on user input
    function calcSetback(){
        //remove buffer layer if already enabled
        if (buffer){
            map.removeLayer(buffer);
        }
        // read in input and format correctly
        let localReg = parseInt(document.getElementById('local_reg').value),
            height = parseInt(document.getElementById('bluff_height').value),
            curr_angle = parseInt(document.getElementById('curr_bluff_angle').value),
            stable_angle = parseInt(document.getElementById('stable_bluff_angle').value);

        //TODO: calculate the stable angle setback(default example should return 74)
        //width = height/tan(curr_angle)
        let width = height/Math.tan(curr_angle * (Math.PI/180)),
            sas = (height/Math.tan(stable_angle * (Math.PI/180))) - width;
        // See simple_bluff.jpg for the math
        document.getElementById('setback_angle').value = sas;

        let rec_rate = parseInt(document.getElementById('rec_rate').value);
        //calculate the recession setback(default example should return 100)
        let rec_set = rec_rate*50;
            document.getElementById('rec_setback').value = rec_set;

        //calculate the total setback in ft(example should be 199 [25 + 74 + 100])
        let setback = parseInt(localReg + sas + rec_set);
        document.getElementById('setback_ft').value = setback;

        //create temp variable to store buffer data
        let bufferData = clone(data);

        //create buffer line
        bufferData.features[0].geometry.coordinates.forEach(function(coord){
            //convert setback distance into degrees 
            coord.forEach(function(latlng){
                //conversion factor for 1 mile, 69.172 = length of a degree of longitude at equator
                let cf = (Math.cos(latlng[1]) * 69.172) * 5280;                  
                //displace line based on calculaed conversion factor
                latlng[0] = latlng[0] - (setback/cf);
            })

        })
        console.log(bufferData)

        //add buffer line to map
        buffer = L.geoJSON(bufferData, {
            style:function(feature){
                return {
                    color:"red"
                }
            }
        }).addTo(map);
    }
    //function clone data variable to store in new layer for buffer calculation
    function clone(Obj){
        //cloned object
        let buf; 
        //if variable is an array
        if (Obj instanceof Array) {
            //create an empty array
            buf = []; 
            var i = Obj.length;
            while (i--) {
                //recursively clone the elements
                buf[i] = clone(Obj[i]); 
            }
            return buf;
        //if variable is an object
        } else if (Obj instanceof Object) {
            //create an empty object
            buf = {}; 
            for (const k in Obj) {
                //filter out another array's index
                if (Obj.hasOwnProperty(k)) { 
                     //recursively clone the value
                    buf[k] = clone(Obj[k]);
                }
            }
            return buf;
        } else {
            return Obj;
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        createMap();
        setListeners();
    })

})()
