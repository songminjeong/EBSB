var video = null;
var video_sphere = null;
var socket = null;
var mpd_list = null;
var database = null;
var dbArray = null;
var currentId = null;
// var pos_x = null;
// var pos_y = null;
// var pos_z = null;


var main_player = dashjs.MediaPlayer().create();
main_player.initialize(document.querySelector('#view'));
main_player.setAutoPlay(true);


AFRAME.registerComponent('main', {
        init: function () {
            //     var background = document.querySelector("#background");
            video_sphere = document.querySelector("#vr_view");

            $.ajax({
                url: '/transfer',                //주소
                dataType: 'json',                  //데이터 형식
                type: 'POST',                      //전송 타입
                contentType:"application/json; charset=utf-8",
                success: function (result) {
                    //성공했을 때 함수 인자 값으로 결과 값 나옴
                    database = result;
                    console.log(database)
                    //console.log("result:"+a);
                } //function 끝
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
        el.addEventListener('mouseenter', function(evt) {
            currentId = this.getAttribute('id');
            for(let i=0; i < database.length; i++){
                if(database[i].filename.split('.mp4')[0] === currentId){
                    let pos_x = database[i].metadata.pos.split(',')[0]; // - 0.35 ;
                    let pos_y = database[i].metadata.pos.split(',')[1]; // - 0.04
                    let pos_z_string = database[i].metadata.pos.split(',')[2];
                    let pos_z = Number(pos_z_string);// + 0.02;
                    drawArrow(pos_x, pos_y, pos_z);
                }
            };
            //drawArrow();
            //console.log(this.getAttribute('id')); 
        });
        el.addEventListener('mouseleave', function(evt){
            //removeArrow();
        })
    }
});


// function request_mpd(id) {
//     // TODO mpd and view matching required
//     console.log("id:"+id)
//     return "files/" + id + "/" + id + "_dash.mpd";
// }

function chage_view(element) {
    // var vr_view = document.querySelector("#vr_view");
    var mpd = request_mpd(element.id); // video/v1/v1_dash.mpd
    main_player.attachSource(mpd);
    main_player.initialize();
    console.log('change view');
    if (!video_sphere.getAttribute('visible'))
        video_sphere.setAttribute('visible', true);

    //TODO set rotation
}

function drawArrow(pos_x, pos_y, pos_z){
    console.log("id:"+currentId);
    let selectArrow = document.querySelector('#arrow');
    let rot = -Math.atan(pos_z / pos_x) * 180 / Math.PI;
    console.log('rotation_Y:'+ rot);
    if(currentId == "v3"||currentId == "v5"){
        var rot2 = rot + 180;
        selectArrow.setAttribute('rotation', 0+" "+rot2+" "+30);
    }else{
        selectArrow.setAttribute('rotation', 0+" "+rot+" "+30);
    }
    let show_x = pos_x - 0.35;
    let show_y = pos_y - 0.04;
    let show_z = pos_z + 0.02;
    selectArrow.setAttribute('visible', true);
    selectArrow.setAttribute('position', show_x+" "+show_y+" "+show_z);
}


// function removeArrow(){
//     var selectArrow = document.querySelector("#arrow");
//     selectArrow.setAttribute('visible', false);
// }