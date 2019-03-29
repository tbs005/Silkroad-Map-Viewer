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
	// NPC's locations by layer
	var map_layer_NPCs;
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
			"JANGAN":["",6464,1088,0,0,"main_gate","Donwhang",3553,2112,0,0,],
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
			"DONWHANG":["",3553,2112,0,0,"main_gate","Hotan",113,46,0,0,"Jangan",6435,1039,0,0],
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
			"HOTAN":["",113,46,0,0,"main_gate","Samarkand",-5185,2895,0,0,"Donwhang",3553,2112,0,0,"Alexandria (N)",-16151,74,0,0,"Alexandria (S)",-16645,-272,0,0],
			"Auisan":["Storage-Keeper",113,60,0,0],
			"Mamoje":["Jewel Lapidary",85,-5,0,0],
			"Gonishya":["Protector Trader",57,18,0,0],
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
			addMarker(obj_npc_weapon,'Blacksmith',3592,2035);
			addMarker(obj_npc_potion,'Drug Store',3505,2028);
			addMarker(obj_npc_stable,'Stable',3613,2069);
			addMarker(obj_npc_armor,'Protector Shop',3590,2005);
			addMarker(obj_npc_etc,'Grocery Shop',3500,1989);
			addMarker(obj_npc_guild,'Guild Storage',3594,1952);
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
		L.marker(SilkroadToMap(x,y),{icon:iconType}).bindPopup(html).addTo(map);
	};
	// Convert a Silkroad Coord to Map CRS
	var SilkroadToMap = function (x,y,z=0,region=0){
		// Scale approx. & DumbFix
		x = (x/97.54)/1.4;
		y += Math.pow(y,2)/(25600);
		y = (y/136.38)/1.4;
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
		lat = (lat*136.38)*1.4;
		lat = 160*((Math.pow(lat+6400,1/2)) - 80);
		return [lng,lat];
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
				c = 'X:'+Math.round(c[0],5)+' Y:'+Math.round(c[1],5);
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