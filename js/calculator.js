/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin */

(function(){
    
    var map, data, buffer;
    //bluff parameters
    var localReg, bluff_height = 100, curr_angle = 30, stable_angle = 22, bluff_width, rec_rate;
    //bluff results
    var sas, rec_set, setback;

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

    //function to create the triangle
    function createTriangle(){
        //create bluff scale
        let scale = d3.scaleLinear()
            .domain([0, 400])
            .range([0, 200]);
        
        let reverseScale = d3.scaleLinear()
            .domain([0, 200])
            .range([0, 400]);
        
        let current = reverseScale(bluff_height/Math.tan(curr_angle * (Math.PI/180)));
        console.log(current)
        //create the triangle interface    
        let svg = d3.select("#triangle")
            .append("svg")
            .attr("class","triangle_interface");
        //get current height and width of the triangle interface, based on the viewport w/h
        let height = svg.style("height"),
            width = svg.style("width");
            
        //user-inputted triangle
        let adj = svg.append("line")
            .attr("class","line adj")
            .attr("x1",0)
            .attr("x2",current)
            .attr("y1",height)
            .attr("y2",height);  

        let adj_label = svg.append("text")
            .attr("class","label_adj")
            .attr("x",parseInt(current)/2)
            .attr("y",parseInt(height) - 10)
            .style("text-anchor","middle")
            .text(Math.round(scale(current)));

        let opp = svg.append("line")
            .attr("class","line opp")
            .attr("x1",current)
            .attr("x2",current)
            .attr("y1",reverseScale(bluff_height))
            .attr("y2",height)
            .on("mousedown",function(){
                //activate dragging of triangle border
                svg.on("mousemove",function(){
                    let posx = event.clientX - 50,
                        posy = event.clientY;
                    updatePos(posx, posy)
                })
                //final position on new line
                svg.on("mouseup",function(){
                    let posx = event.clientX - 50,
                        posy = event.clientY;
                    updatePos(posx, posy)
                    //remove active listeners    
                    svg.on("mouseup",null)
                    svg.on("mousemove",null)
                })

                function updatePos(posx, posy){
                    let h = posy - parseInt(height);
                    console.log(h)
                    //update bluff height value
                    bluff_width = scale(posx/2);
                    //set new position
                    d3.select(".opp")
                        .attr("x1",posx)
                        .attr("y1",h)
                        .attr("x2",posx);
                    //LEFT OFF HERE
                    bluff_height = parseInt(d3.select(".opp").attr("y2")) - parseInt(d3.select(".opp").attr("y1"));

                    //update opposite label
                    d3.select(".label_opp")
                        .attr("x",parseInt(posx) + 20)
                        .attr("y",function(){
                            return h + ((parseInt(height) - h)/2);
                        })
                        .text(Math.round(bluff_height))
                    //update adjacent
                    d3.select(".adj")
                        .attr("x2",posx);
                    //update adjacent label
                    d3.select(".label_adj")
                        .attr("x",parseInt(posx)/2 + 20)
                        .text(scale(posx/2))
                    //update hypotenuese
                    d3.select(".hyp")
                        .attr("x2",posx)
                        .attr("y2",h)
                    //update angle
                    curr_angle = Math.atan(bluff_height/bluff_width) * (180/Math.PI);

                    d3.select(".label_angle")
                        .attr("x",parseInt(posx)/2)
                        .attr("y",parseInt(height) - 50)
                        .text(curr_angle);
                }
            });  
        
        let opp_label = svg.append("text")
            .attr("class","label_opp")
            .attr("x",parseInt(current) + 20)
            .attr("y",reverseScale(bluff_height))
            .style("text-anchor","middle")
            .text(bluff_height);
        
        let hyp2 = svg.append("line")
            .attr("class","line hyp")
            .attr("x1",0)
            .attr("x2",current)
            .attr("y1",height)
            .attr("y2",reverseScale(bluff_height)); 
        
        let angle_label = svg.append("text")
            .attr("class","label_angle")
            .attr("x",parseInt(current)/2)
            .attr("y",parseInt(height)-50)
            .style("text-anchor","middle")
            .text(curr_angle);

        //calculated triangle

         /*let adj = svg.append("line")
           .attr("class","line adj")
           .attr("x1",0)
           .attr("x2",width)
           .attr("y1",height)
           .attr("y2",height);  

        let opp = svg.append("line")
           .attr("class","line opp")
           .attr("x1",width)
           .attr("x2",width)
           .attr("y1",0)
           .attr("y2",height);  
       
        let hyp = svg.append("line")
           .attr("class","line hyp")
           .attr("x1",0)
           .attr("x2",width)
           .attr("y1",height)
           .attr("y2",0);  
        
        let diff = svg.append("line")
           .attr("class","line hyp")
           .attr("x1",current)
           .attr("x2",width)
           .attr("y1",0)
           .attr("y2",0);  */
    }

    // This function calculates the setback based on user input
    function calcSetback(){
        //remove buffer layer if already enabled
        if (buffer){
            map.removeLayer(buffer);
        }
        // read in input and format correctly
        let localReg = parseInt(document.getElementById('local_reg').value);

        //TODO: calculate the stable angle setback(default example should return 74)
        //width = height/tan(curr_angle)
        bluff_width = bluff_height/Math.tan(curr_angle * (Math.PI/180));
            sas = (bluff_height/Math.tan(stable_angle * (Math.PI/180))) - bluff_width;
        // See simple_bluff.jpg for the math
        //document.getElementById('setback_angle').value = sas;

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
        createTriangle();
        createMap();
        setListeners();
    })

})()
