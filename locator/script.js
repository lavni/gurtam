//form
function overlay(){
	var login = document.forms["myForm"]["login"].value;
	var pass = document.forms["myForm"]["pass"].value;
		if ((login == "avin") && (pass == "avin")) {
			setTimeout(function(){
			document.getElementById('over').style.display = 'none';
			document.getElementById('header').innerText = 'HELLO AVIN!';
			}, 1000);
		} else{
			setTimeout(function(){alert("Invalid login "+login);
			}, 1000);
	}
}

//toggle asides for mobile
document.getElementById('toggleasides').onclick = function(){
	var elements = ['leftaside', 'rightaside', 'mainhide'];
	for (var i = 0; i < elements.length; i++) {
		document.getElementById(elements[i]).classList.toggle('hide-mobile');
	};
}


function fact(a){
	var sum = 1;
	for (var i = 1; i <= a; i++) {
		sum *= i;
	};
	return sum;
}
