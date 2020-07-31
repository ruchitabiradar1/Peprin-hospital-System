// Make connection
var socket = io.connect('http://localhost:3000');

var output = document.getElementById('output'),
 feedback = document.getElementById('feedback');

 socket.on('sending', function(data){
     console.log("Rec at doc");
    feedback.innerHTML = '';
    output.innerHTML += '<p>' + data.fname+ ' ' + data.lname + ' has a temperature of '+ data.temp +'deg Fahr and a pulse rate of '+data.pulse+'/min and BP of '+data.bp+'mmHG</p>';
});