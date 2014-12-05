var session = wialon.core.Session.getInstance();
	session.initSession('https://trc-api.wialon.com');

var map = L.map('map');
var MARKERS = {};
//form
function overlay(){
	var login = document.forms["myForm"]["login"].value;
	var pass = document.forms["myForm"]["pass"].value;
	verification(login, pass);
}
function verification(log, pas){
	session.initSession('https://trc-api.wialon.com');
	session.login(log, pas, '', function(code){
		if (code == 0) {
			var currUser = session.getCurrUser().getName();
			document.getElementById('over').style.display = 'none';
			document.getElementById('hello').style.display = 'block';
			document.getElementById('logout').style.display = 'block';
			document.getElementById('hello').innerText = 'HELLO ' + currUser;
			afterLog();
		} else {
			alert("Invalid login "+log);
		}
		console.log(arguments);
	});
}
function logout(){
	document.getElementById('over').style.display = 'block';
	document.getElementById('hello').style.display = 'none';
	document.getElementById('logout').style.display = 'none';
	document.getElementById('hello').innerText = '';
	document.forms["myForm"]["pass"].value = '';

}
//toggle asides for mobile
document.getElementById('toggleasides').onclick = function(){
	var elements = ['leftaside', 'rightaside', 'mainhide'];
	for (var i = 0; i < elements.length; i++) {
		document.getElementById(elements[i]).classList.toggle('hide-mobile');
	};
}

function afterLog() {
	document.getElementById('h1').innerHTML += "<h1>Objects:</h1>";
	session.loadLibrary('itemIcon');
	session.updateDataFlags([{type:'type', data: 'avl_unit', flags:0x1411, mode:0}], function(code){
		var objects = session.getItems('avl_unit');
		var markers = [];
		var names = [];
		var datatimes = [];
		var speeds = [];
		var urls = [];
		var info = {};
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].getLastMessage() == null) {
				document.getElementById('itemlist').innerHTML +=
				"<li><img src='" + objects[i].getIconUrl() + "'><span> " + objects[i].getName()
				+ "</span><span><h2>Last message: </h2>none</span></li>";
			} else{
				var data = objects[i].getLastMessage().t;
				var x = objects[i].getLastMessage().pos.x ;
				var y = objects[i].getLastMessage().pos.y;
				var id = objects[i].getId();
				var name = objects[i].getName()
				var datatime = convertTime(data);
				var speed = objects[i].getLastMessage().pos.s;
				var url = objects[i].getIconUrl();
				document.getElementById('itemlist').innerHTML += "<li data-x='" + x + "' data-y='" + y + "'><img src='" +
				url + "'><span> " + name + "</span> <span><h2 >Last message: </h2></span><span id='last" + id + "'></span>" +
				"<span id='lastt" + id + "'>" + datatime + "</span>" +  " " + "<span>" + speed + " km/h </span>"
				 + " " + "<span class='little'> x: " + x + " <br>y: " + y + "</span>" + " </li>";
				info[id] = {
					marker: [y, x],
					name: name,
					datatime: datatime,
					speed: speed,
					url: url	
				};
			}
		}
		setupMap(info);
		setupClickItemHandler();
		session.addListener("serverUpdated", function(){
			timeFromLastMessage();
		});
	});
}

function convertTime(time){
	var date = new Date(time*1000);
	var year = date.getYear();
	var month = date.getMonth();
	var day = date.getDay();
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	var formattedTime = day + "/" + (month+1) + "/" + (year%100) + " " +
	hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
	return formattedTime;
}
function timeFromLastMessage(){
	var items = session.getItems('avl_unit');
	for (var i = 0; i < items.length; i++) {
		if (items[i].getLastMessage() != null) {
			var d = items[i].getLastMessage().t;
			var serverTime = session.getServerTime();
			var timeFromLast = serverTime - d;
			var sec = timeFromLast % 60;
			var min1 = timeFromLast / 60 | 0; 
			var h = min1 / 60 | 0;
			var min = min1 - h*60;
			var unitId = items[i].getId();
			var spanLast = 'last' + unitId;
			var spanLastt = 'lastt' + unitId;
			document.getElementById(spanLast).innerHTML = h + 'h ' + min + 'm ' + sec + 's ago';
			document.getElementById(spanLastt).innerHTML = convertTime(d);
		};
	}
}

function setupMap(info){
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
	//map.setView([53.906, 27.456], 13);
	map.addLayer(osm);
	// markers = [[53.906, 27.456], [53.906, 26.456],[53.306, 26.456]];
	var markers = [];
	for(var id in info){
		var unit = info[id];
		markers.push(unit.marker);

		var icon = L.icon({iconUrl: unit.url, popupAnchor: [15, 0]});
		var marker = L.marker(unit.marker, {icon: icon}).addTo(map);
		marker.bindPopup("<b>Name:</b> " + unit.name + "<br><b>Speed:</b> " + unit.speed +
			" km/h <br><b>Last:</b> " + unit.datatime);
	
		MARKERS[id] = marker;


	}
	map.fitBounds(markers);
	// extend(fitBounds);
}

function setupClickItemHandler() {
	var elem = document.getElementById('itemlist');
	elem.addEventListener('click', function(event) {
		item = event.target;
		while (item.tagName != 'LI') {
			item = item.parentElement;
		}
		if (item.hasAttributes('data-x')) {
			data = item.dataset;
			map.setView([data.y, data.x], 15);
		}
	});
}


//http://trc-api.wialon.com/wialon/ajax.html?svc=core/login&params={%22user%22:%22avin%22,%22password%22:%22123%22}
//http://trc-api.wialon.com/wialon/ajax.html?sid=c1f48e7956e52331c452f94bcf5e3fb7&svc=core/logout&params={}




