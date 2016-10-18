var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  modify: function(name, id) {
    var arrayIndex = -1;
    var item = {name: name, id: id};
    for (var i = 0; i < this.items.length; i++) {
        if(this.items[i].id === id) {
            arrayIndex = i;
            break;
        }
    }
    if (arrayIndex == -1)
        return false;
    this.items[arrayIndex] = item;
    return true;
  },
  delete: function(id) {
    var arrayIndex = -1;
    for (var i = 0; i < this.items.length; i++) {
        console.log(this.items[i].id + ' ' + this.items[i].name);
        if(this.items[i].id == id) {
            arrayIndex = i;
            break;
        }
    }
    if (arrayIndex == -1) {
        return false;
    } else {
        this.items.splice(arrayIndex, 1);
        return true;
    }
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

app.put('/items/:id', jsonParser, function(request, response) {
    if (!('id' in request.body) && !('name' in request.body)) {
        return response.status(400).json(request.params.id + ' could not be updated.');
    } else {
        var id = request.body.id;
        var name = request.body.name;
        var success = storage.modify(name, id);
        if (success) {
            return response.status(200).json({status: 'OK'});
        } else {
            return response.status(400).json({status: 'not OK'});
        }
    }
});

app.delete('/items/:id', jsonParser, function(request, response) {
    if (!('id' in request.params)) {
        return response.sendStatus(404), response.json('Hmm, I can\'t find that item. Please check the spelling and try again.');
    }
    var id = request.params.id;
    var success = storage.delete(id);
    if (success) {
        return response.status(200).json({status: 'OK'});
    } else {
        return response.status(400).json({status: 'not OK'});
    }
});

app.listen(process.env.PORT || 8080, process.env.IP);
