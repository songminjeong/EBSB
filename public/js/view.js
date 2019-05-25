

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    console.log(keyName);
    // As the user releases the Ctrl key, the key is no longer active,
    // so event.ctrlKey is false.
    // if (keyName === 's') {
    //     main_player.play();
    //     main_player.setAutoPlay(true);
    // }
}, false);

function greeting() {
    console.log(this);
}

AFRAME.registerComponent('main', {
    init: function () {
        greeting.call(this);
    }
});

AFRAME.registerComponent('view', {
    init: function () {
        console.log(this)
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
            }//function끝
        });
    });
}

function make_array() {
    return new Promise(function (resolve, reject) {

    })
}