var path = require('path');

class node {
    constructor(mpd_info) {
        this.pos = mpd_info["pos"];
        this.id = mpd_info["id"];
        this.src = mpd_info["mpdname"];
        this.link = [];
    }

    weight_link(node) {
        let link_ref = {
            distance: 0,
            x: {x_ref: "", val: 0},
            y: {y_ref: "", val: 0},
            z: {z_ref: "", val: 0}
        };

        let x_val = this.pos.x - node.pos.x;
        let y_val = this.pos.y - node.pos.y;
        let z_val = this.pos.z - node.pos.z;
        let cnt = 0;

        if (x_val < 0)
            link_ref.x.x_ref = "right";
        else if (x_val > 0)
            link_ref.x.x_ref = "left";
        else
            cnt += 1;

        if (y_val < 0)
            link_ref.y.y_ref = "top";
        else if (z_val > 0)
            link_ref.y.y_ref = "bottom";
        else
            cnt += 1;

        if (z_val < 0)
            link_ref.z.z_ref = "up";
        else if (z_val > 0)
            link_ref.z.z_ref = "down";
        else
            cnt += 1;

        link_ref.x.val = x_val >= 0 ? x_val : -1 * x_val;
        link_ref.y.val = y_val >= 0 ? y_val : -1 * y_val;
        link_ref.z.val = z_val >= 0 ? z_val : -1 * z_val;

        if (cnt) {
            link_ref.distance = this.l2_norm(x_val, y_val, z_val);
            this.link[node.id] = link_ref;
        }
    }

    l2_norm(x, y, z) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }

    get_link(v_list) {

    }

    print_info() {
        console.log(this.link);
    }
}

// v1 = new node({x: 3, y: 0.8, z: 0}, "v1");
// v2 = new node({x: 0, y: 0.8, z: 0}, "v2"); // 기준 y(높이)는 고려 안함
// v3 = new node({x: -3, y: 0.8, z: 0}, "v3"); // 위에서 본 모양 기준
// v4 = new node({x: 3, y: 0.8, z: 3.5}, "v4");
// v5 = new node({x: -3, y: 0.8, z: 3.5}, "v5");
//
// v_list = [v1, v2, v3, v4, v5];
//
// v_list.forEach(function (v) {
//     v1.weight_link(v);
// });
//
// v1.print_info();

function myConcat(separator) {
    var s = "";
    for (var i = 1; i < arguments.length; i++) {
        s += arguments[i];
        if (i < arguments.length - 1) s += separator
    }
    return s;
}
