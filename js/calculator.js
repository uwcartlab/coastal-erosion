/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin */

//to do
//adjust width of bluff based on selected value in the calculator

(function(){
    
    var map, //map container
        toeData, //bluff toe data
        crestData, //bluff crest data
        sasLine, //stable angle slope setback line
        recLine, //recession setback line
        regLine; //local regulation setback line
    //stable angle setback    
    var bluffHeight = 100, 
        currAngle = 30, 
        stableAngle = 22, 
        bluffWidth,
        sas;
    //recession rate setback
    var recRate, 
        recYears,
        recSet;
    //local regulation setback
    var localReg;
    //default bluff width in data
    var defaultWidth = 42;

    function setListeners(){
        //reset inputs
        document.querySelectorAll("input").forEach(function(elem){
            elem.value = elem.defaultValue;
        })
        //set sas input value listeners
        document.querySelector("#slope-angle").addEventListener("change",function(e){
            let value = e.target.value >= stableAngle ? e.target.value : stableAngle;
            e.target.value = value;
        })
        //set sas calculator listener
        document.getElementById("calc-sas").addEventListener("click", function(e){
            calcSas();
        })
        //set recession calculator listener
        document.getElementById("calc-rec").addEventListener("click", function(e){
            calcRec();
        })
        //set local regulation calculator listener
        document.getElementById("calc-reg").addEventListener("click", function(e){
            calcReg();
        })
        //bluff material menu
        document.querySelectorAll(".material").forEach(function(elem){
            elem.addEventListener("click",function(){
                document.querySelector("#material-button").innerHTML = elem.innerHTML;
                if (elem.title){
                    document.querySelector("#stable-bluff-angle").value = elem.title;
                }
            })
        })
        //stable bluff angle
        document.querySelector("#stable-bluff-angle").addEventListener("input",function(){
            document.querySelector("#material-button").innerHTML = "Custom";
        })
    }
    
    function createMap(){
        //map variable
        map = L.map('calc-map',{  
            attributionControl: false,
            scrollWheelZoom:false,
            maxBounds: [
                [43.28034,  -87.904554],
                [43.35121, -87.88206]
            ]
        }).setView([43.31903, -87.88665], 16);

        L.control.scale().addTo(map);

        //add bluff crest data
        addLake();
        addCrest();
        addToe();
        //create legend control
        let legendContainer = L.Control.extend({
            options:{
                position:"bottomright"
            },
            onAdd: function () {
                // create the control container with a particular class name
                var container = L.DomUtil.create('div', 'leaflet-legend');

                let legend = '<div class="line-caption"><svg height="10" width="30"><rect width="35" height="8" style="stroke:#666699;fill:#666699;fill-opacity:0.6;stroke-width:2" /></svg>';
                legend += '<p>Bluff Area</p></div>';

                container.insertAdjacentHTML("beforeend",legend)

                return container;
            }
        });
        //add legend control to make
        map.addControl(new legendContainer());
    }

    function addBluff(){
        let toe, crest;
        //dash fill pattern
        var stripes = new L.StripePattern({
            weight:2,
            spaceWeight:6,
            color:"#666699",
            opacity:0.5,
            spaceColor:"#d1d1e0",
            spaceOpacity:0.25,
            angle:-30
        }); stripes.addTo(map);
        //get bluff area file
        fetch("data/bluff_area_abstract.geojson")
            .then(res => res.json())
            .then(function(res){
                L.geoJSON(res,{
                    style:function(feature){
                        return {
                            color:"#666699",
                            weight:2,
                            opacity:0.7,
                            fillOpacity:1,
                            fillPattern: stripes
                        }
                    }
                }).addTo(map);
        })
    }
    function addLake(){
        fetch("data/lakeshore_abstract.geojson")
            .then(res => res.json())
            .then(function(res){
                L.geoJSON(res,{
                    style:function(feature){
                        return {
                            color:"#ccebff",
                            fillColor:"#ccebff",
                            weight:2,
                            opacity:1,
                            fillOpacity:1,
                        }
                    }
                }).addTo(map);
                addBluff();
            })
    }
    //get bluff clrest data for setback line calculations
    function addCrest(){
        fetch("data/Oz_BluffCrest_abstract.geojson")
            .then(res => res.json())
            .then(function(res){
                crest = L.geoJSON(res);
                crestData = res;
            })
    }
    //get bluff toe data for setback line calculations
    function addToe(){
        fetch("data/Oz_BluffToe_abstract.geojson")
            .then(res => res.json())
            .then(function(res){
                toe = L.geoJSON(res);
                toeData = res;
            })
    }
    //function to create the triangle
    function createTriangle(){     
        //triangle origin point
        let base = 50;
        //create the triangle interface    
        let svg = d3.select("#triangle")
            .append("svg")
            .attr("class","triangle-interface");
        //get current height and width of the triangle interface, based on the viewport w/h
        let height = parseInt(svg.style("height")),
            width = document.querySelector("#triangle").getBoundingClientRect().right - 100; //x position of right side of triangle element
        //create bluff scales
        //scale for converting pixels to bluff height in ft.
        let yscale = d3.scaleLinear()
             .domain([0, height])
             .range([200, 0]);
        //scale for converting pixels to bluff width in ft.
        let xscale = d3.scaleLinear()
             .domain([0, height])
             .range([200, 0]);
        //scale for converting ft. to pixels
        let reverseScale = d3.scaleLinear()
             .domain([0, 200])
             .range([0, height]);
        //calculate current bluff width based on default height and angle
        bluffWidth = bluffHeight/Math.tan(currAngle * (Math.PI/180));
        //create adjacent side and label
        let adj = svg.append("line")
            .attr("class","line adj")
            .attr("x1",base)
            .attr("x2",reverseScale(bluffWidth) + base)
            .attr("y1",height)
            .attr("y2",height);  
        let adjLabel = svg.append("text")
            .attr("class","label-adj")
            .attr("x",reverseScale(bluffWidth)/2)
            .attr("y",height - 10)
            .style("text-anchor","middle")
            .text("Width: " + Math.round(bluffWidth) + " ft.");
        //create opposite and activate listeners for dragging
        let opp = svg.append("line")
            .attr("class","line opp")
            .attr("x1",base)
            .attr("x2",base)
            .attr("y1",reverseScale(bluffHeight))
            .attr("y2",height)
            .style("stroke","black")
            .style("stroke-dasharray","8, 4")
            //event triggers when opposite side is selected
            .on("mousedown",function(){
                //remove affordance
                document.querySelector(".triangle-intro-container").style.display = "none";
                //get stable angle to constrain triangle
                stableAngle = parseInt(document.getElementById('stable-bluff-angle').value);
                //activate dragging of triangle border
                svg.on("mousemove",function(){
                    let posx = event.clientX - 50,
                        posy = event.clientY;
                    
                    //if (posy >= height && posx < width)
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
                    //get current mouse position
                    let offsetx = parseInt(document.querySelector(".sidebar").clientWidth) - 10,
                        offsety = window.pageYOffset > document.querySelector("#triangle").offsetTop ? window.pageYOffset: document.querySelector("#triangle").offsetTop - window.pageYOffset;
                    //subtract y position from height and padding (10) to get the position in relation to the svg 
                    posy = posy - offsety;
                    posx = posx - offsetx;
                    //get new bluff width and height
                    bluffHeight = yscale(posy);
                    bluffWidth = xscale(posx);
                    //update angle based on new parameters
                    currAngle = Math.atan(bluffHeight/bluffWidth) * (180/Math.PI);

                    if (currAngle >= stableAngle){
                        //set new position of opposite side
                        d3.select(".opp")
                            .attr("x1",posx)
                            .attr("y1",posy)
                            .attr("x2",posx);
                        //update opposite labels
                        d3.select(".label-height")
                            .attr("x",parseInt(posx) - base)
                            .attr("y",function(){
                                return posy + ((height - posy)/2 - 20);
                            })
                        d3.select(".label-opp")
                            .attr("x",parseInt(posx) - base)
                            .attr("y",function(){
                                return posy + ((height - posy)/2);
                            })
                            .text(Math.round(bluffHeight) + " ft.")
                        //update adjacent width
                        d3.select(".adj")
                            .attr("x1",posx);
                        //update adjacent label
                        d3.select(".label-adj")
                            .attr("x",posx + reverseScale(bluffWidth)/2 - 25)
                            .text("Width: " + Math.round(bluffWidth) + " ft.")
                        //update hypotenuese
                        d3.select(".hyp")
                            .attr("x2",posx)
                            .attr("y2",posy)
                        //update hypotenuse angle
                        d3.select(".label-angle")
                            .attr("transform","translate(" + (posx + reverseScale(bluffWidth)/3 + 15) + "," + (posy + (height - posy)/2 - 40) +") rotate(" + currAngle + ")")
                            //.attr("transform","translate(" + reverseScale(bluffWidth)/2 + "," + (reverseScale(bluffHeight) + (height - reverseScale(bluffHeight))/2 - 40) +") rotate(" + currAngle + ")")
                            .text("Angle: " + Math.round(currAngle) + " deg.");
                        //set input values to match triangle
                        document.querySelector("#slope-height").value = Math.round(bluffHeight);
                        document.querySelector("#slope-angle").value = Math.round(currAngle);
                    }
                }
            });  
        //create opposite side labels
        let heightLabel = svg.append("text")
            .attr("class","label-height")
            .attr("x",0)
            .attr("y",height - (reverseScale(bluffHeight)/2) - 20)
            .style("text-anchor","middle")
            .text("Height:");
        let oppLabel = svg.append("text")
            .attr("class","label-opp")
            .attr("x",0)
            .attr("y",height - (reverseScale(bluffHeight)/2))
            .style("text-anchor","middle")
            .text(bluffHeight + " ft.");
        //create hypotenuse
        let hyp = svg.append("line")
            .attr("class","line hyp")
            .attr("x1",reverseScale(bluffWidth) + base)
            .attr("x2",base)
            .attr("y1",height)
            .attr("y2",reverseScale(bluffHeight)); 
        //add label for angle
        let angleLabel = svg.append("text")
            .attr("class","label-angle")
            .attr("transform","translate(" + reverseScale(bluffWidth)/2 + "," + (reverseScale(bluffHeight) + (height - reverseScale(bluffHeight))/2 - 40) +") rotate(" + currAngle + ")")
            .style("text-anchor","start")
            .text("Angle: " + currAngle + " deg.");

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
        document.querySelector(".triangle-intro-container").style.top = document.querySelector("#triangle").offsetTop + (parseInt(document.querySelector(".label-opp").attributes.y.value)*0.2) + "px";
        document.querySelector(".triangle-intro-container").style.left = document.querySelector("#triangle").offsetLeft + (parseInt(document.querySelector(".label-opp").attributes.x.value)*0.75) + "px";
    }
    //calculate stable angle setback
    function calcSas(){
        //get input values and set the height and angle of the slope
        bluffHeight = document.querySelector("#slope-height").value;
        currAngle = document.querySelector("#slope-angle").value;
        //calculate bluff width based on current values
        bluffWidth = bluffHeight/Math.tan(currAngle * (Math.PI/180));
        //calculate stable angle setback based on current values
        sas = (bluffHeight/Math.tan(stableAngle * (Math.PI/180))) - bluffWidth;

        document.getElementById('stable-angle-setback').value = sas;
        //remove old line if already drawn
        if (sasLine)
            map.removeLayer(sasLine);
        //draw line
        sasLine = addSetbackLine(sas, "orange","toe").addTo(map);
            addSetbackLegend("orange", "Stable Slope Setback","legend-sas")
    }
    //calculate recession rate
    function calcRec(){
        recRate = parseInt(document.getElementById('rec-rate').value);
        recYears = parseInt(document.getElementById('rec-years').value);
        //calculate the recession setback(default example should return 100)
        recSet = recRate * recYears;

        document.getElementById('rec-setback').value = recSet;

        //remove old line if already drawn
        if (recLine)
            map.removeLayer(recLine);
        //draw line
        recLine = addSetbackLine(recSet, "green","crest").addTo(map);
        addSetbackLegend("green", "Recession Setback","legend-rec")
    }
    //calculate local regulations
    function calcReg(){
        localReg = parseInt(document.getElementById('local-reg').value);
        regLine = addSetbackLine(localReg, "purple","crest").addTo(map);
        addSetbackLegend("purple", "Local Regulation", "legend-reg")
    }
    //function to add a line to the map
    function addSetbackLine(buffer, color, type){
        //calculate ratio of current width to default 
        var tempBuffer = buffer; //* (defaultWidth/bluffWidth);
        //create temp variable to store setbackLine data
        let lineData;
        
        lineData = clone(crestData);
        
        //create a setback line
        lineData.features[0].geometry.coordinates.forEach(function(coord){
            //convert setback distance into degrees 
            coord.forEach(function(latlng){
                //conversion factor for 1 mile, 69.172 = length of a degree of longitude at equator
                let cf = (Math.cos(latlng[1]) * 69.172) * 5280;                  
                //displace line based on calculaed conversion factor
                latlng[0] = latlng[0] - (tempBuffer/cf);
            })
        })
        //add setbackLine line to map
        let line = L.geoJSON(lineData, {
            style:function(feature){
                return {
                    color:color
                }
            }
        });
        return line;
    }
    //function to create line legend
    function addSetbackLegend(color, caption, className){            
        if (document.querySelector("." + className)){
            document.querySelector("." + className).remove();
        }
        
        let legend = '<div class="line-caption ' + className +'"><svg height="10" width="30"><line x1="0" y1="5" x2="100" y2="5" style="stroke:' + color + ';stroke-width:4" /></svg>';
        legend += '<p>' + caption + '</p></div>'
        document.querySelector(".leaflet-legend").insertAdjacentHTML("beforeend",legend);
    }
    //function clone data variable to store in new layer for setbackLine calculation
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
        document.querySelector("#calc-map").style.width = document.querySelector(".map-container").clientWidth + "px";
        //add triangle interface, map, and set listeners
        createTriangle();
        createMap();
        setListeners();
    })

    window.addEventListener('resize', function(){
        //adjust map width
        document.querySelector("#calc-map").style.width = document.querySelector(".map-container").clientWidth + "px";
    })

})()
