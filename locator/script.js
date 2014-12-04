var session = wialon.core.Session.getInstance();
	session.initSession('https://trc-api.wialon.com');


//form
function overlay(){
	var login = document.forms["myForm"]["login"].value;
	var pass = document.forms["myForm"]["pass"].value;
	verification(login, pass);

}
function verification(log, pas){
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

	session.loadLibrary('itemIcon');
	session.updateDataFlags([{type:'type', data: 'avl_unit', flags:0x1411, mode:0}], function(code){
		var objects = session.getItems('avl_unit');
		var markers = [];
		var names = [];
		var datatimes = [];
		var speeds = [];
		var urls = [];
		var id
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
				document.getElementById('itemlist').innerHTML += "<li class='unit_" + id + "'><img src='" +
				url + "'><span> " + name + "</span> <span><h2>Last message: </h2></span>" +
				"<span>" + datatime + "</span>" +  " " + "<span>" + speed + " km/h </span>"
				 + " " + "<span> x: " + x + " <br>y: " + y + "</span>" + " </li>";
				markers.push([y, x]);
				names.push(name);
				datatimes.push(datatime);
				speeds.push(speed);
				urls.push(url);
			}
		}
		map(markers, names, datatimes, speeds, urls);
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

function map(markers, names, datatimes, speeds, urls){
	var map = L.map('map');
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
	//map.setView([53.906, 27.456], 13);
	map.addLayer(osm);
	// markers = [[53.906, 27.456], [53.906, 26.456],[53.306, 26.456]];
	for (var i = 0; i < markers.length; i++) {
		var icon = L.icon({iconUrl: urls[i], popupAnchor: [15, 0]});
		var marker = L.marker(markers[i], {icon: icon}).addTo(map);
		marker.bindPopup("<b>Name:</b> " + names[i] + "<br><b>Speed:</b> " + speeds[i] +
			" km/h <br><b>Last:</b> " + datatimes[i]);
	};
	map.fitBounds(markers);
	// extend(fitBounds);
}

function center(id, y, x){
	var elem = document.getElementById("itemlist");
	elem.addEventListener('click', function(event){
		var target = elem.target;
		unit = "unit_" + id;
		if (target.hasAttribute(unit)) {
			map.setView(x, y, 13);
		}
	});
}
// function fact(a){
// 	var sum = 1;
// 	for (var i = 1; i <= a; i++) {
// 		sum *= i;
// 	};
// 	return sum;
// }


//http://trc-api.wialon.com/wialon/ajax.html?svc=core/login&params={%22user%22:%22avin%22,%22password%22:%22123%22}
//http://trc-api.wialon.com/wialon/ajax.html?sid=c1f48e7956e52331c452f94bcf5e3fb7&svc=core/logout&params={}
// session.updateDataFlags([{type:'type', data: 'avl_unit', flags:1, mode:0}], function(code){console.log(arguments)})
// session.getItems('avl_unit')



