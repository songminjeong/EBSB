var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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

function main_init(el) {
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

function view_init(el) {
    console.log(el);
    el.addEventListener('click', function (evt) {
        chage_view(el);
    });

    // TODO callback으로 mouseenter evt 넣기
    el.addEventListener('mouseenter', function (evt) {
        // enteredId = this.getAttribute('id');
        for (let i = 0; i < database.length; i++) {
            if (database[i].filename.split('.mp4')[0] === el.id) {
                let pos_x = Number(database[i].metadata.pos.x); // - 0.35 ;
                let pos_y = Number(database[i].metadata.pos.y); // - 0.04
                let pos_z = Number(database[i].metadata.pos.z);
                //el.setAttribute('visible', "false");
                drawarrow(el.id, pos_x, pos_y, pos_z);
            }
        }
        //drawarrow();
        //console.log(this.getAttribute('id'));
    });
    el.addEventListener('mouseleave', function (evt) {
        let selectarrow = document.querySelector('#arrow');
        selectarrow.setAttribute('visible', false);
    });
}

function drawarrow(pos_x, pos_y, pos_z) {

    var selectnodeArrayow = document.querySelector('#nodeArrayow');
    console.log("x:" + pos_x);
    console.log("z:" + pos_z);
    // nodeArrayNum = clickId.split('v')[1] - 1;
    // distanceArr = nodeArray[nodeArrayNum].link;
    // rot = -Math.atan(distanceArr[enteredId].z.val / distanceArr[enteredId].x.val) * 180 / Math.PI;
    // console.log("rot:" + rot);
    // console.log("enteredid:" + enteredId);
    //  if(rot<0){
    //     let rot2 = rot+180;
    //      selectnodeArrayow.setAttribute('rotation', 0+" "+rot2+" "+30)
    //      console.log('rot2적용'+rot2);
    //  }else{
    //     selectnodeArrayow.setAttribute('rotation', 0+" "+rot+" "+30);
    //     console.log('rot적용'+rot);
    // }
    //selectnodeArrayow.setAttribute('rotation', 0 + " " + rot + " " + 30);
    // selectnodeArrayow.setAttribute('visible', true);
    // selectnodeArrayow.setAttribute('position', pos_x + " " + pos_y + " " + pos_z);
}

function request_mpd(id) {

    // TODO mpd and view matching required
    return "video/" + id + "/" + id + "_dash.mpd";
}

function chage_view(element) {
    // clickId = element.id;
    console.log(element);
    // var vr_view = document.querySelector("#vr_view");
    let mpd = request_mpd(element.id); // video/v1/v1_dash.mpd
    idnodeArray.push(clickId);
    console.log("clickId: " + clickId);
    // time sync
    // let cur_time = main_player.getVideoElement().currentTime;
    // main_player.getVideoElement().currentTime = cur_time;

    // console.log(cur_time);

    console.log(main_player.preload());

    // TODO 카메라 위치도 변경 必  ↓오류
    document.querySelector('#camera').setAttribute('position', pos_x + " " + pos_y + " " + pos_z);
    //TODO set rotation
}

router.get('/', function (req, res, next) {
    res.render('index', {title: 'hello'})
});

module.exports = router;