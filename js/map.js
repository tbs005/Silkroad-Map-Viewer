var SilkroadMap = function() {  
	var map;
	// track a point at world map (x,y) or at some cave (x,y,z,region)
	var map_marker_char;
	var map_marker_char_pos;
	// current layer
	var map_layer;
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
	// Load all map layers
	var initMapLayers = function (){
		var b_url = 'images/silkroad/minimap/';
		// zoom = 2^8 = 256x256 tiles (enough at the moment)
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
	};
	// Change the current layer for another one if it's needed
	var setMapLayer = function (layer){
		// Update map
		if (map_layer && map_layer != layer){
			// remove layer and objects
			map.eachLayer(function(maplayer){
				map.removeLayer(maplayer);
			});
			map_marker_char = null;
			map_layer = null;
		}
		// update the current layer
		if(!map_layer){
			map_layer = layer;
			map.addLayer(layer);
			addMapObjects(layer);
		}
		
		// Update character position
		if(map_marker_char_pos){
			if(map_marker_char)
				map.removeLayer(map_marker_char);
			addMapCharacter(layer);
		}
	};
	// Add clickable objects to the layer selected
	var addMapObjects = function(layer){
		var b_url = 'images/silkroad/minimap/icon/';
		// define common sizes
		var obj_npc = new L.Icon({
			iconUrl: b_url+'xy_npc.png',
			iconSize:	[11,15],
			iconAnchor:	[6,7],
			popupAnchor:[0,0]
		});
		var obj_23px = L.Icon.extend({
			options: {
				iconSize:	[23,23],
				iconAnchor:	[12,11],
				popupAnchor:[0,0]
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
			iconSize:	[29,25],
			iconAnchor:	[15,12],
			popupAnchor:[0,0]
		});
		var obj_tp_tahomet_gate = new L.Icon({
			iconUrl: b_url+'tahomet_gate.png',
			iconSize:	[26,28],
			iconAnchor:	[13,14],
			popupAnchor:[0,0]
		});
		var obj_npc_shamanhouse = new L.Icon({
			iconUrl: b_url+'xy_shamanhouse.png',
			iconSize:     [29,25],
			iconAnchor:   [15,12],
			popupAnchor:  [0,0]
		});
		var obj_tp_dungeon = new L.Icon({
			iconUrl: b_url+'xy_dungeon.png',
			iconSize:	[31,25],
			iconAnchor:	[16,12],
			popupAnchor:[0,0]
		});
		var obj_tp_flyship = new L.Icon({
			iconUrl: b_url+'xy_flyship.png',
			iconSize:	[43,47],
			iconAnchor:	[22,23],
			popupAnchor:[0,0]
		});
		var obj_tp_fort = new L.Icon({
			iconUrl: b_url+'fort_worldmap.png',
			iconSize:	[23,45],
			iconAnchor:	[12,23],
			popupAnchor:[0,0]
		});
		var obj_tp_fort_small = new L.Icon({
			iconUrl: b_url+'fort_small_worldmap.png',
			iconSize:	[20,31],
			iconAnchor:	[10,15],
			popupAnchor:[0,0]
		});
		switch(layer){
			case map_layer_world:
			// Jangan
			addMarker(obj_npc_warehouse,'Warehouse<br><span class="npc">Wangu & Sansan</span>',6435,1055);
			addMarker(obj_npc_potion,'Herbalist<br><span class="npc">Yangyun</span>',6508,1100);
			addMarker(obj_npc_stable,'Stable<br><span class="npc">Machun</span>',6360,1008);
			addMarker(obj_npc_weapon,'Blacksmith<br><span class="npc">Chulsan</span>',6363,1102);
			addMarker(obj_npc_etc,'Grocery Trader<br><span class="npc">Jinjin</span>',6510,1068);
			addMarker(obj_npc_armor,'Protector Trader<br><span class="npc">Mrs. Jang</span>',6359,1066);
			addMarker(obj_tp_gate,'<span>&starf;</span> JANGAN<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(3553,2112);">Donwhang</a>',6464,1088);
			addMarker(obj_npc,'Hunter Associate<br><span class="npc">Gwakwi</span>',6307,1184);
			addMarker(obj_npc,'Guild Manager<br><span class="npc">Leebaek</span>',6248,1197);
			addMarker(obj_npc,'General<br><span class="npc">Sonhyeon</span>',6206,1174);
			addMarker(obj_npc,'Military Camp Soldier<br><span class="npc">Juho</span>',6296,1294);
			addMarker(obj_npc,'Buddhist Priest<br><span class="npc">Kushyan</span>',6600,1164);
			addMarker(obj_npc,'Buddhist Priest<br><span class="npc">Jeonghye</span>',6596,1249);
			addMarker(obj_npc,'Islam Merchant<br><span class="npc">Ishyak</span>',6508,1010);
			addMarker(obj_npc,'Specialty Trader<br><span class="npc">Jodaesan</span>',6513,1001);
			addMarker(obj_npc,'Merchant Associate<br><span class="npc">Hwanjung</span>',6513,989);
			addMarker(obj_npc,'Adventurer<br><span class="npc">Flora</span>',6508,980);
			addMarker(obj_npc_shamanhouse,'Exorcist\'s Home<br><span class="npc">Miaoryeong</span>',5780,1220);
			addMarker(obj_tp_fort,'Gate of Jangan Fortress I<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-12560,-4543);">Gate I of Fortress</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-12369,-4547);">Gate II of Fortress</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-11779,-4555);">Gate III of Fortress</a>',6161,51);
			addMarker(obj_tp_fort,'Gate of Jangan Fortress II<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-12560,-4543);">Gate I of Fortress</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-12369,-4547);">Gate II of Fortress</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-11779,-4555);">Gate III of Fortress</a>',6350,49);
			addMarker(obj_tp_fort,'Gate of Jangan Fortress III<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-12560,-4543);">Gate I of Fortress</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-12369,-4547);">Gate II of Fortress</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-11779,-4555);">Gate III of Fortress</a>',6611,50);
			addMarker(obj_tp_fort,'Gate I of Fortress<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6161,51);">Gate of Jangan Fortress I</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6350,49);">Gate of Jangan Fortress II</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6611,50);">Gate of Jangan Fortress III</a>',-12560,-4543);
			addMarker(obj_tp_fort,'Gate II of Fortress<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6161,51);">Gate of Jangan Fortress I</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6350,49);">Gate of Jangan Fortress II</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6611,50);">Gate of Jangan Fortress III</a>',-12369,-4547);
			addMarker(obj_tp_fort,'Gate III of Fortress<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6161,51);">Gate of Jangan Fortress I</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6350,49);">Gate of Jangan Fortress II</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6611,50);">Gate of Jangan Fortress III</a>',-11779,-4555);
			addMarker(obj_tp_ferry,'Chinese eastern ferry<br><span class="npc">Doji</span><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(5059,1661);">Seoyeok\'s eastern ferry</a>',5034,1146);
			addMarker(obj_tp_ferry,'Chinese western ferry<br><span class="npc">Chau</span><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(4110,1186);">Seoyeok\'s western ferry</a>',4447,934);
			addMarker(obj_tp_dungeon,'Jangan Cave<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-23232,642);">Jangan (1B)</a>',7203,2027);
			// Donwhang
			addMarker(obj_npc_warehouse,'Warehouse',3585,1989);
			addMarker(obj_npc_potion,'Herbalist',3520,2033);
			addMarker(obj_npc_stable,'Stable',3595,2089);
			addMarker(obj_npc_weapon,'Blacksmith',3572,2045);
			addMarker(obj_npc_etc,'GroceryTrader',3516,1995);
			addMarker(obj_npc_armor,'Armors',3573,2015);
			addMarker(obj_npc_guild,'Guild',3591,1969);
			addMarker(obj_tp_gate,'<span>&starf;</span> DONWHANG<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(6435,1039);">Jangan</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(113,45);">Hotan</a>',3553,2112);
			addMarker(obj_tp_ferry,'Seoyeok\'s eastern ferry<br><span class="npc">Tayun</span><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(5034,1146);">Chinese eastern ferry</a>',5059,1661);
			addMarker(obj_tp_ferry,'Seoyeok\'s western ferry<br><span class="npc">Hageuk</span><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(4447,934);">Chinese western ferry</a>',4110,1186);
			addMarker(obj_tp_dungeon,'Donwhang Cave<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-24278,-88);">Donwhang (1F)</a>',2471,2691);
			// Hotan
			addMarker(obj_npc_warehouse,'Warehouse',113,62);
			addMarker(obj_npc_potion,'Herbalist',82,104);
			addMarker(obj_npc_stable,'Stable',148,3);
			addMarker(obj_npc_weapon,'Blacksmith',57,75);
			addMarker(obj_npc_etc,'GroceryTrader',89,-2);
			addMarker(obj_npc_armor,'Armors',61,20);
			addMarker(obj_npc_guild,'Guild',115,415);
			addMarker(obj_tp_gate,'<span>&starf;</span> HOTAN<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(3553,2112);"> Donwhang</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-5185,2895);"> Samarkand</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-16151,74);"> Alexandria (N)</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-16645,-272);"> Alexandria (S)</a>',113,45);
			addMarker(obj_tp_flyship,'Karakoram North Dock<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-3155,609);"> Roc Mountain Northeast Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-3169,-950);"> Roc Mountain Southeast Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2942,1851);"> Central Asia Aircraft Dock</a>',-2625,386);
			addMarker(obj_tp_flyship,'Karakoram Southeast Dock<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-3155,609);"> Roc Mountain Northeast Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-3169,-950);"> Roc Mountain Southeast Dock</a>',-2603,-1027);
			// Mt. Roc
			addMarker(obj_tp_flyship,'Roc Mountain Northeast Dock<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2625,386);"> Karakoram North Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2603,-1027);"> Karakoram South Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2942,1851);"> Central Asia Aircraft Dock</a>',-3155,609);
			addMarker(obj_tp_flyship,'Roc Mountain Southeast Dock<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2625,386);"> Karakoram North Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2603,-1027);"> Karakoram South Dock</a>',-3169,-950);
			addMarker(obj_tp_tahomet_gate,'Gate of Ruler',-4612,3);
			// Samarkand
			addMarker(obj_npc_warehouse,'Warehouse',-5134,2803);
			addMarker(obj_npc_potion,'Herbalist',-5232,2875);
			addMarker(obj_npc_stable,'Stable',-5117,2898);
			addMarker(obj_npc_weapon,'Blacksmith',-5197,2958);
			addMarker(obj_npc_etc,'GroceryTrader',-5213,2838);
			addMarker(obj_npc_armor,'Armors',-5252,2915);
			addMarker(obj_npc_guild,'Guild',-5175,2975);
			addMarker(obj_tp_gate,'<span>&starf;</span> SAMARKAND<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(113,45);"> Hotan</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-10684,2586);"> Constantinople</a>',-5185,2895);
			addMarker(obj_tp_ferry,'Droa Dock<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-11427,1167);">Eastern Europe Dock</a>',-8692,2208);
			addMarker(obj_tp_ferry,'Sigia Dock<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-11427,1167);">Eastern Europe Dock</a>',-8692,1833);
			addMarker(obj_tp_flyship,'Central Asia Aircraft Dock<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-2625,386);"> Karakoram North Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-3155,609);"> Roc Mountain Northeast Dock</a>',-2942,1851);
			// Constantinople
			addMarker(obj_npc_warehouse,'Warehouse',-10627,2583);
			addMarker(obj_npc_potion,'Herbalist',-10625,2623);
			addMarker(obj_npc_stable,'Stable',-10759,2537);
			addMarker(obj_npc_weapon,'Blacksmith',-10674,2649);
			addMarker(obj_npc_etc,'GroceryTrader',-10685,2527);
			addMarker(obj_npc_armor,'Armors',-10750,2605);
			addMarker(obj_tp_gate,'<span>&starf;</span> CONSTANTINOPLE<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-5185,2895);"> Samarkand</a>',-10684,2586);
			addMarker(obj_tp_ferry,'Eastern Europe Dock<br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-8692,2208);">Droa Dock</a><br><span>&bullet; </span><a href="#" onclick="SilkroadMap.MoveTo(-8692,1833);">Sigia Dock</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-16545,380);"> Alexandria Ferry</a>',-11427,1167);
			// Alexandria (North & South)
			addMarker(obj_npc_warehouse,'Warehouse',-16085,20);
			addMarker(obj_npc_potion,'Herbalist',-16239,35);
			addMarker(obj_npc_stable,'Stable',-16432,-218);
			addMarker(obj_npc_weapon,'Blacksmith',-16260,-15);
			addMarker(obj_npc_etc,'GroceryTrader',-16198,52);
			addMarker(obj_npc_armor,'Armors',-16263,-45);
			addMarker(obj_tp_gate,'<span>&starf;</span> ALEXANDRIA NORTH<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-16645,-272);"> Alexandria (S)</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(113,45);"> Hotan</a>',-16151,74);
			addMarker(obj_npc_warehouse,'Warehouse',-16473,-300);
			addMarker(obj_npc_potion,'Herbalist',-16628,-355);
			addMarker(obj_npc_weapon,'Blacksmith',-16745,-276);
			addMarker(obj_npc_etc,'GroceryTrader',-16580,-272);
			addMarker(obj_npc_armor,'Armors',-16727,-293);
			addMarker(obj_tp_gate,'<span>&starf;</span> ALEXANDRIA SOUTH<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-16151,74);"> Alexandria (N)</a><br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(113,45);"> Hotan</a>',-16645,-272);
			addMarker(obj_tp_ferry,'Alexandria Ferry<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(-11427,1167);"> Eastern Europe Dock</a>',-16545,380);
			break;
			case map_layer_donwhang_1f:
			addMarker(obj_tp_gate,'Donwhang (1B)<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(2471,2691);">Donwhang</a>',-24278,-88); 
			break;
			case map_layer_donwhang_2f:
			break;
			case map_layer_donwhang_3f:
			break;
			case map_layer_donwhang_4f:
			break;
			case map_layer_jangan_b1:
			addMarker(obj_tp_gate,'Jangan (1B)<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(7203,2027);">Jangan</a>',-23232,642);
			addMarker(obj_tp_gate,'Jangan (1B)<br><span>&bullet;</span><a href="#" onclick="SilkroadMap.MoveTo(7203,2027);">Jangan</a>',-23232,1932);
			break;
			case map_layer_jangan_b2:
			break;
			case map_layer_jangan_b3:
			break;
			case map_layer_jangan_b4:
			break;
		}
	};
	// Kind minify & friendly reduced
	var addMarker = function(iconType,html,x,y,z=0,r=0){
		L.marker(SilkroadToMap(x,y),{icon:iconType}).bindPopup(html).addTo(map);
	};
	// Convert a Silkroad Coord to Map CRS
	var SilkroadToMap = function (x,y,z=0,region=0){
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
	};
	// Convert Map LatLng to Silkroad coords
	var MapToSilkroad = function (lat,lng){
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
	};
	// All data about detect the dungeon is calculated here
	var getLayer = function (x,y,z,region){
		// Just leaving this here for the future!
		if(region & 0x8000){ // it's in dungeon

		}
		// Using this at the moment because I don't know the regions values
		if(region==0){
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
	};
	// Add the character pointer
	var addMapCharacter = function (layer){
		// draw character if is at the same layer
		if(map_marker_char_pos){
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
			var p = map_marker_char_pos;
			map_marker_char = L.marker(SilkroadToMap(p[0],p[1],p[2],p[3]),{icon:obj_char}).bindPopup('Your Position').addTo(map);
		}
	};
	// Set the view using a silkroad coord
	var MoveTo = function(x,y,z=0,r=0){
		// check the layer
		setMapLayer(getLayer(x,y,z,r));
		// set the view
		map.panTo(SilkroadToMap(x,y,z,r));
	};
	// Set the view using a silkroad coord
	var FlyTo = function(x,y,z=0,r=0){
		// check the layer
		setMapLayer(getLayer(x,y,z,r));
		// set the view
		map.flyTo(SilkroadToMap(x,y,z,r));
	};
	return {
		// Initialize a map setting the view 
		init:function(id,x=113,y=12,z=0,r=0){
			// bind map by tag id
			map = L.map(id);
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
							// Hotan
							MoveTo(113,12);
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
		},
		// Set the view using a silkroad coord
		MoveTo:function(x,y,z=0,r=0){
			MoveTo(x,y,z,r);
		},
		FlyTo:function(x,y,z=0,r=0){
			FlyTo(x,y,z,r);
		},
		// Move/Remove the main pointer/character
		movePointer:function(x,y,z=0,r=0){
			// update the position
			map_marker_char_pos = [x,y,z,r];
			FlyTo(x,y,z,r);
		},
		removePointer:function(x,y,z=0,r=0){
			map_marker_char_pos = null;
			setMapLayer(map_layer);
		}
	};
}();