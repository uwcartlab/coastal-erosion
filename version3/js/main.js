var map;

/* TODO:
*       Calculate setback
*       Convert to pixel amounts based on zoom level and move data layer
*/

function createMap(){
    m = document.querySelectorAll('#map')[0];
    esri_sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    bounds = L.latLngBounds(L.latLng(43.2,-89.7),L.latLng(42.95,-89.1));
	map = L.map('map', {
		//maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        layers: [esri_sat]
    }).setView([42.75,-88], 8);
    
    // create the calculator
	var SetbackControl = L.Control.extend({
		
		// position in top right of map
		options: {
			position: 'topright'
		},

		onAdd: function () {
			// create the control container with class setback
			var container = L.DomUtil.create('div', 'setback-control-container');
			
			// create the calculator panel and fill in the defaults from the old calc
            $(container).append('\
            <div id="ui-panel">\
                <p><b>1.) Structure Life</b></p>\
                <label>Local Regulation (ft)</label>\
                <input type="number" class="hightlight" id="local_reg" value="25">\
                <p><b>2.) Stable Slope Angle</b></p>\
                <label>Bluff Height (ft)</label>\
                <input type="number" id="bluff_height" value="100">\
                <br>\
                <label>Current Bluff Angle (deg.)</label>\
                <input type="number" id="curr_bluff_angle" value="30">\
                <br>\
                <label>Stable Bluff Angle (deg.)</label>\
                <input type="number" id="stable_bluff_angle" value="22">\
                <br>\
                <label>Stable Angle Setback (ft)</label>\
                <input type="number" class="hightlight" id="setback_angle">\
                <br>\
                <p><b>3.) Recession</b></p>\
                <label>Recession Rate (ft/yr)</label>\
                <input type="number" id="rec_rate" value="2">\
                <br>\
                <label>Recession Setback: 50yrs (ft)</label>\
                <input type="number" class="hightlight" id="rec_setback">\
                <br>\
                <hr><hr>\
                <label id="setback_total">Total Setback Distance (ft)</label>\
                <input type="number" id="setback_ft">\
                <br>\
                <div id="buttons"><button onclick="calcSetback()">Calculate</button><button onclick="resetCalc()">Reset</button><div>\
            </div>');

            L.DomEvent.disableClickPropagation(container);
	
			return container;
		}
    });
    map.addControl(new SetbackControl());

    loadData();
}

// This function loads the data from the WTM standard using a library.
// For initial dev working with only Ozaukee
function loadData(){

    proj4.defs("EPSG:3071","+proj=tmerc +lat_0=0 +lon_0=-90 +k=0.9996 +x_0=520000 +y_0=-4480000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

    $.getJSON("data/projections/oz-top/oz-top.geojson",function(data){
        var datalayer = L.Proj.geoJson(data ,{
        onEachFeature: function(feature, featureLayer) {
            featureLayer.bindPopup(feature.properties);
        },
        coordsToLatLng: function (coords) {
            // flip lat and lon to match Leaflet
            return new L.LatLng(coords[1], coords[0]);
        }
        }).addTo(map);
        // Fit map to the data, can change to specific coordinates by uncommenting maxbounds at map init
        map.fitBounds(datalayer.getBounds());
        });
}

// This function calculates the setback based on user input
function calcSetback(){
    // read in input and format correctly
    localReg = parseInt(document.getElementById('local_reg').value);
    height = parseInt(document.getElementById('bluff_height').value);
    curr_angle = parseInt(document.getElementById('curr_bluff_angle').value);
    stable_angle = parseInt(document.getElementById('stable_bluff_angle').value);

    //TODO: calculate the stable angle setback(default example should return 74)
    // See simple_bluff.jpg for the math
    sas = 0;
    document.getElementById('setback_angle').value = sas;

    rec_rate = parseInt(document.getElementById('rec_rate').value);
    //calculate the recession setback(default example should return 100)
    rec_set = rec_rate*50;
    document.getElementById('rec_setback').value = rec_set;

    //calculate the total setback in ft(example should be 199 [25 + 74 + 100])
    document.getElementById('setback_ft').value = parseInt(localReg + sas + rec_set);
}

// This function resets the calculator to default values
function resetCalc(){
    document.getElementById('local_reg').value = 25;

    document.getElementById('bluff_height').value = 100;
    document.getElementById('curr_bluff_angle').value = 30;
    document.getElementById('stable_bluff_angle').value = 22;
    document.getElementById('setback_angle').value = '';

    document.getElementById('rec_rate').value = 2;
    document.getElementById('rec_setback').value = '';

    document.getElementById('setback_ft').value = '';
}

$(document).ready(createMap());