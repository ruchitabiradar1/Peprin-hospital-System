// Make connection
var socket = io.connect('http://localhost:3000');

// Query DOM
var fname = document.getElementById('fname'),
      lname = document.getElementById('lname'),
      temp= document.getElementById('temp'),
      pulse = document.getElementById('pulse'),
      bp=document.getElementById('BP'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');
 
// Emit events
btn.addEventListener('click', function(){
    socket.emit('sending', {
        fname: fname.value,
        lname: lname.value,
        temp: temp.value,
        pulse: pulse.value,
        bp: bp.value,
    });
    temp.value = "";
    pulse.value="";
    bp.value="";
});

/*
fname.addEventListener('keypress', function(){
    socket.emit('typing', fname.value);
})

// Listen for events
*/
socket.on('save', function(data){
    output.innerHTML='The doctor has received the details. Thank you for using!';
});
/*
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
*/
