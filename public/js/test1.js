

var video = document.getElementById("view");
var video_sphere = document.getElementById("vr_view");

var view_entity = document.createElement('a-entity');
view_entity.setAttribute('id', 'view_sphere2');
var main_player = dashjs.MediaPlayer().create();
var database = null;
var arr = [];
//
class node {
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
        console.log(this.pos.x);
        console.log(node.pos.x);
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

function createEntity(mpd_list) {
    for (let i = 0; i < mpd_list.length; i++) {
        let entity = document.createElement('a-entity');
        let pos = mpd_list[i]["pos"];
        entity.setAttribute('id', 'vv' + (i + 1));
        entity.setAttribute('view', '');
        entity.setAttribute('position', '${pos.x} ${pos.y} ${pos.z}');
        entity.setAttribute('geometry', "primitive: box; width:0.3; height:0.3; depth:0.3");

        view_entity.appendChild(entity);
    }
}

AFRAME.registerComponent('main', {

        init: function () {
            main_player.initialize(document.querySelector('#view'), 'video/v2/v2_dash.mpd', true);

            // createEntity();
            $.ajax({
                url: '/transfer',                //주소
                dataType: 'json',                  //데이터 형식
                type: 'POST',                      //전송 타입
                // data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
                success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                    database = result;
                    database.forEach(function (item) {
                        arr.push(new node(item));
                    });
                    for (let i of arr) {
                        arr.forEach(function (item) {
                            i.weight_link(item);
                        });
                    }
                    for (let i of arr)
                        i.print_info();
                },
                error: function (err) {
                    console.log(err);
                }//function끝
            });

        }
    }
);

AFRAME.registerComponent('view', {
    init: function () {
        var el = this.el;


        el.addEventListener('click', function (evt) {
            chage_view(el);
        });

        // TODO callback으로 mouseenter evt 넣기
        el.addEventListener('mouseenter', function (evt) {
            for (let i = 0; i < database.length; i++) {
                if (database[i].filename.split('.mp4')[0] === el.id) {
                    let pos_x = Number(database[i].metadata.pos.x); // - 0.35 ;
                    let pos_y = Number(database[i].metadata.pos.y); // - 0.04
                    let pos_z = Number(database[i].metadata.pos.z);
                    //el.setAttribute('visible', "false");
                    drawArrow(el.id, pos_x, pos_y, pos_z);
                }
            }
            //drawArrow();
            //console.log(this.getAttribute('id'));
        });
        el.addEventListener('mouseleave', function (evt) {
            let selectArrow = document.querySelector('#arrow');
            selectArrow.setAttribute('visible', false);
        });
    }
});


function request_mpd(id) {
    // TODO mpd and view matching required
    return "video/" + id + "/" + id + "_dash.mpd";
}

function chage_view(element) {
    // var vr_view = document.querySelector("#vr_view");
    let mpd = request_mpd(element.id); // video/v1/v1_dash.mpd
    // time sync
    let cur_time = main_player.getVideoElement().currentTime;
    main_player.attachSource(mpd);
    main_player.getVideoElement().currentTime = cur_time;
    console.log(cur_time);
    main_player.initialize();
    // TODO 카메라 위치도 변경 必  ↓오류
    document.querySelector('#camera').setAttribute('position', element.getAttribute('position'));

    //TODO set rotation
}

function drawArrow(id, pos_x, pos_y, pos_z) {
    console.log("id:" + id);
    let selectArrow = document.querySelector('#arrow');
    let rot = -Math.atan(pos_z / pos_x) * 180 / Math.PI;
    console.log('rotation_Y:' + rot);
    if (id === "v3" || id === "v5") {
        var rot2 = rot + 180;
        selectArrow.setAttribute('rotation', 0 + " " + rot2 + " " + 30);
    } else {
        selectArrow.setAttribute('rotation', 0 + " " + rot + " " + 30);
    }
    let show_x = pos_x - 0.35;
    let show_y = pos_y - 0.04;
    let show_z = pos_z + 0.02;
    selectArrow.setAttribute('visible', true);
    selectArrow.setAttribute('position', show_x + " " + show_y + " " + show_z);
}