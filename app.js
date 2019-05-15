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

v1 = new node({x: 3, y: 0.8, z: 0}, "v1");
v2 = new node({x: 0, y: 0.8, z: 0}, "v2"); // 기준 y(높이)는 고려 안함
v3 = new node({x: -3, y: 0.8, z: 0}, "v3"); // 위에서 본 모양 기준
v4 = new node({x: 3, y: 0.8, z: 3.5}, "v4");
v5 = new node({x: -3, y: 0.8, z: 3.5}, "v5");

v_list = [v1, v2, v3, v4, v5];

class node {
    constructor(pos, id) {
        this.pos = pos;
        this.id = id;
        this.link = [];
    }

    weight_link(node) {
        let link_ref = {
            x: {x_ref: "", val: 0},
            y: {y_ref: "", val: 0},
            z: {z_ref: "", val: 0}
        };

        let x_val = this.pos.x - node.pos.x;
        let z_val = this.pos.z - node.pos.z;

        if (x_val < 0)
            link_ref.x.x_ref = "left";
        else if (x_val > 0)
            link_ref.x.x_ref = "right";

        if (z_val < 0)
            link_ref.z.z_ref = "up";
        else if (z_val > 0)
            link_ref.z.z_ref = "down";

        link_ref.x.val = x_val > 0 ? x_val : -1 * x_val;
        link_ref.z.val = z_val > 0 ? z_val : -1 * z_val;

        this.link[node.id] = link_ref;
    }

    print_info() {
        for (let info in this.link) {
            console.log(info);
        }
    }
}

for (let v in v_list)
    v1.weight_link(v);

v1.print_info();