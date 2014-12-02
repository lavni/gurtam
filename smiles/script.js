function setIcon(i){
  i = i%16;

  if (i<0){
    i+=16;
  }

  var x = i%4 * -56;
  var y = (i/4 | 0) * -56;

  var elem = document.getElementById("icon");
  elem.style.backgroundPosition = x + "px " + y + "px";
}



leftButton = document.getElementById("left");
leftButton.onclick = function() {
  var ind =  document.getElementById("icon").getAttribute("ind");
  ind--;
  setIcon(ind);
  document.getElementById("icon").setAttribute("ind", ind);
};

rightButton = document.getElementById("right");
rightButton.onclick = function() {
  var ind =  document.getElementById("icon").getAttribute("ind");
  ind++;
  setIcon(ind);
  document.getElementById("icon").setAttribute("ind", ind);
};