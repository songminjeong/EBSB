var video = null;
var mpd_list = null;
var database = null;
var enteredId = null;
var arrayNum = null;
var clickId = 'v2';
var clickId_num = null;
var videosphere = null;

var pos_x = null;
var pos_y = null;
var pos_z = null;
var yaw = null;
var pitch = null;
var rot = null;

var nodeArray = [];
var distanceArr = [];
var idArr = [];


var main_player = dashjs.MediaPlayer().create();


AFRAME.registerComponent('main', {
        init: function () {
            videosphere = document.querySelector('#view');
            main_player.initialize(videosphere, 'files/v2/v2_dash.mpd', true);
            idArr.push('v2');
            $.ajax({
                url: '/transfer',                //address
                dataType: 'json',                  //Data type
                type: 'POST',                      //transmission type
                contentType:"application/json; charset=utf-8",
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

        }
    }
);

AFRAME.registerComponent('view', {
    init: function () {
        var el = this.el;
        
        el.addEventListener('mouseenter', function(evt) {
            enteredId = this.getAttribute('id')
            //idArr.push(enteredId);
            for(var i=0; i < database.length; i++){
                if(database[i].filename.split('.mp4')[0] == enteredId){
                    
                    pos_x = database[i].metadata.pos.x;
                    console.log(pos_x)
                    pos_y = database[i].metadata.pos.y;
                    console.log(pos_y)
                    pos_z = database[i].metadata.pos.z;
                    console.log(pos_z)                
                    
                    console.log("i:"+i);
                    // if(i == arrayNum){
                    //     distanceArr = nodeArray[i].link;
                    // };
                    
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
        this.viewname = mpd_info["filename"].split(".mp4")[0];
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


function request_mpd(id) {
    // TODO mpd and view matching required
    console.log("request_mpd:"+id)
    return "files/" + id + "/" + id + "_dash.mpd";
}

function preload_mpd(){
    
}

function chage_view(element) {
    clickId = element.id;
    var mpd = request_mpd(clickId);
    idArr.push(clickId);
    
    var camera = document.querySelector("#camera");
    camera.setAttribute('position', pos_x+" "+pos_y+" "+pos_z);
    console.log(camera.getAttribute('position'));
    if(clickId=='v8'){
        var vr_view = document.querySelector("#vr_view")
        vr_view.setAttribute('rotation','0 90 0');
        console.log('시발');
    }
    
    main_player.attachSource(mpd);
    main_player.initialize();
    
    console.log('change view');

}

function drawArrow(pos_x, pos_y, pos_z){

    var selectArrow = document.querySelector('#arrow');
    console.log("x:"+pos_x);
    console.log("z:"+pos_z);
    console.log('clickid:'+clickId);
    arrayNum = clickId.split('v')[1]-1;
    distanceArr = nodeArray[arrayNum].link

    //rotation
    yaw = Math.atan(distanceArr[enteredId].x.val/-distanceArr[enteredId].z.val)*180/Math.PI;
    console.log('yaw:'+yaw);
    pitch = Math.atan(Math.sqrt(distanceArr[enteredId].x.val*distanceArr[enteredId].x.val+distanceArr[enteredId].z.val*distanceArr[enteredId].z.val)/distanceArr[enteredId].y.val)*180/Math.PI;
    console.log('pitch:'+pitch);
    // rot = -Math.atan(distanceArr[enteredId].z.val/distanceArr[enteredId].x.val)*180/Math.PI;
    // console.log("rot:"+rot)
    var visi_y = pos_y-0.5;    
    console.log("enteredid:"+enteredId);
    selectArrow.setAttribute('rotation', pitch+" "+yaw+" "+30);
    selectArrow.setAttribute('visible', true);
    selectArrow.setAttribute('position', pos_x+" "+visi_y+" "+pos_z);

}


// function removeArrow(){
//     var selectArrow = document.querySelector("#arrow");
//     selectArrow.setAttribute('visible', false);
// }
