/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin */

(function(){
    
    var map, legendContainer, data, sas_line, rec_line, reg_line, setback_line;
    //bluff parameters
    var local_reg, bluff_height = 100, curr_angle = 30, stable_angle, bluff_width, rec_rate;
    //bluff results
    var sas, rec_set, setback;

    function setListeners(){
        //reset inputs GET BACK TO
        document.querySelectorAll("input").forEach(function(elem){
            elem.value = elem.defaultValue;
        })
        //set listener to collapse each section of the calculator
        document.querySelectorAll(".section-header").forEach(function(elem){
            elem.addEventListener("click",function(){
                //jump to calculation section on click
                window.location.href = '#' + elem.title;
            })
        })
        //set sas calculator listener
        document.getElementById("calcSas").addEventListener("click", function(e){
            calcSas();
        })
        //set recession calculator listener
        document.getElementById("calcRec").addEventListener("click", function(e){
            calcRec();
        })
        //set local regulation calculator listener
        /*document.getElementById("calcReg").addEventListener("click", function(e){
            calcReg();
        })*/
        //set calculator listener
        document.getElementById("calcSetback").addEventListener("click", function(e){
            calcSetback();
        })
        //update display based on button selection
        document.querySelectorAll(".next").forEach(function(elem){
            elem.addEventListener("click",function(){
                document.getElementById('step' + (parseInt(elem.title) + 1)).scrollIntoView();
            })
        })
        //position sidebar
        let sidebarHeight = document.querySelector(".sidebar").clientHeight,
            menuHeight = document.querySelector(".menu").clientHeight;

        document.querySelector(".menu").style.marginTop = (sidebarHeight/2) - (menuHeight/2) + "px";

        //bluff material menu
        document.querySelectorAll(".material").forEach(function(elem){
            elem.addEventListener("click",function(){
                document.querySelector("#material-button").innerHTML = elem.innerHTML;
                if (elem.title){
                    document.querySelector("#stable_bluff_angle").value = elem.title;
                }
            })
        })
        //stable bluff angle
        document.querySelector("#stable_bluff_angle").addEventListener("input",function(){
            document.querySelector("#material-button").innerHTML = "Custom";
        })

        //bold menu titles
        document.addEventListener("scroll",function(){
            let scrollPos = window.pageYOffset;
            document.querySelectorAll(".section-content").forEach(function(elem, i){
                let scrollBottom = elem.offsetTop + (elem.clientHeight/2), scrollTop = elem.offsetTop - (elem.clientHeight/2);
                if (scrollPos >= scrollTop && scrollPos <= scrollBottom){
                    document.querySelector("#title" + (i+1)).style.fontWeight = "bold";
                }
                else{
                    document.querySelector("#title" + (i+1)).style.fontWeight = "normal";
                }
            })
        })

    }
    
    function createMap(){
        //map variable
        map = L.map('map').setView([43.3102, -87.8056], 13);
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
        //create the triangle interface    
        let svg = d3.select("#triangle")
            .append("svg")
            .attr("class","triangle_interface");
        //get current height and width of the triangle interface, based on the viewport w/h
        let height = parseInt(svg.style("height"));
        //create bluff scales
        //scale for converting pixels to bluff height in ft.
        let yscale = d3.scaleLinear()
             .domain([0, height])
             .range([200, 0]);
        //scale for converting pixels to bluff width in ft.
        let xscale = d3.scaleLinear()
             .domain([0, height])
             .range([0, 200]);
        //scale for converting ft. to pixels
        let reverseScale = d3.scaleLinear()
             .domain([0, 200])
             .range([0, height]);
        //calculate current bluff width based on default height and angle
        bluff_width = bluff_height/Math.tan(curr_angle * (Math.PI/180));
        
        //base triangle, includes opposite side, adjacent side, and hypotenuse (remember trigonometry?? lol)
        //create adjacent side and label
        let adj = svg.append("line")
            .attr("class","line adj")
            .attr("x1",0)
            .attr("x2",reverseScale(bluff_width))
            .attr("y1",height)
            .attr("y2",height);  
        let adj_label = svg.append("text")
            .attr("class","label_adj")
            .attr("x",reverseScale(bluff_width)/2)
            .attr("y",height - 10)
            .style("text-anchor","middle")
            .text(Math.round(bluff_width));
        //create opposite and activate listeners for dragging
        let opp = svg.append("line")
            .attr("class","line opp")
            .attr("x1",reverseScale(bluff_width))
            .attr("x2",reverseScale(bluff_width))
            .attr("y1",reverseScale(bluff_height))
            .attr("y2",height)
            //event triggers when opposite side is selected
            .on("mousedown",function(){
                //activate dragging of triangle border
                svg.on("mousemove",function(){
                    let posx = event.clientX - 50,
                        posy = event.clientY;
                    updatePos(posx, posy)

                    d3.select(".opp")
                        .style("stroke-width","10px")
                })
                //final position on new line
                svg.on("mouseup",function(){
                    let posx = event.clientX - 50,
                        posy = event.clientY;
                    updatePos(posx, posy)
                    //remove active listeners    
                    svg.on("mouseup",null)
                    svg.on("mousemove",null)

                    d3.select(".opp")
                        .style("stroke-width","5px")
                })
                //function to update position of triangle
                function updatePos(posx, posy){
                    let offsetx = parseInt(document.querySelector(".sidebar").clientWidth) - 10,
                        offsety = window.pageYOffset > document.querySelector("#triangle").offsetTop ? window.pageYOffset: document.querySelector("#triangle").offsetTop - window.pageYOffset;
                    //FINISH
                        console.log(offsety)
                    //subtract y position from height and padding (10) to get the position in relation to the svg 
                    //WHAT IS CAUSING THE OFFSET VALUE???
                    posy = posy - offsety;
                    posx = posx - offsetx;
                    //set new position of opposite side
                    d3.select(".opp")
                        .attr("x1",posx)
                        .attr("y1",posy)
                        .attr("x2",posx);
                    //get new bluff width and height
                    bluff_height = yscale(posy);
                    bluff_width = xscale(posx);
                    //update opposite label
                    d3.select(".label_opp")
                        .attr("x",parseInt(posx) + 20)
                        .attr("y",function(){
                            return posy + ((height - posy)/2);
                        })
                        .text(Math.round(bluff_height))
                    //update adjacent width
                    d3.select(".adj")
                        .attr("x2",posx);
                    //update adjacent label
                    d3.select(".label_adj")
                        .attr("x",parseInt(posx)/2 + 20)
                        .text(Math.round(bluff_width))
                    //update hypotenuese
                    d3.select(".hyp")
                        .attr("x2",posx)
                        .attr("y2",posy)
                    //update angle based on new parameters
                    curr_angle = Math.atan(bluff_height/bluff_width) * (180/Math.PI);
                    //update hypotenuse angle
                    d3.select(".label_angle")
                        .attr("x",parseInt(posx)/2)
                        .attr("y",parseInt(height) - 50)
                        .text(Math.round(curr_angle));
                }
            });  
        //create opposite side label
        let opp_label = svg.append("text")
            .attr("class","label_opp")
            .attr("x",reverseScale(bluff_width) + 20)
            .attr("y",height - (reverseScale(bluff_height)/2))
            .style("text-anchor","middle")
            .text(bluff_height);
        //create hypotenuse
        let hyp = svg.append("line")
            .attr("class","line hyp")
            .attr("x1",0)
            .attr("x2",reverseScale(bluff_width))
            .attr("y1",height)
            .attr("y2",reverseScale(bluff_height)); 
        //add label for angle
        let angle_label = svg.append("text")
            .attr("class","label_angle")
            .attr("x",reverseScale(bluff_width)/2)
            .attr("y",height-50)
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
    //calculate stable angle setback
    function calcSas(){
        
        stable_angle = parseInt(document.getElementById('stable_bluff_angle').value);
        //calculate bluff width based on current values
        bluff_width = bluff_height/Math.tan(curr_angle * (Math.PI/180));
        //calculate stable angle setback based on current values
        sas = (bluff_height/Math.tan(stable_angle * (Math.PI/180))) - bluff_width;

        document.getElementById('stable_angle_setback').value = sas;
        //remove old line if already drawn
        if (sas_line)
            map.removeLayer(sas_line);
        //draw line
        sas_line = addSetbackLine(sas, "orange").addTo(map);
        addSetbackLegend("orange", "Stable Angle Setback")
    }
    //calculate recession rate
    function calcRec(){
        rec_rate = parseInt(document.getElementById('rec_rate').value);
        //calculate the recession setback(default example should return 100)
        rec_set = rec_rate * 50;

        document.getElementById('rec_setback').value = rec_set;

        //remove old line if already drawn
        if (rec_line)
            map.removeLayer(rec_line);
        //draw line
        rec_line = addSetbackLine(rec_set + sas, "green").addTo(map);
        addSetbackLegend("green", "Stable Angle Setback & Recession Setback")
    }
    //calculate local regulations
    function calcReg(){
        local_reg = parseInt(document.getElementById('local_reg').value);
    }

    // This function calculates the setback based on user input
    function calcSetback(){
        //get local regulation
        local_reg = parseInt(document.getElementById('local_reg').value);
        //calculate the total setback in ft(example should be 199 [25 + 74 + 100])
        let setback = parseInt(local_reg + sas + rec_set);
        document.getElementById('setback_ft').value = setback;
        //remove old line if already drawn
        if (setback_line)
            map.removeLayer(setback_line);
        //draw line
        setback_line = addSetbackLine(setback, "red").addTo(map);
        addSetbackLegend("red", "Total Setback")

    }
    //function to add a line to the map
    function addSetbackLine(buffer, color){
        //create temp variable to store setback_line data
        let line_data = clone(data);
        //create a setback line
        line_data.features[0].geometry.coordinates.forEach(function(coord){
            //convert setback distance into degrees 
            coord.forEach(function(latlng){
                //conversion factor for 1 mile, 69.172 = length of a degree of longitude at equator
                let cf = (Math.cos(latlng[1]) * 69.172) * 5280;                  
                //displace line based on calculaed conversion factor
                latlng[0] = latlng[0] - (buffer/cf);
            })
        })
        //add setback_line line to map
        let line = L.geoJSON(line_data, {
            style:function(feature){
                return {
                    color:color
                }
            }
        });
        return line;
    }
    //function to create line legend
    function addSetbackLegend(color, caption){
        if (!legendContainer){
            //create location control
            legendContainer = L.Control.extend({
                options:{
                    position:"bottomright"
                },
                onAdd: function () {
                    // create the control container with a particular class name
                    var container = L.DomUtil.create('div', 'leaflet-legend');
                    return container;
                }
            });

            map.addControl(new legendContainer());

            let legend = '<div class="line-caption"><svg height="10" width="100"><line x1="0" y1="5" x2="100" y2="5" style="stroke:' + color + ';stroke-width:4" /></svg>';
            legend += '<p>' + caption + '</p></div>'
            document.querySelector(".leaflet-legend").insertAdjacentHTML("afterend",legend);
        }
    }
    //function clone data variable to store in new layer for setback_line calculation
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
