var video = document.getElementById("view");
var video_sphere = document.getElementById("vr_view");

var view_entity = document.createElement('a-entity');
view_entity.setAttribute('id', 'view_sphere2');
var main_player = dashjs.MediaPlayer().create();

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

AFRAME.registerComponent('view', {
    init: function () {
        var el = this.el;
        el.addEventListener('click', function (evt) {
            chage_view(el);
        });
    }
});

AFRAME.registerComponent('main', {

        init: function () {
            main_player.initialize(document.querySelector('#view'), 'video/v2/v2_dash.mpd', true);
            // createEntity();
            // $.ajax({
            //     url: '/transfer',                //주소
            //     dataType: 'json',                  //데이터 형식
            //     type: 'POST',                      //전송 타입
            //     data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
            //     success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            //         console.log(result);
            //     } //function끝
            // });

        }
    }
);


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
    console.log(element.getAttribute('position'));
    // document.querySelector('#camera').setAttribute('position', element.getAttribute('position'));

    //TODO set rotation
}


