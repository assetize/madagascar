var express = require("express"),
    app = express();


app.get("/", function(req, res){
  res.json({ x: "y" });
});


var server = app.listen(3000, function(){
  console.log("Listening on port", server.address().port);
});
