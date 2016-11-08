/*
heelhacker server end
Zhenwei Wang, Mandi Hu
*/
var express =require('express');

var app = express();

// set a few users for demo purpose
const userList= {
  "Jack":{"name":"Jack Davis","title":"Partner","uid":"","online":false},
  "Lucy":{"name":"Lucy Lowes","title":"Senior Lawyer","uid":"","online":false},
  "Jane":{"name":"Jane Stevens","title":"Senior Lawyer","uid":"","online":false},
  "Stephen":{"name":"Stephen Curry","title":"Lawyer","uid":"","online":false},
  "Lew":{"name":"Lew Hassell","title":"Lawyer","uid":"","online":false},
  "Bree":{"name":"Bree Manning","title":"Admin","uid":"","online":false},
  "Mike":{"name":"Mike Brown","title":"Intern","uid":"","online":false},
};
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var http = require('http').Server(app);
var io = require('socket.io')(http);

var cfenv = require('cfenv');

// can be used to display date, deprecated for heelhacker project
function getTime (){
  var today = new Date();
  var month = monthNames[today.getMonth()];
  var date = today.getDate();
  var year = today.getFullYear();
  var hour = today.getHours();
  var minutes = today.getMinutes();
  return hour+ ":"+minutes+", " +month + " " + date + ", " + year;
}

//serve two static folders for styling
app.use(express.static('public/images'));
app.use(express.static('public/stylesheets'));

// serve static page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});


var appEnv = cfenv.getAppEnv();

http.listen(appEnv.port, appEnv.bind, function() {
  console.log("server starting on " + appEnv.url);
});

// listen to connection
io.on('connection', function(socket) {
  // handle login
  socket.on('login', function(data) {
      // if user is registered to use the system and is not currently login
      if (userList.hasOwnProperty(data.username)){
        console.log("Someone logged in");
        // change user status to true
        userList[data.username].online = true;
//         console.log console.log(userList);
        
        // assign the socket.id to user
        userList[data.username].uid = socket.id;
        // grant access
        io.to(socket.id).emit('onlogin',{'status':'granted'});
        // broadcast new userlist
        io.emit('userLogin',{'action':'login','userList':userList});
    }
    else{
      // forbid access
      io.to(socket.id).emit('onlogin',{'status':'forbidden'});
    }
  });

  // handle messaging
  socket.on('message',function(data){
    console.log(data.recipient);
    // if targeted message, send to the recipient
    if (data.recipient!='All'){
//    console.log console.log(userList);

    var targetID = userList[data.recipient].uid;

    // send info to sender that it's done
    // io.to(socket.id).emit({"status":"done"});
    io.to(targetID).emit('onmessage',{'content':data.content,'sender': data.sender });
  }

  // if broadcast, broadcast to all
  else{
    io.emit('onmessage',{'content':data.content,'sender': data.sender});
  }
});

  // handle logoff
  socket.on('logoff',function(data){
    io.emit("onlogoff",{'username':data.username});
  });

});
