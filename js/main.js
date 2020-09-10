var map;

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
			// create the control container with a particular class name
			var container = L.DomUtil.create('div', 'setback-control-container');
			
			// create the calculator panel
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

// After tinkering: data loads correctly but the projection is Wisconsin Transverse Mercator
// TODO: reproject the original shapefiles to leaflet standard (WGS 84?) and then reconvert to geoJSON
function loadData(){

    $.getJSON("data/oz-top.geojson",function(data){
        var datalayer = L.geoJson(data ,{
        onEachFeature: function(feature, featureLayer) {
            featureLayer.bindPopup(feature.properties.NAME_1);
        }
        }).addTo(map);
        map.fitBounds(datalayer.getBounds());
        });

}

function calcSetback(){
    localReg = document.getElementById('local_reg').value;

    localReg = document.getElementById('bluff_height').value;
    localReg = document.getElementById('curr_bluff_angle').value;
    localReg = document.getElementById('stable_bluff_angle').value;

    if(document.getElementById('setback_angle').value.length == 0){
        //TODO: calculate the stable angle setback
        document.getElementById('setback_angle').value = 0;
    } else{
        localReg = document.getElementById('setback_angle').value;
    }

    localReg = document.getElementById('rec_rate').value;
    if(document.getElementById('rec_setback').value.length == 0){
        //TODO: calculate the recession setback
        document.getElementById('rec_setback').value = 0;
    } else{
        localReg = document.getElementById('rec_setback').value;
    }

    document.getElementById('setback_ft').value = 0;
}

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