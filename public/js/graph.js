
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
            link_ref.x.x_ref = "right";
        else if (x_val > 0)
            link_ref.x.x_ref = "left";

        if (z_val < 0)
            link_ref.z.z_ref = "up";
        else if (z_val > 0)
            link_ref.z.z_ref = "down";

        link_ref.x.val = x_val >= 0 ? x_val : -1 * x_val;
        link_ref.z.val = z_val >= 0 ? z_val : -1 * z_val;

        this.link[node.id] = link_ref;
    }

    get_link(v_list) {

    }

    print_info() {
        console.log(this.link);
    }
}

v1 = new node({x: 3, y: 0.8, z: 0}, "v1");
v2 = new node({x: 0, y: 0.8, z: 0}, "v2"); // 기준 y(높이)는 고려 안함
v3 = new node({x: -3, y: 0.8, z: 0}, "v3"); // 위에서 본 모양 기준
v4 = new node({x: 3, y: 0.8, z: 3.5}, "v4");
v5 = new node({x: -3, y: 0.8, z: 3.5}, "v5");

v_list = [v1, v2, v3, v4, v5];

v_list.forEach(function (v) {
    v1.weight_link(v);
});

v1.print_info();
