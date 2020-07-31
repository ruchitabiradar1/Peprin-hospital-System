var express = require('express');
var socket = require('socket.io');
var mongoose=require('mongoose');
const router = express.Router();
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//var myvital=require('./views/vitals.js')
// App setup
//app.set('view engine', 'handlebars');
//var temp=myvital.temp;
var server = app.listen(3000, function(){
    console.log('listening for requests on port 3000,');
});
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/pvitals",(error)=>{
 if(!error)
 {
     console.log("success");
    
 }
 else{
     console.log("error");
 }
});

var conn = mongoose.createConnection("mongodb://localhost:27017/patient");
var ModelA    = conn.model('ModelA', new mongoose.Schema({
    user:String,
    gender:String,
    birthday:Date,
    phone: Number,
    height: Number,
    weight:Number,
    allergy: String,
    disease: Array,
    illness:String,
    comment:String,
    },
    {
        collection:'models'
    }

));

var conn1 = mongoose.createConnection("mongodb://localhost:27017/dn");
var ModelB    = conn1.model('ModelB', new mongoose.Schema({
    name:String,
    position:String,
    email:String,
    psw:String
  },
  {
   collection:'doc'
}
));

var conn2= mongoose.createConnection("mongodb://localhost:27017/pvitals");
var ModelC = conn2.model('ModelC', new mongoose.Schema({
    pn:String,
    datetime:String,
    temp:Number,
    bp:String,
    pulse:Number
   
  },
  {
      collection:'vitals'
  }
));


// Static files
app.use(express.static('views'));

app.get('/', function(req, res){ 
    res.render('index');
});

app.get('/index', function(req, res){ 
    res.render('index');
});

app.get('/register', function(req, res){ 
    res.render('register',{details:null});
});

app.get('/meditation', function (req,res){
    res.render('meditation');
    });



app.post('/registers',function(req,res)
{
//var myData = new ModelB(req.body);
    ModelB.findOne({'email':req.body.email},function(err,user)
        {
            if(user)
            {   

                res.render('register',{details:"User already exists"});
            }
               else
            {   var myData = new ModelB(req.body);   
                myData.save()
            .then(item => {
            res.render('index');
                })
            .catch(err => {
            console.log(err);
            res.status(400).send("Unable to save to database");
             });
                //res.render('doctorlogin',{details:"Ivalid credentials,retry"});
              
            }
        })
});

app.get('/doctorlogin', function(req, res){ 
    res.render('doctorlogin',{details:null});
});

app.get('/nurselogin', function(req, res){ 
    res.render('nurselogin',{details:null});
});

app.post('/doclogin', function(req,res) {
    var uname=req.body.uname;
    var psw=req.body.psw;
    ModelB.findOne({'position':'doctor','email':uname,'psw':psw},function(err,user)
        {
            if(user)
            {   

                res.render('details',{details:null});
               // res.send("invalid");

            }
            else
            {   
                res.render('doctorlogin',{details:"Invalid credentials,retry"});
              
            }
        })
});

app.get('/home', function(req, res){ 
    res.render('home');
});

app.post('/nurlogin', function(req,res) {
    var uname=req.body.uname;
    var psw=req.body.psw;
    ModelB.findOne({'position':'nurse','email':uname,'psw':psw},function(err,user)
        {
            if(user)
            {   

               res.render('home');
                //res.send("invalid");

            }
            else
            {   
                res.render('nurselogin',{details:"Ivalid credentials, retry"});
            }
        })
});

app.get('/vitals', function(req, res){ 
    res.render('vitals');
});

app.get('/details', function(req, res){ 
    res.render('details',{details:null});
});

app.post('/preg',function(req,res)
{
    ModelA.findOne({'phone':req.body.phone},function(err,user)
        {
            if(user)
            {   

                res.render('details',{details:"User already exists"});
            }
               else
            {   
                var myData = new ModelA(req.body);   
                myData.save()
                .then(item => {
                res.render('home');
                })
                .catch(err => {
                console.log(err);
                res.status(400).send("Unable to save to database");
                });
                //res.render('doctorlogin',{details:"Ivalid credentials,retry"});
              
            }
        });
});

app.get('/history', function(req, res){ 
    res.render('history',{details:null,patient:null,pdetails:null});
});


app.post('/his', function(req, res){ 
    ModelA.findOne({'user':req.body.name},function(err,user)
    {
        if(user)
        {   
            
            ModelC.find({'pn':req.body.name}, function (err, allDetails) 
            {
                if (err) {
                    console.log(err);
                } else {
                    //res.render("history",{details:allDetails});
            
                  res.render('history',{details:allDetails,patient:null,pdetails:user});
            
                    //res.sendFile(__dirname + "/history.html",{hi:"hello"});
                }
            });
        }
           else
        {   
           res.render('history',{details:null,patient:"Patient does not exist",pdetails:null});
            //res.render('doctorlogin',{details:"Ivalid credentials,retry"});
          

        }
    });
});


var io = socket(server);
var n=0;
var clients=[];
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    clients.push(socket.id);

    //socket.emit('sending',"IS this rec?");
    // Handle chat event
    socket.on('sending', function(data){
        // console.log(data);
//        console.log(temp);        
        io.sockets.emit('sending', data);
        
        var gg = new ModelC({pn:data.pn,datetime:data.datetime,temp:data.temp,bp:data.bp,pulse:data.pulse  });
        gg.save(function (err, book) {
            if (err) return console.error(err);
            console.log(book.name + " saved to bookstore collection.");
          });
        console.log(gg);
        
        //io.sockets.emit('save');
    });

    /*
    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    */
});

module.exports = router ;