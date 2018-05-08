var packetQueue = [];
var isSending = false;
var iterationNum = 0;
var curTime = 0;
var iterationTime = 0;
var numOfStations = 0;
var onStationNow = 0;
window.setInterval(function(){ // this function is not dynamic yet
    onStationNow = 8 / numOfStations;
    var p = $( "#token" );
    curTime += 2;
    iterationTime += 2;
    if (iterationTime == 8) {
        iterationTime = 0;
        iterationNum++;
    }

        var id = curTime - iterationNum * 8;
        var strId = `s${id}m0`; // s for seconds, m for  mili seconds
        document.getElementById(strId).style.color = "blue";
}, onStationNow); // 2 seconds  (8(animation duration in css) / 4(num of stations) )

function addStations() {
    numOfStations = $("input").val();
    var container = $("#rotator");
    for (var i = 0; i < numOfStations; i++) {
        container.append(" <div class=\"station\" id=\"s0m0\">station</div>");
    }
    var block = $("#rotator .station").get(),
        increase = Math.PI * 2 / block.length,
        x = 0, y = 0, angle = 0;

    var radius = 150;// if any one wanna deduce a dynamic equation between radius and num of stations he is welcomed :')
    if (numOfStations > 10)
        radius = 200;
    $('#keyframes').text(` @-webkit-keyframes orbit { 
                           from {  transform: rotate(0deg) translateX(${radius}px) rotate(0deg); }
                           to   {  transform: rotate(360deg) translateX(${radius}px) rotate(-360deg); }
                       }`);
    container.append("<div id = \"token\">Token</div>");

    for (var i = 0; i < block.length; i++) {
        var elem = block[i];
        x = radius * Math.cos(angle) + 150;
        y = radius * Math.sin(angle) + 250;
        elem.style.position = 'absolute';
        elem.style.left = x + 'px';
        elem.style.top = y + 'px';
        var rot = 90 + (i * (360 / block.length));
        angle += increase;
    }


}

function addPacket(sender, reciver) {
    //listen to stations
    packetQueue.push([sender, reciver]);
    printQueue();
}

function fces(curStation) {
    if (typeof packetQueue !== 'undefined' && packetQueue.length > 0) {
        curSender = packetQueue[0][0];
        curReciever = packetQueue[0][1];
        if (curStation == curSender) {
            toggleSender(curStation);
            if (isSending == true) {
                isSending = false;
                packetQueue.shift();
                printQueue();
            } else {
                isSending = true;
                toggleReciever(curReciever);
            }
        } else if (curStation == curReciever) {
            toggleReciever(curStation);
        }
    }

}














