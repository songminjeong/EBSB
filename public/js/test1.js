import {adder} from "./test";

var video = null;
var video_sphere = document.getElementById("vr_view");

var view_entity = document.createElement('a-entity');
view_entity.setAttribute('id', 'view_sphere2');
var main_player = dashjs.MediaPlayer().create();
var database = null;
var arrayNum = null;

var enteredId = null;
var nodeArrayNum = null;
var clickId = 'v2';
var clickId_num = null;

var rot = null;

var nodeArray = [];
var distanceArr = [];
var idnodeArray = [];

var pos_x = null;
var pos_y = null;
var pos_z = null;


// function createEntity(mpd_list) {
//     for (let i = 0; i < mpd_list.length; i++) {
//         let entity = document.createElement('a-entity');
//         let pos = mpd_list[i]["pos"];
//         entity.setAttribute('id', 'vv' + (i + 1));
//         entity.setAttribute('view', '');
//         entity.setAttribute('position', '${pos.x} ${pos.y} ${pos.z}');
//         entity.setAttribute('geometry', "primitive: box; width:0.3; height:0.3; depth:0.3");
//
//         view_entity.appendChild(entity);
//     }
// }


AFRAME.registerComponent('main', {

        init: hi
    }
);


AFRAME.registerComponent('view', {
    init: function () {
        let el = this.el;
        util.view_init(el);
    }
});


document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    // As the user releases the Ctrl key, the key is no longer active,
    // so event.ctrlKey is false.
    if (keyName === 's') {
        main_player.play();
        main_player.setAutoPlay(true);
    }
}, false);


function map(f, list) {
    for (let i in list)
        list[i] = f(list[i])
}

function hi() {
    console.log(adder);
}
