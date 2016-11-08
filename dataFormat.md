## data format
*if you accidentally see this, just pretend you didn't*

## for first sprint
*functions: chat enablement*

|action\side|client.emit|client.data|server.emit|server.data|
|:-------------:|:-------------:|:-------------:|:-------------:|:-------------:|
|login|"login"|{"username":"","password":""}|"onlogin"|#to everyone#<br> {'userLogin':{'action':'login','userList':{}}} <br><br> #to user#<br> {"status":"granted"} or {"status":"forbidden"}|
|message|"message"|{"sender":"",recipient":"","content":""}|"onmessage"|{"content":"","sender":"","time":""}|
|logoff|"logoff"|{"username":""}|"onlogoff"|#boradcast to everyone# {"action":"logoff","username":""}|
