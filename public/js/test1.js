var video = document.getElementById('view');
var video_sphere = document.getElementById('vr_view');
var socket = null;
var metadata_list = null;

var main_player = dashjs.MediaPlayer().create();

AFRAME.registerComponent('view', {
    init: function () {
        let el = this.el;
        el.addEventListener('click', function (evt) {
            chage_view(el);
        });
    }
});

AFRAME.registerComponent('main', {

        init: function () {

            main_player.initialize(document.querySelector("#view"), 'video/v2/v2_dash.mpd', true);

            console.log(main_player.getSource());
            console.log(video_sphere);
            console.log(video);
            // $.ajax({
            //     url: '/transfer',                //주소
            //     dataType: 'json',                  //데이터 형식
            //     type: 'POST',                      //전송 타입
            //     data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
            //     success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            //         console.log(result);
            //     } // function끝
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
    var mpd = request_mpd(element.id); // video/v1/v1_dash.mpd
    main_player.attachSource(mpd);
    main_player.initialize();
    console.log('change view');

    //TODO set rotation
}

