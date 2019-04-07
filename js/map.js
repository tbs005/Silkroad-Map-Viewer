// Increase performance with too many markers
L.Marker.addInitHook(function(){
	if(this.options.virtual){
		// setup virtualization after marker was added
		this.on('add',function(){
			this._updateIconVisibility = function() {
				var map = this._map,
				isVisible = map.getBounds().contains(this.getLatLng()),
				wasVisible = this._wasVisible,
				icon = this._icon,
				iconParent = this._iconParent,
				shadow = this._shadow,
				shadowParent = this._shadowParent;
				// remember parent of icon 
				if (!iconParent) {
					iconParent = this._iconParent = icon.parentNode;
				}
				if (shadow && !shadowParent) {
					shadowParent = this._shadowParent = shadow.parentNode;
				}
				// add/remove from DOM on change
				if (isVisible != wasVisible) {
					if (isVisible) {
						iconParent.appendChild(icon);
						if (shadow) {
							shadowParent.appendChild(shadow);
						}
					}else{
						iconParent.removeChild(icon);
						if (shadow) {
							shadowParent.removeChild(shadow);
						}
					}
					this._wasVisible = isVisible;
				}
			};
			// on map size change, remove/add icon from/to DOM
			this._map.on('resize moveend zoomend', this._updateIconVisibility, this);
			this._updateIconVisibility();
		}, this);
	}
});
// Silkroad map handler
var SilkroadMap = function(){  
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
	// NPC's locations by layer
	var map_layer_NPCs;
	// Shapes at the map
	var map_shapes = [];
	var map_shapes_id = 0;
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
		map_layer_NPCs = {
		"map_layer_world":{
			/* NPC Format :
			> "Name":["Title",x,y,z,r,Teleport Type?,Teleport?,x?,y?,z?,r?,Teleport??,x??,y??,z??,r??,...]
			*/
			"JANGAN":["",6464,1088,0,0,"main_gate","Donwhang",3554,2108,0,0,],
			"Wangu & Sansan":["Storage-Keeper",6434,1059,0,0],
			"Yangyun":["Herbalist",6494,1100,0,0],
			"Jinjin":["Grocery Trader",6501,1067,0,0],
			"Machun":["Stable-Keeper",6368,1005,0,0],
			"Mrs Jang":["Protector Trader",6369,1068,0,0],
			"Chulsan":["Blacksmith",6369,1100,0,0],
			"Ishyak":["Islam Merchant",6503,1018,0,0],
			"Jodaesan":["Specialty Trader",6511,1007,0,0],
			"Hwajung":["Merchant Associate",6511,995,0,0],
			"Flora":["Adventurer",6503,986,0,0],
			"Dangsam":["Soldier",6439,962,0,0],
			"Jingyo":["Soldier",6429,962,0,0],
			"Fengil":["Soldier",6429,1150,0,0],
			"Choiyoung":["Soldier",6437,1150,0,0],
			"Jangan Cave":["",7203,2027,0,0,"dungeon","Jangan (1B)",-23232,642,0,0,],
			"CONSTANTINOPLE":["",-10683,2583,0,0,"main_gate","Samarkand",-5185,2895,0,0],
			"Sikeulro":["Inn Master",-10618,2580,0,0],
			"Retaldi":["Nun",-10617,2635,0,0],
			"Balbardo":["Weapon Trader",-10674,2649,0,0],
			"Treno":["Stable-Keeper",-10765,2532,0,0],
			"Jatomo":["Protector Trader",-10750,2605,0,0],
			"Demetry":["Adventurer",-10617,2554,0,0],
			"Lipria":["Guide",-10618,2921,0,0],
			"Raffy":["Guide",-10972,2628,0,0],
			"Riise":["Guide",-10696,2609,0,0],
			"Ratchel":["General",-10830,2467,0,0],
			"Kapros":["Association Boss",-10833,2404,0,0],
			"Uvetino":["Association Boss",-10885,2351,0,0],
			"Tana":["Merchant Associate",-10736,2513,0,0],
			"Tina":["Specialty Trader",-10717,2518,0,0],
			"Vesaros":["Soldier",-10750,2664,0,0],
			"Kotomo":["Soldier",-10740,2673,0,0],
			"Kalsius":["Soldier",-10615,2935,0,0],
			"Adria":["Hunter Associate",-10835,2703,0,0],
			"Rialto":["Consul",-10864,2787,0,0],
			"Justia":["Soldier",-10853,2301,0,0],
			"Gilt":["Guild Manager",-10553,2328,0,0],
			"Kartino":["Soldier",-10495,2472,0,0],
			"Maximus":["Soldier",-10481,2484,0,0],
			"Riedo":["Soldier",-10638,2935,0,0],
			"Alex":["Soldier",-11005,2636,0,0],
			"Takia":["Soldier",-11005,2650,0,0],
			"Bajel":["Grocery Trader",-10683,2521,0,0],
			"Gabriel":["Clergy",-10387,2776,0,0],
			"Sunset Witch":["",-10377,3230,0,0],
			"Yongso":["Boy",-10392,3220,0,0],
			"Steward Yupitel":["",-10881,2617,0,0],
			"Gale":["Harbor Manager",-11425,1162,0,0,"ferry","Droa Dock",-8692,2208,0,0,"Sigia Dock",-8700,1828,0,0],
			"Morgun":["Pirate",-8692,2208,0,0,"ferry","Eastern Europe Dock",-11425,1162,0,0],
			"Blackbeard":["Pirate",-8700,1828,0,0,"ferry","Eastern Europe Dock",-11425,1162,0,0],
			"DONWHANG":["",3554,2108,0,0,"main_gate","Jangan",6435,1039,0,0,"Hotan",113,46,0,0],
			"Agol":["Blacksmith",3575,2041,0,0],
			"Yeolah":["Protector Trader",3575,2010,0,0],
			"Paedo & Irina":["Storage-Keeper",3581,1989,0,0],
			"Yeosun":["Grocery Trader",3511,1993,0,0],
			"Bori":["Herbalist",3515,2033,0,0],
			"Makgo":["Stable-Keeper",3597,2084,0,0],
			"Leegeuk":["Merchant Associate",3500,2076,0,0],
			"Leegak":["Specialty Shop Elder",3495,2076,0,0],
			"Ryukang":["Guild Manager",3591,1964,0,0],
			"Baeksong":["Soldier",3552,1946,0,0],
			"Dooil":["Soldier",3468,2103,0,0],
			"Manho":["Soldier",3468,2112,0,0],
			"Hahun":["Soldier",3627,2106,0,0],
			"Moho":["Soldier",3627,2115,0,0],
			"Haraho":["Hunter Associate",3515,2175,0,0],
			"Hyeon":["Buddhist Priest",3596,2237,0,0],
			"Honmusa":["",3501,1966,0,0],
			"Baekako":["",3491,1966,0,0],
			"SAMARKAND":["",-5185,2890,0,0,"main_gate","Constantinople",-10684,2586,0,0,"Hotan",113,49,0,0],
			"Saesa":["Storage-Keeper",-5128,2801,0,0],
			"Martel":["Nun",-5234,2872,0,0],
			"Hoyun":["Stable-Keeper",-5116,2903,0,0],
			"Tricai":["Weapon Trader",-5200,2961,0,0],
			"Saha":["Grocery Trader",-5212,2833,0,0],
			"Aryoan":["Protector Trader",-5247,2915,0,0],
			"Hapsa":["Guild Manager",-5171,2971,0,0],
			"Shahad":["Hunter Associate",-5144,3008,0,0],
			"Karen":["Merchant Associate",-5118,2870,0,0],
			"Toson":["Specialty Trader",-5101,2870,0,0],
			"Dohwa":["Soldier",-5190,2709,0,0],
			"Tapai":["Soldier",-5177,2709,0,0],
			"Ahu":["Soldier",-5363,2898,0,0],
			"Asahap":["Soldier",-5363,2885,0,0],
			"Jooha":["Soldier",-5002,2898,0,0],
			"Paje":["Soldier",-5002,2883,0,0],
			"HOTAN":["",113,46,0,0,"main_gate","Donwhang",3554,2108,0,0,"Samarkand",-5185,2895,0,0,"Alexandria (N)",-16151,74,0,0,"Alexandria (S)",-16645,-272,0,0],
			"Auisan":["Storage-Keeper",113,60,0,0],
			"Mamoje":["Jewel Lapidary",85,-5,0,0],
			"Gonishya":["Protector Trader",57,19,0,0],
			"Manina":["Blacksmith",83,109,0,0],
			"Soboi":["Potion Merchant",50,76,0,0],
			"Sanmok":["Specialty Trader",151,90,0,0],
			"Asaman":["Merchant Associate",157,83,0,0],
			"Salihap":["Stable-Keeper",154,-5,0,0],
			"Baoman":["Soldier",317,53,0,0],
			"Makhan":["Soldier",317,43,0,0],
			//"Rahan":["Boat Ticket Seller",1079,-60,0,0,"ferry","Tarim North Ferry",1456,-18,0,0],
			//"Salmai":["Boat Ticket Seller",1456,-18,0,0,"ferry","Hotan North Ferry",1079,-60,0,0],
			//"Rahan":["Boat Ticket Seller",1079,-60,0,0,"ferry","Tarim North Ferry",1456,-18,0,0],
			//"Salmai":["Boat Ticket Seller",1456,-18,0,0,"ferry","Hotan North Ferry",1079,-60,0,0],
			"Asui":["Tunnel Manager",-1905,1981,0,0,"ferry","Central Asia Northeast Tunnel",-2761,2678,0,0],
			"Topni":["Tunnel Manager",-2761,2678,0,0,"ferry","Taklamakan Nortwest Tunnel",-1905,1981,0,0],
			"Salhap":["Tunnel Manager",-2731,2104,0,0,"ferry","Taklamakan Southwest Tunnel",-1902,1387,0,0],
			"Maryokuk":["Tunnel Manager",-1902,1387,0,0,"ferry","Central Asia Southeast Tunnel",-2731,2104,0,0],
			"ALEXANDRIA NORTH":["",-16151,74,0,0,"main_gate","Alexandria (S)",-16645,-272,0,0,"Hotan",113,49,0,0],
			"ALEXANDRIA SOUTH":["",-16645,-272,0,0,"main_gate","Alexandria (N)",-16151,74,0,0,"Hotan",113,49,0,0],
			},
		"map_layer_jangan_b1":{
			"Jangan Teleport (1)":["",-23232,642,0,0,"tel","Jangan",7203,2027,0,0],
			"Jangan Teleport (2)":["",-23232,1932,0,0,"tel","Jangan (2B)",7203,2027,0,0],
		},
		"map_layer_donwhang_1f":{
			"Donwhang Teleport (1)":["",-24278,-88,0,0,"tel","Donwhang",2471,2691,0,0]
		}
		};
	};
	// Change the current layer for another one if it's needed
	var setMapLayer = function (layer){
		// update map
		if (map_layer && map_layer != layer){
			// remove layer and objects
			map.eachLayer(function(maplayer){
				map.removeLayer(maplayer);
			});
			// delete all shapes created
			for (var shape in map_shapes) {
				map_shapes[shape] = [];
			}
			// reset
			map_marker_char = null;
			map_layer = null;
		}
		// update the current layer
		if(!map_layer){
			map_layer = layer;
			map.addLayer(layer);
			addMapObjects(layer);
		}
		// update character position
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
			popupAnchor:[0,-7]
		});
		var obj_23px = L.Icon.extend({
			options: {
				iconSize:	[23,23],
				iconAnchor:	[12,11],
				popupAnchor:[0,-6]
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
		var obj_npc_speciality = new obj_23px({iconUrl: b_url+'xy_speciality.png'});
		var obj_npc_market_1 = new obj_23px({iconUrl: b_url+'xy_market_1.png'});
		var obj_npc_market_2 = new obj_23px({iconUrl: b_url+'xy_market_2.png'});
		var obj_npc_oction = new obj_23px({iconUrl: b_url+'xy_specialty.png'});
		var obj_npc_new = new obj_23px({iconUrl: b_url+'xy_new.png'});
		var obj_tp_gate = new obj_23px({iconUrl: b_url+'xy_gate.png'});
		var obj_tp_tel = new obj_23px({iconUrl: b_url+'map_world_icontel.png'});
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
			iconSize:	[29,25],
			iconAnchor:	[15,12],
			popupAnchor:[0,0]
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
		// Filter layer objects
		layer_npcs = []
		switch(layer){
			case map_layer_world:
			// Select NPC's from layer
			layer_npcs = map_layer_NPCs["map_layer_world"];
			// Adding house icons
			// Jangan
			addMarker(obj_npc_weapon,'Blacksmith',6357,1097);
			addMarker(obj_npc_potion,'Drug Store',6513,1091);
			addMarker(obj_npc_stable,'Stable',6359,1006);
			addMarker(obj_npc_armor,'Protector Shop',6359,1061);
			addMarker(obj_npc_etc,'Grocery Shop',6514,1072);
			addMarker(obj_npc_guild,'Guild Storage',116,460);
			addMarker(obj_npc_speciality,'Specialty Shop',6524,994);
			addMarker(obj_npc_hunter,'Hunter Association',216,143);
			addMarker(obj_npc_shamanhouse,'Exorcist\'s Home',5772,1229);
			// Constantinople
			addMarker(obj_npc_warehouse,'Inn',-10600,2564);
			addMarker(obj_npc_weapon,'Blacksmith',-10679,2664);
			addMarker(obj_npc_potion,'Drug Store',-10593,2636);
			addMarker(obj_npc_stable,'Stable',-10783,2544);
			addMarker(obj_npc_armor,'Protector Shop',-10761,2589);
			addMarker(obj_npc_etc,'Grocery Shop',-10683,2501);
			addMarker(obj_npc_guild,'Guild Storage',-10527,2310);
			addMarker(obj_npc_speciality,'Specialty Shop',-10736,2497);
			addMarker(obj_npc_hunter,'Hunter Association',-10848,2689);
			// Donwhang
			addMarker(obj_npc_weapon,'Blacksmith',3590,2035);
			addMarker(obj_npc_potion,'Drug Store',3505,2028);
			addMarker(obj_npc_stable,'Stable',3590,2067);
			addMarker(obj_npc_armor,'Protector Shop',3590,2005);
			addMarker(obj_npc_etc,'Grocery Shop',3500,1989);
			addMarker(obj_npc_guild,'Guild Storage',3591,1949);
			addMarker(obj_npc_speciality,'Specialty Shop',3500,2059);
			addMarker(obj_npc_hunter,'Hunter Association',3506,2190);
			// Samarkand
			addMarker(obj_npc_warehouse,'Inn',-5113,2807);
			addMarker(obj_npc_weapon,'Blacksmith',-5209,2971);
			addMarker(obj_npc_potion,'Drug Store',-5247,2867);
			addMarker(obj_npc_stable,'Stable',-5115,2919);
			addMarker(obj_npc_armor,'Protector Shop',-5265,2921);
			addMarker(obj_npc_etc,'Grocery Shop',-5220,2818);
			addMarker(obj_npc_guild,'Guild Storage',-5153,2970);
			addMarker(obj_npc_speciality,'Specialty Shop',-5108,2852);
			addMarker(obj_npc_hunter,'Hunter Association',-5125,3010);
			// Hotan
			addMarker(obj_npc_weapon,'Blacksmith',44,88);
			addMarker(obj_npc_potion,'Drug Store',79,122);
			addMarker(obj_npc_stable,'Stable',168,-3);
			addMarker(obj_npc_armor,'Protector Shop',43,10);
			addMarker(obj_npc_etc,'Grocery Shop',77,-20);
			addMarker(obj_npc_guild,'Guild Storage',116,460);
			addMarker(obj_npc_speciality,'Specialty Shop',171,96);
			addMarker(obj_npc_hunter,'Hunter Association',216,143);
			
			// in progress ...
			
			break;
			case map_layer_jangan_b1:
			layer_npcs = map_layer_NPCs["map_layer_jangan_b1"];
			break;
			case map_layer_donwhang_1f:
			layer_npcs = map_layer_NPCs["map_layer_donwhang_1f"];
			break;
		}
		// Load all NPC's & Teleports from layer
		var npc_title,npc_name,npc_icon,npc_tp;
		for(var key in layer_npcs){
			npc_icon = obj_npc;
			npc_tp = "";
			npc_title = layer_npcs[key][0];
			npc_name = '<div class="npc">'+key+'</div>';
			// it's a teleport
			if(layer_npcs[key].length > 5 ){
				switch(layer_npcs[key][5]){
					case "main_gate":
					npc_icon = obj_tp_gate;
					npc_title = '&starf; '+key;
					npc_name = "";
					break;
					case "ferry":
					npc_icon = obj_tp_ferry;
					break;
					case "gate":
					npc_icon = obj_tp_gate;
					break;
					case "dungeon":
					npc_icon = obj_tp_dungeon;
					npc_name = "";
					npc_title = key;
					break;
					case "tel":
					npc_icon = obj_tp_tel;
					npc_name = "";
					npc_title = key;
					break;
				}
				// add tp movements
				for (var i = 6; i < layer_npcs[key].length; i+=5) {
					npc_tp += '<div class="opt">&bullet; <a href="#" onclick="SilkroadMap.MoveTo('+layer_npcs[key][i+1]+','+layer_npcs[key][i+2]+','+layer_npcs[key][i+3]+','+layer_npcs[key][i+4]+');">'+layer_npcs[key][i]+'</a></div>';
				}
			}
			addMarker(npc_icon,npc_title+npc_name+npc_tp,layer_npcs[key][1],layer_npcs[key][2],layer_npcs[key][3],layer_npcs[key][4]);
		}
	};
	// Kind minify & friendly reduced
	var addMarker = function(iconType,html,x,y,z=0,r=0){
		L.marker(SilkroadToMap(x,y),{icon:iconType,pmIgnore:true,virtual:true}).bindPopup(html).addTo(map);
	};
	// Convert a Silkroad Coord to Map CRS
	var SilkroadToMap = function (x,y,z=0,region=0){
		// Scale approx. & DumbFix
		x = x*0.007324;
		y += Math.pow(y,2)/(25600);
		y = y*0.0052375;
		// Map center (approx)
		switch(map_layer){
			case map_layer_world:
			x += 9.85;
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
		var z = 0,r = 0;
		// Map center (approx)
		switch(map_layer){
			case map_layer_world:
			lng -= 9.85;
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
		lng = lng/0.007324;
		lat = lat/0.0052375;
		lat = 160*((Math.pow(lat+6400,1/2)) - 80);
		return [lng,lat,z,r];
	};
	// All data about detect the dungeon is calculated here
	var getLayer = function (x,y,z,region){
		// Just leaving this here for the future!
		if(region & 0x8000){ // it's in dungeon

		}
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
		map.flyTo(SilkroadToMap(x,y,z,r),8);
	};
	// Copy text to clipboard
	var ToClipboard = function(text) {
		console.log(text);
		var e = document.createElement('textarea');
		e.value = text;
		document.body.appendChild(e);
		e.select();
		document.execCommand('copy');
		document.body.removeChild(e);
	};
	return{
		// Initialize a map setting the view 
		init:function(id,x=113,y=12,z=0,r=0){
			// bind map by tag id
			map = L.map(id);
			// add UI controls
			// move back to Hotan or to the pointer
			L.easyButton({
				states:[{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" style="vertical-align:middle"><path fill="#333" d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"/></svg>',
					title: 'Back to Your Position',
					onClick: function(){
						if(map_marker_char){
							var p = map_marker_char_pos;
							MoveTo(p[0],p[1],p[2],p[3]);
						}else{
							MoveTo(113,12);
						}
					}
				}]
			}).addTo(map);
			// Copy as text all shapes at map
			var btnCopy = L.easyButton({
				states:[{
					icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="vertical-align:middle; height:16px;"><path fill="#555" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"/></svg>',
					title: 'Copy Shapes to Clipboard',
					onClick: function(){
						var textFile = "";
						for (var shape in map_shapes){
							textFile += shape+"(s):\n";
							var i = 1;
							for (var id in map_shapes[shape]){
								textFile += (i++)+")\n";
								switch(shape){
									case "Line":
									var d = 0, q = null;
									for (var j = 0; j < map_shapes[shape][id]._latlngs.length; j++){
										var p = MapToSilkroad(map_shapes[shape][id]._latlngs[j].lat,map_shapes[shape][id]._latlngs[j].lng);
										textFile += "X:"+Math.round(p[0])+",Y:"+Math.round(p[1])+",Z:"+Math.round(p[2])+"\n";
										if(q){ // skip the first point
											d += Math.sqrt(Math.pow(Math.round(p[0])-Math.round(q[0]),2)+Math.pow(Math.round(p[1])-Math.round(q[1]),2)+Math.pow(Math.round(p[2])-Math.round(q[2]),2));
										}
										q = p;
									}
									textFile += "Travel distance:"+d;
									break;
									case "Circle":
										var p = MapToSilkroad(map_shapes[shape][id]._latlng.lat,map_shapes[shape][id]._latlng.lng);
										textFile += "X:"+Math.round(p[0])+",Y:"+Math.round(p[1])+",Z:"+Math.round(p[2])+"\n";
										textFile += "Radius:"+Math.round(map_shapes[shape][id]._radius*37/49.3)+"\n"; // A bit unprecised but enought at the moment
									break;
									case "Poly":
									for (var j = 0; j < map_shapes[shape][id]._latlngs[0].length; j++){
										var p = MapToSilkroad(map_shapes[shape][id]._latlngs[0][j].lat,map_shapes[shape][id]._latlngs[0][j].lng);
										textFile += "X:"+Math.round(p[0])+",Y:"+Math.round(p[1])+",Z:"+Math.round(p[2])+"\n";
									}
									break;
								}
							}
							textFile+= "\n";
						}
						ToClipboard(textFile);
					}
				}]
			});
			// Script toolbar
			L.easyButton({
				states:[{
					stateName:	'show-bar',
					icon:		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" style="vertical-align:middle"><path fill="#333" d="M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160-43-96-96-96-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160 96-107 96-160-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>',
					title:		'Show Script Toolbar',
					onClick: function(btn, map) {
						btn.state('hide-bar');
						map.pm.addControls({
							position:'topleft',
							drawMarker:false,
							drawPolyline:true,
							drawRectangle:false,
							drawPolygon:true,
							drawCircle:true,
							editMode:true,
							dragMode:true,
							cutPolygon:false,
							removalMode:true
						});
						btnCopy.addTo(map);
					}
				},{
					stateName:	'hide-bar',
					icon:		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" style="vertical-align:middle"><path fill="#555" d="M416 320h-96c-17.6 0-32-14.4-32-32s14.4-32 32-32h96s96-107 96-160-43-96-96-96-96 43-96 96c0 25.5 22.2 63.4 45.3 96H320c-52.9 0-96 43.1-96 96s43.1 96 96 96h96c17.6 0 32 14.4 32 32s-14.4 32-32 32H185.5c-16 24.8-33.8 47.7-47.3 64H416c52.9 0 96-43.1 96-96s-43.1-96-96-96zm0-256c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zM96 256c-53 0-96 43-96 96s96 160 96 160 96-107 96-160-43-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>',
					title:		'Hide Script Toolbar',
					onClick: function(btn, map) {
						btn.state('show-bar');
						map.pm.addControls({
							drawPolyline:false,
							drawPolygon:false,
							drawCircle:false,
							editMode:false,
							dragMode:false,
							removalMode:false
						});
						btnCopy.remove();
					}
				}]
			}).addTo(map);
			// show coords at clicking
			map.on('click', function (e){
				var c = MapToSilkroad(e.latlng.lat,e.latlng.lng);
				c = 'X:'+Math.round(c[0])+' Y:'+Math.round(c[1]);
				//c += '<br>LAT:'+e.latlng.lat+' LNG:'+e.latlng.lng;
				L.popup().setLatLng(e.latlng).setContent(c).openOn(map);
			});
			// Keep the track of all shapes created
			map.on('pm:create',function(e){
				if(!map_shapes[e.shape]){
					map_shapes[e.shape] = [];
				}
				// easy track
				e.layer["shapeType"] = e.shape;
				e.layer["shapeId"] = map_shapes_id++;
				map_shapes[e.shape][e.layer.shapeId] = e.layer;
				// update shape if is edited
				e.layer.on('pm:edit', f => {
					map_shapes[f.target.shapeType][f.target.shapeId] = f.target;
				});
			});
			map.on('pm:remove',function(e){
				delete map_shapes[e.layer.shapeType][e.layer.shapeId];
			});
			// load layers
			initMapLayers();
			setMapLayer(map_layer_world);
			// set initial view
			map.setView(SilkroadToMap(x,y,z,r),8);
		},
		// Set the view
		MoveTo:function(x,y,z=0,r=0){
			MoveTo(x,y,z,r);
		},
		FlyTo:function(x,y,z=0,r=0){
			FlyTo(x,y,z,r);
		},
		// Move/Remove the main pointer/character
		MovePointer:function(x,y,z=0,r=0){
			// update the position
			map_marker_char_pos = [x,y,z,r];
			FlyTo(x,y,z,r);
		},
		RemovePointer:function(x,y,z=0,r=0){
			map_marker_char_pos = null;
			setMapLayer(map_layer);
		}
	};
}();