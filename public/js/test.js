export default function start() {
    console.log("hello aframe");
}

export class node {
    constructor(mpd_info) {
        this.pos = mpd_info.metadata.pos;
        this.id = mpd_info._id;
        this.src = mpd_info["location"] + mpd_info["mpdname"];
        this.link = [];
    }

    weight_link(node) {
        let link_ref = {
            distance: 0,
            x: {x_ref: "", val: 0},
            y: {y_ref: "", val: 0},
            z: {z_ref: "", val: 0}
        };

        let x_val = Number(this.pos.x) - Number(node.pos.x);
        let y_val = Number(this.pos.y) - Number(node.pos.y);
        let z_val = Number(this.pos.z) - Number(node.pos.z);
        let cnt = 0;

        if (x_val < 0)
            link_ref.x.x_ref = "right";
        else if (x_val > 0)
            link_ref.x.x_ref = "left";
        else
            cnt += 1;

        if (y_val < 0)
            link_ref.y.y_ref = "top";
        else if (y_val > 0)
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

//
    l2_norm(x, y, z) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }

    get_link(v_list) {

    }

    print_info() {
        console.log(this.link);
    }
}

export function main_init(el) {
    let video = document.querySelector('#view');
    let main_player = dashjs.MediaPlayer().create().initialize(video, 'video/v2/v2_dash.mpd', false);

    // createEntity();
    $.ajax({
        url: '/transfer',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        // data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
        success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            database = result;
            database.forEach(function (item) {
                nodeArray.push(new node(item));
            });
            for (let i of nodeArray) {
                nodeArray.forEach(function (item) {
                    i.weight_link(item);
                });
            }
            for (let i of nodeArray)
                i.print_info();
        },
        error: function (err) {
            console.log(err);
        }//function끝
    });
    return video, main_player;
}