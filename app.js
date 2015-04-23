var express = require("express"),
    app = express();


app.get("/", function(req, res){
  res.json({ x: "y" });
});


var server = app.listen(3000, function(){
  console.log("Listening on port", server.address().port);
  console.log('Example app listening at http://%s:%s',
              server.address().address,
              server.address().port);
});
