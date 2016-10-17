var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('bananas');
storage.add('tomatoes');
storage.add('arugula');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }
    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(request, response) {
    if (!('id' in request.body)) {
      return response.sendStatus(404), response.json('Hmm, I can\'t find that item. Please check the spelling and try again.');
    }
    var index = request.body.id-1;
    storage.items.splice(index, 1);
    response.status(200).json(request.body.name + ' has been deleted.');
});

app.listen(process.env.PORT || 8080, process.env.IP);
