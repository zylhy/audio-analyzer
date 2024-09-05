const audioEle = document.querySelector('audio');

// const audioEle = new Audio();
// audioEle.src = './test.mp3';
// document.addEventListener('click',()=>{audioEle.play()})
const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');
let isInit = false;
let dataArray, analyser;
let dataScale = 6;

function initCvs() {
    // cvs.width = window.innerWidth * devicePixelRatio;
    // cvs.height = (window.innerHeight / 2) * devicePixelRatio;
    cvs.width = window.innerWidth;
    cvs.height = (window.innerHeight / 2);
}

initCvs();

audioEle.onplay = function () {
    if (isInit) return;
    const audioCtx = new AudioContext();
    // 创建音频源节点
    const source = audioCtx.createMediaElementSource(audioEle);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    // analyser.connect(audioCtx.destination);
    isInit = true;
};


function drawWave(options) {
    const { color, waveNum, amplitudeArr, frequency, offsetY, t } = options
    const waveDis = amplitudeArr[0] + 1.5
    ctx.fillStyle = color;
    ctx.beginPath();
    //  绘制波浪的每个点
    for (let j = 0; j < waveNum; j++) {
        for (let x = j * t; x <= (j + 1) * t; x += 10) {
            const y = amplitudeArr[j] * Math.cos(frequency * x) + offsetY - waveDis - (amplitudeArr[j] - amplitudeArr[0])
            ctx.lineTo(x, y);
        }
    }
    for (let j = waveNum - 1; j > 0; j--) {
        for (let x = j * t; x >= (j - 1) * t; x -= 10) {
            const y = -amplitudeArr[j - 1] * Math.cos(frequency * x) + offsetY + waveDis + (amplitudeArr[j - 1] - amplitudeArr[0])
            ctx.lineTo(x, y);
        }
    }
    // 填充波浪形状
    ctx.closePath();
    ctx.fill();
}


function draw() {
    requestAnimationFrame(draw);
    if (!isInit) return;
    const { width, height } = cvs;
    ctx.clearRect(0, 0, width, height);
    analyser.getByteFrequencyData(dataArray);
    //    const amplitudeArr = [10,23,30,40,50,60,70,50,50,50]
    const waveNum = 10;
    const offsetY = height / 2
    drawWave({
        color: '#fcf2f7',
        waveNum,
        amplitudeArr: dataArray.filter((value, index) => index > 0 && index % 2 === 0).map(value => value / (dataScale * 0.7)),
        frequency: 0.025,
        t: Math.PI * 2 / 0.025,
        offsetY
    })
    drawWave({
        color: '#a9a4c7',
        waveNum,
        amplitudeArr: dataArray.filter((value, index) => index > 0 && index % 3 === 0).map(value => value / (dataScale * 0.8)),
        frequency: 0.02,
        t: Math.PI * 2 / 0.01,
        offsetY
    })
    drawWave({
        color: '#ffbfca',
        waveNum,
        amplitudeArr: dataArray.filter((value, index) => index > 0 && index % 5 === 0).map(value => value / dataScale),
        frequency: 0.03,
        t: Math.PI * 2 / 0.03,
        offsetY
    })
}

draw();
