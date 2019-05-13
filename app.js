var express = require('express');
var app = express();
var path = require('path');

var server = app.listen(8080, function () {
    console.log("Express");
});

app.use(express.static(path.join(__dirname, '/public')));

app.get('/demo', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/main.html'));
});

function Circle(p, radius) {
    this.p = p;
    this.radius = radius;
}

Circle.prototype = {
    area: function () {
        return Math.PI * this.radius * this.radius;
    },
    setRadius: function(radius) {
      this.radius = radius;
      return this; // --> method chain 가능하게
    },
    print: function () {
      console.log(this);
      return this;
    }
};

var a = new Circle({x:3, y: 0}, 5);

console.log(a.constructor);