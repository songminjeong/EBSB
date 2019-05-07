var v1 = dashjs.MediaPlayer().create();
var v2 = dashjs.MediaPlayer().create(); //initial view
var v3 = dashjs.MediaPlayer().create();
var v4 = dashjs.MediaPlayer().create();
var v5 = dashjs.MediaPlayer().create();

v1.setAutoPlay(false);
v2.setAutoPlay(true);
v3.setAutoPlay(false);
v4.setAutoPlay(false);
v5.setAutoPlay(false);

var v1_url = "video/cam1/cam1dash.mpd"
var v2_url = "video/cam2/cam2dash.mpd"
var v3_url = "video/cam3/cam3dash.mpd"
var v4_url = "video/cam4/cam4dash.mpd"
var v5_url = "video/cam5/cam5dash.mpd"

function change (id){
    var camera = document.querySelector("#camera")

    if(id == "cam1") {
        console.log("change");
        camera.setAttribute('position','-3 0.08 0')
        v2.attachSource(v1_url);
        v1.attachSource(v1_url);
        v2.initialize();
        v1.initialize();
    }else if(id == "cam2"){
        console.log("change");
        camera.setAttribute('position','0 0.08 0')
        v2.attachSource(v2_url);
        v2.initialize();
        
    }else if(id == "cam3"){
        console.log("change");
        camera.setAttribute('position','3 0.08 0')
        v2.attachSource(v3_url);
        v3.attachSource(v3_url);
        v2.initialize();
        v3.initialize();
    }else if(id == "cam4"){
        console.log("change");
        camera.setAttribute('position','-3 0.08 3.5')
        v2.attachSource(v4_url);
        v4.attachSource(v4_url);
        v2.initialize();
        v4.initialize();
    }else if(id == "cam5"){
        console.log("change");
        camera.setAttribute('position','3 0.08 3.5')
        v2.attachSource(v5_url);
        v5.attachSource(v5_url);
        v2.initialize();
        v5.initialize();
    };

};
AFRAME.registerComponent('main',{
    schema: {
        event: {type: 'string', default: ''},
        message: {type: 'string', default: 'Hello, World'},
    },

    init: function(){
        var cursor = document.querySelector("#cursor");

        cursor.onmouseleave = function(evt){
            this.setAttribute('color','black');
            var scale = evt.detail.intersectedEl.object3D.scale;
            scale.set(1,1,1);
        }

        cursor.onmouseenter = function(evt){
            this.setAttribute('color','green');
            var scale = evt.detail.intersectedEl.object3D.scale;
            scale.set(1.5,1.5,1.5);
        }

        cursor.onclick = function (evt) {
            console.log(evt.detail.intersectedEl.id);
            change(evt.detail.intersectedEl.id);
        }
        v1.initialize(document.querySelector("#view1"), v1_url);
        v2.initialize(document.querySelector("#view2"), v2_url);
        v3.initialize(document.querySelector("#view3"), v3_url);
        v4.initialize(document.querySelector("#view4"), v4_url);
        v5.initialize(document.querySelector("#view5"), v5_url);
        
    },
    update: function () {
        // Do something when component's data is updated.
    },

    remove: function () {
        // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
        // Do something on every scene tick or frame.
    }
})
