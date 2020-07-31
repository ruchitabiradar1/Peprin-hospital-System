var socket = io.connect('http://localhost:3000');

var temp = document.getElementById('temp'),
datetime=document.getElementById('datetime')     
bp = document.getElementById('bp'),
      pulse= document.getElementById('pulse'),
      btn=document.getElementById('send'),
      pn = document.getElementById('pn');

      function vit(){
        socket.emit('sending', {
            pn:pn.value,
            datetime:datetime.value,
            temp: temp.value,
            
            bp: bp.value,
            pulse: pulse.value,
        });
       /* pn.value="";
        temp.value = "";
        pulse.value="";
        bp.value="";
        
       
        window.location.assign("/home.html");*/
}


btn.addEventListener('click',()=>{
    vit();
    validation();
} );
socket.on('save', function(data){
    output.innerHTML='The doctor has received the details. Thank you for using!';
});