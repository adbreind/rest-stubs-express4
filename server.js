var express = require('express'),
    stubGenerator = require('./stub-generator'),
	bodyParser = require('body-parser'),
	logger = require('morgan');
 
var app = express();
 
app.use(allowCrossDomain);
app.use(logger());
app.use(bodyParser.json());

entities = [];
entities.forEach(stub);

function stub(name) {
    console.log("Stubbing: " + name);
	stubGenerator.initializeEntity(name);
	app.route('/' + name)
		.get(stubGenerator.findAll(name))
		.post(stubGenerator.create(name));
		
	var update = stubGenerator.update(name);
	
	app.route('/' + name + '/:id')
		.get(stubGenerator.findById(name))
		.post(update)
		.put(update)
		.delete(stubGenerator.delete(name));
		
    entities.push(name);
}

app.post("/entity/:name", function(req, res) {    
    var entityName = req.params.name;
    if (entityName && entities.indexOf(entityName)==-1 && entityName.indexOf(".")==-1) {
        stub(entityName);
        res.end();
    }
});

stubGenerator.initializeEntity("book", [{"title":"Great Expectations","id":2},{"title":"Bleak House","id":4}]);
stub("book");

stubGenerator.initializeEntity("contact", [
            {"first":"Joe","last":"Smith","email":"joe@gmail.com","id":1,
                company_id:"xyz", lotteryWinner : false },
            {"first":"Joe2","last":"Smith2","email":"joe2@gmail.com","id":2,
                company_id:"abc", lotteryWinner : false },
            {"first":"Joe3","last":"Smith3","email":"joe3@gmail.com","phone":"555-1212",
                "id":3, company_id:"xyz", lotteryWinner : false}
        ]);
stub("contact");

var port = Number(process.env.PORT || 5000);
app.listen(port);
console.log('Listening on port ' + port);

function allowCrossDomain (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
}