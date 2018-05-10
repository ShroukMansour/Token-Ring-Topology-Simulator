var packetQueue = [];
var isSending = false;
var iterationNum = 0;
var curTime = 0;
var iterationTime = 0;
var numOfStations = 0;
var onStationNow = 0;
var SENDER = -1;
var RECEIVER = -1;
function interval(){ // this function is not dynamic yet
    if (numOfStations != 0) {
        onStationNow = 8 / numOfStations;
        var p = $( "#token" );
        curTime += onStationNow;
        iterationTime += onStationNow;
        if (iterationTime >= 8) {
            iterationTime = 0;
            iterationNum++;
        }

            var id = Math.round((curTime - iterationNum * 8) * 1000);
            var strId = `pc${id}`; // s for seconds, m for  mili seconds
            fces(strId);
            console.log(strId);
    }
   
        // document.getElementById(strId).style.color = "blue";
}
 
function addStations() {

    numOfStations = $("input").val();
    onStationNow = 8 / numOfStations;
    setInterval(interval, onStationNow*1000);
    var radius = 250;// if any one wanna deduce a dynamic equation between radius and num of stations he is welcomed :')
    if (numOfStations > 10)
        radius = 250;
    createPath(radius);
    buildSendReceiveCatalog();
    var container = $("#rotator");

    for (var i = 0; i < numOfStations; i++) {
        var stationID = getStationID(i);
        container.append(` <div class=\"station\" id=pc${stationID} ><img src=\"images/station.png\" style = \"width:50px;height:60px\"></div>`);
     //  document.getElementById(stationID).style.backgroundImage = "url('images/station.png')"
    }
    var block = $("#rotator .station").get(),
        increase = Math.PI * 2 / block.length,
        x = 0, y = 0, angle = 0;

    const container2 = $("#circle");

    $('#keyframes').text(` @-webkit-keyframes orbit { 
                           from {  transform: rotate(0deg) translateX(${radius - 28}px) rotate(0deg); }
                           to   {  transform: rotate(360deg) translateX(${radius - 28}px) rotate(-360deg); }
                       }`);
    const top = $(window).scrollTop() + Math.floor($(window).height() / 2);
    container2.append("<div id = \"token\">Token</div>");
    let h = container2.height();
    h = h/2;
    const t = document.getElementById("circle").style.top;
    document.getElementById("token").style.top =  h - 5 + t;


    for (var i = 0; i < block.length; i++) {

        var elem = block[i];
        x = radius * Math.cos(angle) + radius;
        y = radius * Math.sin(angle) + top;
        elem.style.position = 'absolute';
        elem.style.left = x + 'px';
        elem.style.top = y + 'px';
        var rot = 90 + (i * (360 / block.length));
        elem.style.transform = 'rotate('+rot+'deg)';
        angle += increase;
    }


}
function getStationID(i) {
    return Math.round(i* (8/numOfStations) * 1000);
}
//pulse animated" data-wow-delay="300ms" data-wow-iteration="infinite" data-wow-duration="2s" style="visibility: visible; animation-duration: 2s; animation-delay: 300ms; animation-iteration-count: infinite; animation-name: pulse;

function buildSendReceiveCatalog() {
    let i;
    numOfStations = $("input").val();
    const container = $("#catalog");
    for (i = 0; i < numOfStations; i++) {
        var id = "s" + i;
        container.append(` <button class=\"sender wow rollIn\"  id=\"${id}\">${i + 1}</button>`);
        document.getElementById(id).onclick = function(){onSenderClick(this.id.substr(1))};
        id = "r" + i;
        container.append(`<button class="receiver wow rollIn" id=${id}>${i+1}</button>`);
        document.getElementById(id).onclick = function(){onReceiverClick(this.id.substr(1))};
    }
    let senderBlock = container.find(".sender").get(),
        receiverBlock = container.find(".receiver").get(),
        increase = 50,
        y = 100;
    const senderLeft = 20;
    const recieverLeft = 100;
    for (i = 0; i < senderBlock.length; i++) {
        const s = senderBlock[i];
        const r = receiverBlock[i];
        s.style.position = 'absolute';
        s.style.left = senderLeft + 'px';
        s.style.top = y + 'px';
        r.style.position = 'absolute';
        r.style.left = recieverLeft + 'px';
        r.style.top = y + 'px';
        y = y + increase;
    }
}

function onSenderClick(id) {
    if(SENDER == id){ //double click on the same station
        SENDER = -1;
    } else if(RECEIVER != -1){ //both sender and receiver are clicked
        SENDER = id;
        const sID = getStationID(SENDER);
        const rID = getStationID(RECEIVER);
        addPacket(`pc${sID}`, `pc${rID}`);
        SENDER = -1;
        RECEIVER = -1;
    }else{
        SENDER = id;

    }
}
function onReceiverClick(id) {
    if(RECEIVER == id){ //double click on the same station
        RECEIVER = -1;
    } else if(SENDER != -1){
        RECEIVER = id;
        const sID = getStationID(SENDER);
        const rID = getStationID(RECEIVER);
       addPacket(`pc${sID}`, `pc${rID}`);
        SENDER = -1;
        RECEIVER = -1;
    }else{
        RECEIVER = id;
    }
}

function addPacket(sender, reciver) {
    //listen to stations
    packetQueue.push([sender, reciver]);
  //  printQueue();
}
function changestyle(sendID, receiverID){ /// functon change style of sender and receiver 
     var div = document.getElementById( 'sendID' );
     div = function() {
      this.style.backgroundColor = 'green';
        };
    

    var div = document.getElementById(receiverID);
     div = function() {
      this.style.backgroundColor = 'green';
     };
    
    /// hena na2s ageb mkan token lma yl2e receiver change to frame 
    document.getElementById( 'token' ).style.backgroundColor = 'blue';
     document.getElementById( 'token' ).innerHTML  = "frame";

}

function fces(curStation) {
    if (typeof packetQueue !== 'undefined' && packetQueue.length > 0) {
        curSender = packetQueue[0][0];
        curReciever = packetQueue[0][1];
        //console.log(curStation);
        if (curStation == curSender) {
            // toggleSender(curStation);


            if (isSending == true) {
                isSending = false;
                changestyle(packetQueue[0][0], packetQueue[0][1]); // here change style of sender andreceiver
                packetQueue.shift();
                document.getElementById('token').innerHTML = "token";

                //printQueue();
            } else {
                isSending = true;
                document.getElementById('token').innerHTML = "frame";
                var recBtn = $(`#${curReciever}`);
                recBtn.addClass("pulse animated");
                //toggleReciever(curReciever);
                //document.getElementById('token').style.backgroundColor = "yellow";
            }
        } else if (curStation == curReciever && isSending) {
            //  toggleReciever(curStation);
            document.getElementById('token').innerHTML = "received";
            // document.getElementById('token').style.color = "green";
        }
    }
}

function createPath(radius) {
    const container = $("#rotator");
    var top = $(window).scrollTop() + Math.floor($(window).height() / 2);
    container.append(`<div class = "circle" id = "circle" style = "border: 8px solid #a9dadf; border-radius: 50%; background-color: rgba(230,230,230,0.3); position: absolute; box-shadow: 1px 0 10px 1px black inset; margin:0 auto;"</div>`);
    document.getElementById("circle").style.height = radius * 2 - 65 + "px";
    document.getElementById("circle").style.width = radius * 2 - 65 + "px";
    document.getElementById("circle").style.top = top - radius + 50 + "px";
    //document.getElementById("circle").style.left = 505 + "px";
}



