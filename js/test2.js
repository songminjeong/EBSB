

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

var v1_url = "video/cam1/cam1_dash.mpd"
var v2_url = "video/cam2/cam2_dash.mpd"
var v3_url = "video/cam3/cam3_dash.mpd"
var v4_url = "video/cam4/cam4_dash.mpd"
var v5_url = "video/cam5/cam5_dash.mpd"

var adjGraph = {
    "cam1": {cams:[2, 4], directions:[5, 6]},
    "cam2": {cams:[1, 3, 4, 5], directions:[1, 2, 3, 4]},
    "cam3": {cams:[2, 5], directions:[7, 8]},
    "cam4": {cams:[1, 5], directions:[9, 10]},
    "cam5": {cams:[3, 4], directions:[11, 12]}
}
function change (id){
    
    var camera = document.querySelector("#camera")
    var goCam = document.querySelector("#"+document.querySelector("#"+id).getAttribute("to"))
    var curCam = document.querySelector("#"+document.querySelector("#"+id).getAttribute("from"))
    var playtime = v2.getVideoElement().currentTime;
    console.log("curCam:"+curCam.id)
    console.log("goCam:"+goCam.id)
    for(var i = 0; i < adjGraph[curCam.id].cams.length; i++){
        var goCam = document.querySelector("#cam"+adjGraph[curCam.id].cams[i])
        drawArrow(curCam, goCam, "direction"+adjGraph[curCam.id].directions[i])
        
    }
    if(goCam.id == "cam1") {
        console.log("change");
        camera.setAttribute('position','3 0.08 0')
        v2.attachSource(v1_url);
        v2.getVideoElement().currentTime = playtime ;
    }else if(goCam.id == "cam2"){
        console.log("change");
        camera.setAttribute('position','0 0.08 0')
        v2.attachSource(v2_url);
        v2.getVideoElement().currentTime = playtime
        //v2.initialize();
    }else if(goCam.id == "cam3"){
        console.log("change");
        camera.setAttribute('position','0 0.08 0')
        v2.attachSource(v2_url);
        v2.getVideoElement().currentTime = playtime
        //v2.initialize();
    }else if(goCam.id == "cam4"){
        console.log("change");
        camera.setAttribute('position','-3 0.08 3.5')
        v2.attachSource(v4_url);
        v2.getVideoElement().currentTime = playtime
        // v4.attachSource(v4_url);
        // v2.initialize();
        // v4.initialize();
    }else if(goCam.id == "cam5"){
        console.log("change");
        camera.setAttribute('position','3 0.08 3.5')
        v2.attachSource(v5_url);
        v2.getVideoElement().currentTime = playtime
        // v5.attachSource(v5_url);
        // v2.initialize();
        // v5.initialize();
    };

};

// AFRAME.registerComponent('view',{
//     init: function() {
//         var el = this.el;
//         console.log(el);
//     },
//     tick: function() {
//         if (this.el.id === "cam3") {
//             console.log("cam3 duration -> " +v3.duration());
//         }
//     }
// });
function getRotation(curCam, goCam){
    var curCamPos = curCam.getAttribute("position");
    var goCamPos = goCam.getAttribute("position");
    console.log("goCamPos:"+JSON.stringify(goCamPos))
    var retPos={
        x:0,
        y:0,
        z:0
    };
    retPos.x = (goCamPos.x - curCamPos.x) / 2;
    retPos.z = (goCamPos.z - curCamPos.z) / 2;
    retPos.y = Math.sqrt(Math.pow(retPos.x,2) + Math.pow(retPos.z,2));
    console.log("retPos.x:"+retPos.x)
    console.log("retPos.y:"+retPos.y)
    console.log("retPos.z:"+retPos.z)
    var retRot={
        x:-86,
        y:0,
        z:0
    };
    console.log("retRot.z:"+Math.atan(retPos.z/retPos.x))
    console.log("retRot.y:"+Math.asin(retPos.x/retPos.y))
    
    retRot.y = -Math.asin(retPos.x/retPos.y)*180/Math.PI
    //retRot.z = Math.atan(retPos.z/retPos.x)*180/Math.PI;
     
    // retPos_y_radian = retPos.y * 180 / Math.PI;
    // retPos_x_radian = retPos.x * 180 / Math.PI;
    // console.log("retPos_y_radian:"+retPos_y_radian)
    // console.log("retPos_x_radian:"+retPos_x_radian)
    // retRot.y = Math.asin(retPos_y_radian/retPos_x_radian)
    // console.log("retRot.y:"+retRot.y)
    return retRot;
}
function getPosition(curCam, goCam){
    var curCamPos = curCam.getAttribute("position");
    var goCamPos = goCam.getAttribute("position");
    console.log("goCamPos:"+JSON.stringify(goCamPos))
    var retPos={
        x:0,
        y:0,
        z:0
    };
    retPos.x = (goCamPos.x - curCamPos.x) / 2;
    retPos.z = (goCamPos.z - curCamPos.z) / 2;
    return retPos;
}
function drawArrow(curCam, goCam, direction){
    var arrowPosition = getPosition(curCam, goCam);
    var arrowRotation = getRotation(curCam, goCam);
    var scene = document.querySelector('a-scene');
    var entity = document.createElement('a-entity');
    entity.setAttribute('id', direction)
    entity.setAttribute('from', curCam.getAttribute('id'))
    entity.setAttribute('to', goCam.getAttribute('id'))
    entity.setAttribute('geometry', 'primitive: plane; width:0.5; height:0.5;')
    entity.setAttribute('material', 'src:#arrow; alphaTest:0.6');
    entity.setAttribute('position', arrowPosition.x+" "+arrowPosition.y+" "+arrowPosition.z );
    entity.setAttribute('rotation', arrowRotation.x+" "+arrowRotation.y+" "+arrowRotation.z );
    scene.appendChild(entity);
}

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

        cursor.onclick = function (evt){
            var playview = evt.detail.intersectedEl.id;
            
            console.log(playview);
            change(evt.detail.intersectedEl.id);
            //evt.detail.intersectedEl.id == 
            //console.log(this.el.getVideoElement().currentTime);
        }

        v1.initialize(document.querySelector("#view1"), v1_url);
        v2.initialize(document.querySelector("#view2"), v2_url);
        v3.initialize(document.querySelector("#view3"), v3_url);
        v4.initialize(document.querySelector("#view4"), v4_url);
        v5.initialize(document.querySelector("#view5"), v5_url);
        for(var i = 0; i < adjGraph.cam2.cams.length; i++){
            var goCam = document.querySelector("#cam"+adjGraph.cam2.cams[i])
            drawArrow(cam2, goCam, "direction"+adjGraph.cam2.directions[i])
        }
        
        // for(var i = 0; i < adjGraph.cam1.cams.length; i++){
        //     var goCam = document.querySelector("#cam"+adjGraph.cam1.cams[i])
        //     drawArrow(cam1, goCam, "direction"+adjGraph.cam1.directions[i])
        // }
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

// //list array create
// class Graph{
//     constructor(noOfVertices){
//         this.noOfVertices = noOfVertices;
//         this.AdjList = new Map();
//     }
//     addVertex(v)
//     {
//         this.AdjList.set(v,[]);
//     }
//     addEdge(v,w)
//     {
//         this.AdjList.get(v).push(w);
//         this.AdjList.get(w).push(v);
//     }
//     printGraph(){
//         var get_keys = this.AdjList.keys();
//         for(var i of get_keys){
//             var get_values = this.AdjList.get(i);
//             var conc = "";

//             for(var j of get_values)
//                 conc +=j + " ";
//             console.log(i + "->" + conc);
//         };
//     };
      
// }
// var g = new Graph(5);  
// var vertices = ['direction1', 'direction2', 'direction3', 'direction4', 'direction5'];
// for(var i = 0; i< vertices.length; i++){
//     g.addVertex(vertices[i]);
// }
// g.addEdge('direction1', 'direction4');
// g.addEdge('direction1', 'direction2');
// g.addEdge('direction2', 'direction3');
// g.addEdge('direction2', 'direction4');
// g.addEdge('direction2', 'direction5');
// g.addEdge('direction3', 'direction5');
// g.addEdge('direction4', 'direction5');
// g.printGraph();

