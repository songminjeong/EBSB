var cur_node = 'v2';
var p_list = [];
var assets = null;


AFRAME.registerComponent('main', {
    init: function () {
        getData().then(function (result) {
            createView(result);
            let node_link = [];
            result.forEach(function (item) {
                let name = item.filename.split('.')[0];
                node_link[name] = new node(item);
            });

            for (let i in node_link) {
                for(let j in node_link) {
                    node_link[i].weight_link(node_link[j])
                }
            }

            preload_seg(node_link)
            
            let video = document.querySelector('#v2_v');
            var main_player = dashjs.MediaPlayer().create();
            main_player.initialize(video, 'files/v2/v2_dash.mpd', true);

            

            AFRAME.registerComponent('view', {
                init: function () {
                    let el = this.el;
                    addElEvent(el, node_link, main_player);
                    // addElEvent(el);
                }
            });
        });

    }
});

function getData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/transfer',                //주소
            dataType: 'json',                  //데이터 형식
            type: 'POST',                      //전송 타입
            // data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
            success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                resolve(result)
            },
            error: function (err) {
                reject(err)
            }//function 끝
        });
    });
}

function createView(data) {

    data.forEach(function (item) {
        let parent = document.querySelector('#view_sphere');
        let view = document.createElement('a-entity');

        view.setAttribute('view', '');
        view.setAttribute("id", item.filename.split(".")[0]);
        view.setAttribute('material', {
           alphaTest:1,
           opacity:0 
        });
        view.setAttribute('geometry', {
            primitive: 'box',
            width: 0.3,
            height: 0.3,
            depth: 0.3
        });
        view.setAttribute('position', item.metadata.pos);
        parent.appendChild(view);
    });
}

function addElEvent(element, node_link, main_player) {
    element.addEventListener('click', function (evt) {
        console.log(cur_node);
        //cur_node = v1, v2, v3 ..
        cur_node = element.id;
        
        if(p_list !== []){
            main_player.reset();
            p_list[cur_node].play();
        }
        // mpd 변경
        let camera = document.querySelector('#camera');
        
        if(cur_node == 'v8'){
            let videosphere = document.querySelector('#vr_view');
            videosphere.setAttribute('rotation',{
                x:0,
                y:90,
                z:0
            });
        }else{
            let videosphere = document.querySelector('#vr_view');
            videosphere.setAttribute('rotation',{
                x:0,
                y:-90,
                z:0
            }); 
        }
        camera.setAttribute('position', node_link[cur_node].pos);
        
        preload_seg(node_link);
             
    });

    element.addEventListener('mouseenter', function (evt) {
        drawArrow(element, node_link);
    });
}

function drawArrow(element, node_link) {

    let arrow = document.querySelector('#arrow');
    let current = node_link[cur_node].link;
    var x = current[element.id].x.val;
    var z = current[element.id].z.val;

    let yaw = Math.atan(x / -z) * 180 / Math.PI;
    let pitch = Math.atan(Math.sqrt(x * x + z * z)) * 180 / Math.PI;

    arrow.setAttribute('visible', true);
    arrow.setAttribute('rotation', {
        x: pitch,
        y: yaw,
        z: 30
    });
    let a = element.getAttribute('position');
    console.log(a);
    arrow.setAttribute('position', a);
}
function preload_seg(node_link) {
    let current = node_link[cur_node];
    var srcArr = [];
    p_list = [];
    console.log(current.id);

    //item = v1, v2, v3,...
    assets = document.querySelector('a-assets');
    for (let item in current.link) {
        if (current.link[item].distance < 5) {
            srcArr[item] = node_link[item].src;
       };
    };
        for (let item in srcArr) {
            
        let video_item = document.querySelector('#'+item+'_v');
        p_item = dashjs.MediaPlayer().create();
        p_item.initialize(video_item, srcArr[item], true);
        
        console.log(p_item.parent);
        p_list[item] = p_item;
        
    };
};

class node {
    constructor(data) {
        this.pos = data.metadata.pos;
        this.id = data.filename.split('.')[0];
        this.src = data["location"] + data["mpdname"];
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

        if (x_val < 0)
            link_ref.x.x_ref = "right";
        else if (x_val > 0)
            link_ref.x.x_ref = "left";


        if (y_val < 0)
            link_ref.y.y_ref = "top";
        else if (y_val > 0)
            link_ref.y.y_ref = "bottom";


        if (z_val < 0)
            link_ref.z.z_ref = "up";
        else if (z_val > 0)
            link_ref.z.z_ref = "down";

        link_ref.x.val = x_val >= 0 ? x_val : -1 * x_val;
        link_ref.y.val = y_val >= 0 ? y_val : -1 * y_val;
        link_ref.z.val = z_val >= 0 ? z_val : -1 * z_val;

        link_ref.distance = this.l2_norm(x_val, y_val, z_val);
        this.link[node.id] = link_ref;
    }

    l2_norm(x, y, z) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }
}
