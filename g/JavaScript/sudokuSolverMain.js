var activeNumber = null;
var undo = false;
/**Color the clicked number and save it as the active number
 * so when the player clicks on the board, this number is written
 * @param {HTMLDivElement} _this the element clicked
 */
function activeNum(_this) {
    undo = false;
    var poleBtn = _this.parentNode.parentNode.childNodes;
    var r1 = poleBtn[0].childNodes;
    var r2 = poleBtn[2].childNodes;
    var r3 = poleBtn[4].childNodes;
    for (let i = 0; i < 3; i++) {
        if (r1[i].style.backgroundColor == "grey" || r2[i].style.backgroundColor == "grey" || r3[i].style.backgroundColor == "grey") {
            r1[i].style.backgroundColor = "white"; r1[i].style.color = "black";
            r2[i].style.backgroundColor = "white"; r2[i].style.color = "black";
            r3[i].style.backgroundColor = "white"; r3[i].style.color = "black";
        }
    }
    _this.style.backgroundColor = "grey";
    _this.style.color = "white";
    activeNumber = _this.innerHTML;
}
/**Place the active number on the position clicked
 * or erase the content of the clicked position
 * @param {HTMLDivElement} _this the element clicked
 */
var available = true;
function place(_this) {
    if(typeof _this != 'object'){
        throw new Error("Invalid argument");
    }
    if (available && activeNumber != null) {
        _this.innerHTML = activeNumber;
        _this.style.backgroundColor = "lightgrey";
    }
    if(available && undo){
        _this.innerHTML = "";
        _this.style.backgroundColor = "white";
    }
}