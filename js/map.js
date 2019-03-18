var map;
// track a point at world map (x,y) or at some cave (x,y,z,region)
var map_marker_char;
var map_marker_char_pos;
// current layer
var map_layer;
// objects at the current layer including the character mark
var map_markers_map = Array();
// layers supported
var map_layer_world,
map_layer_donwhang_1f,
map_layer_donwhang_2f,
map_layer_donwhang_3f,
map_layer_donwhang_4f,
map_layer_jangan_b1,
map_layer_jangan_b2,
map_layer_jangan_b3,
map_layer_jangan_b4;
// Initialize a map setting the view 
function initMap(x=113,y=12,z=0,r=0){
	// bind map by tag id
	map = L.map('map');
	// add UI controls
	L.easyButton({
		states:[{
			icon: '<span>&malt;</span>',
			title: 'Back to Your Position',
			onClick: function(){
				if(map_marker_char){
					var p = map_marker_char_pos;
					MoveTo(p[0],p[1],p[2],p[3]);
				}else{
					MoveTo(x,y);
				}
			}
		}]
	}).addTo(map);
	// show coords at clicking
	map.on('click', function (e){
		var c = MapToSilkroad(e.latlng.lat,e.latlng.lng);
		c = '(X:'+Math.round(c[0],5)+',Y:'+Math.round(c[1],5)+')';
		L.popup().setLatLng(e.latlng).setContent(c).openOn(map);
	})
	// load layers
	initMapLayers();
	setMapLayer(map_layer_world);
	// set initial view
	map.setView(SilkroadToMap(x,y,z,r),8);
}
// Load all map layers
function initMapLayers(){
	var b_url = 'images/silkroad/minimap/';
	// zoom = 2^8 = 256x256 tiles (enought at the moment)
	map_layer_world = L.tileLayer(b_url+'{x}x{-y}.jpg',{
		attribution: '<a href="http://silkroadonline.net/">Silkroad Map</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'}); 
	map_layer_donwhang_1f = L.tileLayer(b_url+'d/dh_a01_floor01_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Donwhang (1F)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_donwhang_2f = L.tileLayer(b_url+'d/dh_a01_floor02_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Donwhang (2F)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_donwhang_3f = L.tileLayer(b_url+'d/dh_a01_floor03_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Donwhang (3F)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_donwhang_4f = L.tileLayer(b_url+'d/dh_a01_floor04_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Donwhang (4F)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_jangan_b1 = L.tileLayer(b_url+'d/qt_a01_floor01_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Jangan (1B)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_jangan_b2 = L.tileLayer(b_url+'d/qt_a01_floor02_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Jangan (2B)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_jangan_b3 = L.tileLayer(b_url+'d/qt_a01_floor03_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Jangan (3B)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
	map_layer_jangan_b4 = L.tileLayer(b_url+'d/qt_a01_floor04_{x}x{-y}.jpg',{
		attribution: '<a href="#">Cave Jangan (4B)</a>',maxZoom:8,minZoom:8,errorTileUrl:b_url+'0.jpg'});
}
// Change the current layer for another one if it's needed
function setMapLayer(layer){
	// Update map
	if (map_layer && map_layer != layer){
		// remove layer and objects
		map.removeLayer(map_layer);
		for (var i = 0; i < map_markers_map.length; i++) {
			map.removeLayer(map_markers_map[i]);
		}
		map_markers_map = [];
		map_layer = null;
	}
	// update the current layer
	if(!map_layer){
		map_layer = layer
		map.addLayer(layer);
		addMapObjects(layer);
	}
	
	// Update character position
	if(map_marker_char_pos){
		if(map_marker_char){
			map.removeLayer(map_marker_char);
		}
		addMapCharacter(layer);
	}
}
// Add clickable objects to the layer selected
function addMapObjects(layer){
	var b_url = 'images/silkroad/minimap/icon/';
	// define common sizes
	var obj_23px = L.Icon.extend({
		options: {
			iconSize:     [23,23],
			iconAnchor:   [11,11],
			popupAnchor:  [0,0]
		}
	});
	// Creating markers
	var obj_npc_warehouse = new obj_23px({iconUrl: b_url+'xy_warehouse.png'});
	var obj_npc_potion = new obj_23px({iconUrl: b_url+'xy_potion.png'});
	var obj_npc_stable = new obj_23px({iconUrl: b_url+'xy_stable.png'});
	var obj_npc_weapon = new obj_23px({iconUrl: b_url+'xy_weapon.png'});
	var obj_npc_armor = new obj_23px({iconUrl: b_url+'xy_armor.png'});
	var obj_npc_etc = new obj_23px({iconUrl: b_url+'xy_etc.png'});
	var obj_npc_guild = new obj_23px({iconUrl: b_url+'xy_guild.png'});
	var obj_npc_hunter = new obj_23px({iconUrl: b_url+'xy_hunter.png'});
	var obj_npc_thief = new obj_23px({iconUrl: b_url+'xy_thief.png'});
	var obj_npc_merchant = new obj_23px({iconUrl: b_url+'xy_merchant.png'});
	var obj_npc_specialty = new obj_23px({iconUrl: b_url+'xy_specialty.png'});
	var obj_npc_market_1 = new obj_23px({iconUrl: b_url+'xy_market_1.png'});
	var obj_npc_market_2 = new obj_23px({iconUrl: b_url+'xy_market_2.png'});
	var obj_npc_oction = new obj_23px({iconUrl: b_url+'xy_specialty.png'});
	var obj_npc_new = new obj_23px({iconUrl: b_url+'xy_new.png'});
	var obj_tp_gate = new obj_23px({iconUrl: b_url+'xy_gate.png'});
	var obj_tp_ferry = new L.Icon({
		iconUrl: b_url+'xy_ferry.png',
		iconSize:     [27,24],
		iconAnchor:   [14,12],
		popupAnchor:  [0,0]
	});
	var obj_tp_tahomet_gate = new L.Icon({
		iconUrl: b_url+'tahomet_gate.png',
		iconSize:     [22,27],
		iconAnchor:   [11,14],
		popupAnchor:  [0,0]
	});
	var obj_npc_shamanhouse = new L.Icon({
		iconUrl: b_url+'xy_shamanhouse.png',
		iconSize:     [23,19],
		iconAnchor:   [12,10],
		popupAnchor:  [0,0]
	});
	var obj_tp_dungeon = new L.Icon({
		iconUrl: b_url+'xy_dungeon.png',
		iconSize:     [29,23],
		iconAnchor:   [15,12],
		popupAnchor:  [0,0]
	});
	var obj_tp_flyship = new obj_23px({iconUrl: b_url+'xy_flyship.png'});
	switch(layer){
		case map_layer_world:
	// Jangan
	map_markers_map.push(L.marker(SilkroadToMap(6435,1056),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(6489,1100),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(6374,1005),{icon: obj_npc_stable}).bindPopup('Stable').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(6373,1098),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(6495,1068),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(6373,1070),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(6435,1039),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> JANGAN<br><span>&bullet;</span><a href="#" onclick="MoveTo(3553,2112);"> Donwhang</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(5780,1220),{icon: obj_npc_shamanhouse}).bindPopup('Shaman House').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(4447,934),{icon: obj_tp_ferry}).bindPopup('Jangan Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(4110,1186);"> Donwhang Ferry</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(5034,1146),{icon: obj_tp_ferry}).bindPopup('Jangan Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(5059,1661);"> Donwhang Ferry</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(7203,2027),{icon: obj_tp_dungeon}).bindPopup('Jangan Cave<br><span>&bullet;</span><a href="#" onclick="MoveTo(-23232,642);">Jangan (1B)</a>').addTo(window.map));
	// Donwhang
	map_markers_map.push(L.marker(SilkroadToMap(3585,1989),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3520,2033),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3595,2089),{icon: obj_npc_stable}).bindPopup('Stable').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3572,2045),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3516,1995),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3573,2015),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3591,1969),{icon: obj_npc_guild}).bindPopup('Guild').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(3553,2112),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> DONWHANG<br><span>&bullet;</span><a href="#" onclick="MoveTo(6435,1039);"> Jangan</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(113,45);"> Hotan</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(4110,1186),{icon: obj_tp_ferry}).bindPopup('Donwhang Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(4447,934);"> Jangan Ferry</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(5059,1661),{icon: obj_tp_ferry}).bindPopup('Donwhang Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(5034,1146);"> Jangan Ferry</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(2471,2691),{icon: obj_tp_dungeon}).bindPopup('Donwhang Cave<br><span>&bullet;</span><a href="#" onclick="MoveTo(-24278,-88);">Donwhang (1F)</a>').addTo(window.map));
	// Hotan
	map_markers_map.push(L.marker(SilkroadToMap(113,62),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(82,104),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(148,3),{icon: obj_npc_stable}).bindPopup('Stable').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(57,75),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(89,-2),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(61,20),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(115,415),{icon: obj_npc_guild}).bindPopup('Guild').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(113,45),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> HOTAN<br><span>&bullet;</span><a href="#" onclick="MoveTo(3553,2112);"> Donwhang</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(-5185,2895);"> Samarkand</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(-16151,74);"> Alexandria (N)</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(-16645,-272);"> Alexandria (S)</a>').addTo(window.map));
	// Mt. Roc
	map_markers_map.push(L.marker(SilkroadToMap(-4612,3),{icon: obj_tp_tahomet_gate}).bindPopup('Tahomet Gate').addTo(window.map));
	// Samarkand
	map_markers_map.push(L.marker(SilkroadToMap(-5134,2803),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5232,2875),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5117,2898),{icon: obj_npc_stable}).bindPopup('Stable').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5197,2958),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5213,2838),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5252,2915),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5175,2975),{icon: obj_npc_guild}).bindPopup('Guild').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-5185,2895),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> SAMARKAND<br><span>&bullet;</span><a href="#" onclick="MoveTo(113,45);"> Hotan</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(-10684,2586);"> Constantinople</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-8692,2208),{icon: obj_tp_ferry}).bindPopup('Droa Bay<br><span>&bullet;</span><a href="#" onclick="MoveTo(-11427,1167);"> Constantinople Ferry</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-8692,1833),{icon: obj_tp_ferry}).bindPopup('Crab Bay Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(-11427,1167);"> Constantinople Ferry</a>').addTo(window.map));
	// Constantinople
	map_markers_map.push(L.marker(SilkroadToMap(-10627,2583),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-10625,2623),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-10759,2537),{icon: obj_npc_stable}).bindPopup('Stable').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-10674,2649),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-10685,2527),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-10750,2605),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-10684,2586),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> CONSTANTINOPLE<br><span>&bullet;</span><a href="#" onclick="MoveTo(-5185,2895);"> Samarkand</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-11427,1167),{icon: obj_tp_ferry}).bindPopup('Constantinople Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(-8692,2208);"> Droa Bay</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(-8692,1833);"> Crab Bay</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(-16545,380);"> Alexandria Ferry</a>').addTo(window.map));
	// Alexandria (North & South)
	map_markers_map.push(L.marker(SilkroadToMap(-16085,20),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16239,35),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16432,-218),{icon: obj_npc_stable}).bindPopup('Stable').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16260,-15),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16198,52),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16263,-45),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16151,74),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> ALEXANDRIA NORTH<br><span>&bullet;</span><a href="#" onclick="MoveTo(-16645,-272);"> Alexandria (S)</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(113,45);"> Hotan</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16473,-300),{icon: obj_npc_warehouse}).bindPopup('Warehouse').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16628,-355),{icon: obj_npc_potion}).bindPopup('Herbalist').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16745,-276),{icon: obj_npc_weapon}).bindPopup('Blacksmith').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16580,-272),{icon: obj_npc_etc}).bindPopup('GroceryTrader').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16727,-293),{icon: obj_npc_armor}).bindPopup('Armors').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16645,-272),{icon: obj_tp_gate}).bindPopup('<span>&starf;</span> ALEXANDRIA SOUTH<br><span>&bullet;</span><a href="#" onclick="MoveTo(-16151,74);"> Alexandria (N)</a><br><span>&bullet;</span><a href="#" onclick="MoveTo(113,45);"> Hotan</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-16545,380),{icon: obj_tp_ferry}).bindPopup('Alexandria Ferry<br><span>&bullet;</span><a href="#" onclick="MoveTo(-11427,1167);"> Constantinople Ferry</a>').addTo(window.map));
	break;
	case map_layer_donwhang_1f:
	map_markers_map.push(L.marker(SilkroadToMap(-24278,-88),{icon: obj_tp_gate}).bindPopup('Donwhang (1B)<br><span>&bullet;</span><a href="#" onclick="MoveTo(2471,2691);">Donwhang</a>').addTo(window.map)); 
	break;
	case map_layer_donwhang_2f:
	break;
	case map_layer_donwhang_3f:
	break;
	case map_layer_donwhang_4f:
	break;
	case map_layer_jangan_b1:
	map_markers_map.push(L.marker(SilkroadToMap(-23232,642),{icon: obj_tp_gate}).bindPopup('Jangan (1B)<br><span>&bullet;</span><a href="#" onclick="MoveTo(7203,2027);">Jangan</a>').addTo(window.map));
	map_markers_map.push(L.marker(SilkroadToMap(-23232,1932),{icon: obj_tp_gate}).bindPopup('Jangan (1B)<br><span>&bullet;</span><a href="#" onclick="MoveTo(7203,2027);">Jangan (2B)</a>').addTo(window.map));
	break;
	case map_layer_jangan_b2:
	break;
	case map_layer_jangan_b3:
	break;
	case map_layer_jangan_b4:
	break;
	}
}
// Convert a Silkroad Coord to Map CRS
function SilkroadToMap(x,y,z=0,region=0){
	// Scale approx. & DumbFix
	x = (x/97.54)/1.4;
	y += Math.pow(y,2)/(25600);
	y = (y/136.6)/1.4;
	// Map center (approx)
	switch(map_layer){
		case map_layer_world:
		x += 9.84;
		y += -45.081;
		break;
		case map_layer_donwhang_1f:
		x+=178.5;
		y+=-0.16;
		break;
		case map_layer_jangan_b1:
		x+=170.13;
		y+=-6;
		break;
	}
	return [y,x];
}
// Convert Map LatLng to Silkroad coords
function MapToSilkroad(lat,lng){
	// Map center (approx)
	switch(map_layer){
		case map_layer_world:
		lng -= 9.84;
		lat -= -45.081;
		break;
		case map_layer_donwhang_1f:
		lng-=178.5;
		lat-=-0.16;
		break;
		case map_layer_jangan_b1:
		lng-=170.13;
		lat-=-6;
		break;
	}
	// Scale & reverse DumbFix
	lng = (lng*97.54)*1.4;
	lat = (lat*136.6)*1.4;
	lat = 160*((Math.pow(lat+6400,1/2)) - 80);
	return [lng,lat];
}
// All data about detect the dungeon is calculated here
function getLayer(x,y,z,region){
	if(region==0){
	// Using this at the moment because I don't know the regions values
	var xPosition = (x % 192) * 10;
	var yPosition = (y % 192) * 10;
	var xSector = (x - xPosition / 10) / 192 + 135;
	var ySector = (y - yPosition / 10) / 192 + 92;
	if(xSector < 26){
		if (xSector >= 7 && xSector <= 9){
			return map_layer_donwhang_1f;
		}
		if(xSector >= 12 && xSector <= 16){
			return map_layer_jangan_b1;
		}
	}
	return map_layer_world;
	}
}
// Add the character pointer
function addMapCharacter(layer){
	// draw character if is at the same layer
	if(map_marker_char_pos){
		var p = map_marker_char_pos;
		var b_url = 'images/silkroad/minimap/icon/';
		var obj_char = new L.Icon({
			iconUrl: b_url+'character.png',
			shadowUrl: b_url+'character_shadow.png',
			iconSize:     [25,41],
			shadowSize: [25,41],
			iconAnchor:   [12,40],
			shadowAnchor: [12,40],
			popupAnchor:  [0,-41]
		});
		map_marker_char = L.marker(SilkroadToMap(p[0],p[1],p[2],p[3]),{icon:obj_char}).bindPopup('Your Position').addTo(window.map);
	}
}
// Move the main pointer. The cbaracter
function moveCharacter(x,y,z=0,r=0){
	// Just update the position and set the view
	map_marker_char_pos = [x,y,z,r];
	MoveTo(x,y,z,r);
	}
	// Set the view using a silkroad coord
	function MoveTo(x,y,z=0,r=0){
	// check the layer
	setMapLayer(getLayer(x,y,z,r));
	// set the view
	map.panTo(SilkroadToMap(x,y,z,r));
}