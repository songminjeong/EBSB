var video = null;
var mpd_list = null;
var database = null;
var enteredId = null;
var arrayNum = null;
var clickId = 'v2';
var clickId_num = null;
var videosphere = null;
var buffer_count = 0;

var pos_x = null;
var pos_y = null;
var pos_z = null;
var yaw = null;
var pitch = null;
var rot = null;
var cur_time = null;
var nodeArray = [];
var distanceArr = [];
var idArr = [];

var v1_url = "files/v1/v1_dash.mpd"
var v2_url = "files/v2/v2_dash.mpd"
var v3_url = "files/v3/v3_dash.mpd"
var v4_url = "files/v4/v4_dash.mpd"
var v5_url = "files/v5/v5_dash.mpd"
var v6_url = "files/v6/v6_dash.mpd"
var v7_url = "files/v7/v7_dash.mpd"
var v8_url = "files/v8/v8_dash.mpd"

var mpd = 'files/v2/v2_dash.mpd';


var v1 = dashjs.MediaPlayer().create();
var v2 = dashjs.MediaPlayer().create(); //initial view
var v3 = dashjs.MediaPlayer().create();
var v4 = dashjs.MediaPlayer().create();
var v5 = dashjs.MediaPlayer().create();
var v6 = dashjs.MediaPlayer().create();
var v7 = dashjs.MediaPlayer().create();
var v8 = dashjs.MediaPlayer().create();


var main_player = null;


//player.setLongFormContentDurationThreshold(200);
// main_player.on('playbackProgress', function(result){
//     console.log(result);
// });
function init() {
    AFRAME.registerComponent('main', {
        init: function () {
            videosphere = document.querySelector('#view');

            main_player = dashjs.MediaPlayer().create();
            main_player.initialize(videosphere, mpd, false);
            
            main_player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, function (evt) {
                // buffer_count++;
                // console.log(buffer_count);
                // if (buffer_count == 2) {
                //     if (main_player.isReady())
                //         main_player.play();
                //     buffer_count = 0;
                // }
                // console.log('buffer load'); // 3인데 2번 실행 됨
            });
            
            main_player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, function (evt) {
                console.log("manifest load")
            });

            main_player.on(dashjs.MediaPlayer.events.STREAM_TEARDOWN_COMPLETE, function (evt) {
                main_player.attachSource(mpd);
                console.log("reset");
            });

            idArr.push('v2');
            $.ajax({
                url: '/transfer',                //address
                dataType: 'json',                  //Data type
                type: 'POST',                      //transmission type
                contentType: "application/json; charset=utf-8",
                success: function (result) {
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
                }
            });
            //preload_segment();
            // v1.initialize(document.querySelector("#view1"), v1_url);
            // v2.initialize(document.querySelector("#view2"), v2_url);
            // v3.initialize(document.querySelector("#view3"), v3_url);
            // v4.initialize(document.querySelector("#view4"), v4_url);
            // v5.initialize(document.querySelector("#view5"), v5_url);
            // v6.initialize(document.querySelector("#view3"), v6_url);
            // v7.initialize(document.querySelector("#view4"), v7_url);
            // v8.initialize(document.querySelector("#view5"), v8_url);
        }
    }
    );

    AFRAME.registerComponent('view', {
        init: function () {
            var el = this.el;

            el.addEventListener('mouseenter', function (evt) {
                enteredId = this.getAttribute('id')

                for (var i = 0; i < database.length; i++) {
                    if (database[i].filename.split('.mp4')[0] == enteredId) {

                        pos_x = database[i].metadata.pos.x;
                        // console.log(pos_x);
                        pos_y = database[i].metadata.pos.y;
                        // console.log(pos_y);
                        pos_z = database[i].metadata.pos.z;
                        // console.log(pos_z);

                        // console.log("i:" + i);
                        drawArrow(pos_x, pos_y, pos_z);
                    }
                };
                //drawArrow();
                //console.log(this.getAttribute('id')); 
            });
            el.addEventListener('click', function (evt) {
                cur_time = main_player.getVideoElement().currentTime;
                chage_view(el, cur_time);
            });
        }
    });

}

$(document).ready(function () {

    init();

    document.addEventListener('keyup', (evt) => {
        const keyName = event.key;

        if (keyName == 's') {
            if (main_player.isPaused())
                main_player.play()
            else
                main_player.pause();
        }   

    });
    }
)




function chage_view(element) {
    // console.log("curTime:" + cur_time);
    clickId = element.id;
    mpd = request_mpd(clickId);
    idArr.push(clickId);

    //main_player.getVideoElement().currentTime = cur_time;

    var camera = document.querySelector("#camera");
    camera.setAttribute('position', pos_x + " " + pos_y + " " + pos_z);
    // console.log(camera.getAttribute('position'));
    if (clickId == 'v8') {
        var vr_view = document.querySelector("#vr_view")
        vr_view.setAttribute('rotation', '0 90 0');
    } else {
        var vr_view = document.querySelector("#vr_view")
        vr_view.setAttribute('rotation', '0 -90 0');
    }

    main_player.reset();
    main_player.getVideoElement().currentTime = cur_time;

    // console.log('change view');
}

function request_mpd(clickId) {
    // TODO mpd and view matching required
    // console.log("request_mpd:" + clickId)
    return "files/" + clickId + "/" + clickId + "_dash.mpd";
}

function drawArrow(pos_x, pos_y, pos_z) {

    var selectArrow = document.querySelector('#arrow');

    arrayNum = clickId.split('v')[1] - 1;
    distanceArr = nodeArray[arrayNum].link

    var x = distanceArr[enteredId].x.val;
    var z = distanceArr[enteredId].z.val;

    //rotation
    yaw = Math.atan(x / -z) * 180 / Math.PI;

    pitch = Math.atan(Math.sqrt(x * x + z * z) / 1) * 180 / Math.PI;

    var visi_y = pos_y - 0.5;
    // console.log("enteredid:" + enteredId);
    selectArrow.setAttribute('rotation', pitch + " " + yaw + " " + 30);
    selectArrow.setAttribute('visible', true);
    selectArrow.setAttribute('position', pos_x + " " + visi_y + " " + pos_z);
}

class node {
    constructor(mpd_info) {
        this.pos = mpd_info.metadata.pos;
        this.viewname = mpd_info["fileId"]
        this.src = mpd_info["location"] + mpd_info["mpdname"];
        this.link = [];

    }

    weight_link(node) {
        let link_ref = {
            distance: 0,
            x: { x_ref: "", val: 0 },
            y: { y_ref: "", val: 0 },
            z: { z_ref: "", val: 0 }
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
            this.link[node.viewname] = link_ref;
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
