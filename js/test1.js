var video = null;
var video_sphere = null;
var socket = null;
var mpd_list = null;
var database = null;
var dbArray = null;
var currentId = null;

var pos_x = null;
var pos_y = null;
var pos_z = null;

var arr = [];

var main_player = dashjs.MediaPlayer().create();


AFRAME.registerComponent('main', {
        init: function () {
            main_player.initialize(document.querySelector('#view'), 'files/v2/v2_dash.mpd', true);
            $.ajax({
                url: '/transfer',                //address
                dataType: 'json',                  //Data type
                type: 'POST',                      //transmission type
                contentType:"application/json; charset=utf-8",
                success: function (result) {
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
                } 
            });

        }
    }
);

AFRAME.registerComponent('view', {
    init: function () {
        var el = this.el;
        
        el.addEventListener('mouseenter', function(evt) {
            currentId = this.getAttribute('id')
            for(var i=0; i < database.length; i++){
                if(database[i].filename.split('.mp4')[0] == currentId){
                    pos_x = database[i].metadata.pos.x.split("'")[1]; // - 0.35 ;
                    pos_y = database[i].metadata.pos.y.split("'")[1]; // - 0.04
                    pos_z = database[i].metadata.pos.z.split("'")[1];
                    console.log("z:"+pos_z);// + 0.02;
                    drawArrow(pos_x, pos_y, pos_z);
                }
            };
            //drawArrow();
            //console.log(this.getAttribute('id')); 
        });
        el.addEventListener('click', function (evt) {
            chage_view(el);

        });
        el.addEventListener('mouseleave', function(evt){
            //removeArrow();
        })
    }
});

//node graph
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


function request_mpd(id) {
    // TODO mpd and view matching required
    console.log("request_mpd:"+id)
    return "files/" + id + "/" + id + "_dash.mpd";
}

function chage_view(element) {
    
    var mpd = request_mpd(element.id);
    var camera = document.querySelector("#camera");
    //var cur_time = main_player.getVideoElement().currentTime;
    
    camera.setAttribute('position', pos_x+" "+pos_y+" "+pos_z);
    main_player.attachSource(mpd);
    //main_player.getVideoElement().currentTime = cur_time;
    main_player.initialize();
    
    console.log('change view');

}

function drawArrow(pos_x, pos_y, pos_z){

    var selectArrow = document.querySelector('#arrow');
    console.log("x:"+pos_x);
    console.log("z:"+pos_z);
    let rot = -Math.atan(pos_z/pos_x)*180/Math.PI;
    console.log("rot:"+rot)
    console.log("id:"+currentId);
    // if(rot>0){
    //     let rot2 = rot+180;
    //     selectArrow.setAttribute('rotation', 0+" "+rot2+" "+30)
    //     console.log('rot2적용'+rot2);
    // }else{
        selectArrow.setAttribute('rotation', 0+" "+rot+" "+30);
        console.log('rot적용'+rot);
    //}

    selectArrow.setAttribute('visible', true);
    selectArrow.setAttribute('position', pos_x+" "+pos_y+" "+pos_z);

}
