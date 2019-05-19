var video = null;
var video_sphere = null;
var socket = null;

var main_player = dashjs.MediaPlayer().create();
main_player.initialize(document.querySelector('#view'));
main_player.setAutoPlay(true);

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
            //     var background = document.querySelector("#background");
            video_sphere = document.querySelector("#vr_view");
            //     background.setAttribute('visible', true);
            //     vr_view.setAttribute('visible', false);
            $.ajax({
                url: '/transfer',                //주소
                dataType: 'json',                  //데이터 형식
                type: 'POST',                      //전송 타입
                data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
                success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                    console.log(result);
                } //function끝
            });

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
    if (!video_sphere.getAttribute('visible'))
        video_sphere.setAttribute('visible', true);

    //TODO set rotation
}

var call = $.ajax({
    url: '/transfer',                //주소
    dataType: 'json',                  //데이터 형식
    type: 'POST',                      //전송 타입
    data: {'msg': $('#msg').val()},      //데이터를 json 형식, 객체형식으로 전송
    success: function (result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
        console.log(result);
    } //function끝
});


