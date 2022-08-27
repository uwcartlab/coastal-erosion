/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin */

(function(){
    
    var map, toe_data, crest_data, sas_line, rec_line, reg_line, setback_line;
    //bluff parameters
    var local_reg, bluff_height = 100, curr_angle = 30, stable_angle, bluff_width, rec_rate, rec_years;
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
        document.getElementById("calcReg").addEventListener("click", function(e){
            calcReg();
        })
        //set calculator listener
        /*document.getElementById("calcSetback").addEventListener("click", function(e){
            calcSetback();
        })*/
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
        map = L.map('map',{  
            attributionControl: false,
        }).setView([43.3102, -87.8956], 13);
        //openstreetmap basemap
        var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            opacity:0.7,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);
        //add bluff crest data
        addData();
        //create location control
        let legendContainer = L.Control.extend({
            options:{
                position:"bottomright"
            },
            onAdd: function () {
                // create the control container with a particular class name
                var container = L.DomUtil.create('div', 'leaflet-legend');

                let legend = '<div class="line-caption"><svg height="10" width="30"><rect width="35" height="8" style="stroke:#ffff99;fill:#ffff99;fill-opacity:0.6;stroke-width:2" /></svg>';
                legend += '<p>Bluff Area</p></div>';

                container.insertAdjacentHTML("beforeend",legend)

                return container;
            }
        });

        map.addControl(new legendContainer());
    }

    function addData(){
        let toe, crest;
        //dash fill pattern
        var stripes = new L.StripePattern({
            weight:2,
            spaceWeight:6,
            color:"#ffff99",
            opacity:0.5,
            spaceColor:"#ffff99",
            spaceOpacity:0.25,
            angle:-30
        }); stripes.addTo(map);
        
        fetch("data/bluff_area.geojson")
            .then(res => res.json())
            .then(function(res){
                L.geoJSON(res,{
                    style:function(feature){
                        return {
                            color:"#ffff99",
                            weight:2,
                            opacity:0.7,
                            fillOpacity:1,
                            fillPattern: stripes
                        }
                    }
                }).addTo(map);
        })
        
        fetch("data/OZ_BluffToe.geojson")
            .then(res => res.json())
            .then(function(res){
                toe = L.geoJSON(res);
                toe_data = res;
            })
        
        fetch("data/OZ_BluffCrest.geojson")
            .then(res => res.json())
            .then(function(res){
                crest = L.geoJSON(res);
                crest_data = res;
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
            .text("Width: " + Math.round(bluff_width) + " ft.");
        //create opposite and activate listeners for dragging
        let opp = svg.append("line")
            .attr("class","line opp")
            .attr("x1",reverseScale(bluff_width))
            .attr("x2",reverseScale(bluff_width))
            .attr("y1",reverseScale(bluff_height))
            .attr("y2",height)
            //event triggers when opposite side is selected
            .on("mousedown",function(){
                //remove affordance
                document.querySelector(".triangle-intro-container").style.display = "none";
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
                    //subtract y position from height and padding (10) to get the position in relation to the svg 
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
                    //update opposite labels
                    d3.select(".label_height")
                        .attr("x",parseInt(posx) + 45)
                        .attr("y",function(){
                            return posy + ((height - posy)/2 - 20);
                        })
                    d3.select(".label_opp")
                        .attr("x",parseInt(posx) + 40)
                        .attr("y",function(){
                            return posy + ((height - posy)/2);
                        })
                        .text(Math.round(bluff_height) + " ft.")
                    //update adjacent width
                    d3.select(".adj")
                        .attr("x2",posx);
                    //update adjacent label
                    d3.select(".label_adj")
                        .attr("x",parseInt(posx)/2 + 20)
                        .text("Width: " + Math.round(bluff_width) + " ft.")
                    //update hypotenuese
                    d3.select(".hyp")
                        .attr("x2",posx)
                        .attr("y2",posy)
                    //update angle based on new parameters
                    curr_angle = Math.atan(bluff_height/bluff_width) * (180/Math.PI);
                    //update hypotenuse angle
                    d3.select(".label_angle")
                        .attr("transform","translate(" + reverseScale(bluff_width)/2 + "," + (posy + (height - posy)/2 - 20) +") rotate(-" + curr_angle + ")")
                        .text("Angle: " + Math.round(curr_angle) + " deg.");
                }
            });  
        //create opposite side labels
        let height_label = svg.append("text")
            .attr("class","label_height")
            .attr("x",reverseScale(bluff_width) + 45)
            .attr("y",height - (reverseScale(bluff_height)/2) - 20)
            .style("text-anchor","middle")
            .text("Height:");
        let opp_label = svg.append("text")
            .attr("class","label_opp")
            .attr("x",reverseScale(bluff_width) + 40)
            .attr("y",height - (reverseScale(bluff_height)/2))
            .style("text-anchor","middle")
            .text(bluff_height + " ft.");
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
            .attr("transform","translate(" + reverseScale(bluff_width)/2 + "," + (reverseScale(bluff_height) + (height - reverseScale(bluff_height))/2 - 20) +") rotate(-" + curr_angle + ")")
            .style("text-anchor","start")
            .text("Angle: " + curr_angle + " deg.");

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

        //move the visual affordance for the interface
        document.querySelector(".triangle-intro-container").style.top = document.querySelector("#triangle").offsetTop + (parseInt(document.querySelector(".label_opp").attributes.y.value)*0.2) + "px";
        document.querySelector(".triangle-intro-container").style.left = document.querySelector("#triangle").offsetLeft + (parseInt(document.querySelector(".label_opp").attributes.x.value)*0.75) + "px";
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
        sas_line = addSetbackLine(sas, "orange","toe").addTo(map);
        addSetbackLegend("orange", "Stable Slope Setback","legend-sas")
    }
    //calculate recession rate
    function calcRec(){
        rec_rate = parseInt(document.getElementById('rec_rate').value);
        rec_years = parseInt(document.getElementById('rec_years').value);
        //calculate the recession setback(default example should return 100)
        rec_set = rec_rate * rec_years;

        document.getElementById('rec_setback').value = rec_set;

        //remove old line if already drawn
        if (rec_line)
            map.removeLayer(rec_line);
        //draw line
        rec_line = addSetbackLine(rec_set, "green","crest").addTo(map);
        addSetbackLegend("green", "Recession Setback","legend-rec")
    }
    //calculate local regulations
    function calcReg(){
        local_reg = parseInt(document.getElementById('local_reg').value);
        reg_line = addSetbackLine(local_reg, "purple","crest").addTo(map);
        addSetbackLegend("purple", "Local Regulation", "legend_reg")
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
        addSetbackLegend("red", "Total Setback", "legend_tot")

    }
    //function to add a line to the map
    function addSetbackLine(buffer, color, type){
        //create temp variable to store setback_line data
        let line_data;
        if (type == "toe")
            line_data = clone(toe_data);
        else
            line_data = clone(crest_data);
        
        console.log(line_data)
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
    function addSetbackLegend(color, caption, class_name){            
        if (document.querySelector("." + class_name)){
            document.querySelector("." + class_name).remove();
        }
        
        let legend = '<div class="line-caption ' + class_name +'"><svg height="10" width="30"><line x1="0" y1="5" x2="100" y2="5" style="stroke:' + color + ';stroke-width:4" /></svg>';
        legend += '<p>' + caption + '</p></div>'
        document.querySelector(".leaflet-legend").insertAdjacentHTML("beforeend",legend);
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
        //adjust map width
        document.querySelector("#map").style.width = document.querySelector(".map-container").clientWidth + "px";

        createTriangle();
        createMap();
        setListeners();
    })

    window.addEventListener('resize', function(){
        //adjust map width
        document.querySelector("#map").style.width = document.querySelector(".map-container").clientWidth + "px";
    })

})()
