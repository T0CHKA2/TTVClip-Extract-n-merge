const fluent_ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const open = require("open")


// Выбираем все клипы в /downloaded
let fileContent = fs.readFileSync("clips.txt", "utf8");
let arr = fileContent.split("\r\n");
let videoNames = [];
fs.readdirSync("./downloaded").forEach(file => {
    videoNames.push(`./downloaded/${file}`);
});


// Скачиваем наши клипы через ссылки Production
for (i = 0; i < arr.length; i ++) {
  let clip = arr[i];
  open(clip);
}


// Конвертируем под одни настройки
for (i = 0; i < arr.length - 1; i++) {
    fluent_ffmpeg({ source: `${videoNames[i]}` })
        .withAspect('16:9')
        .withSize('1280x720')
        .withFps(30)
        .videoBitrate('2048k')
        .videoCodec('mpeg4')
        .saveToFile(`converted/conv${i}.avi`);
}


// Создаём видео из клипов
function awaitVideoMerge() {
    var mergedVideo = fluent_ffmpeg();
    let convVideo = [];

    fs.readdirSync("./converted").forEach(file => {
        convVideo.push(`./converted/${file}`);
    });

    convVideo.forEach(function(videoName){
        mergedVideo = mergedVideo.addInput(videoName);
    });

    mergedVideo.mergeToFile('./mergedVideo.mp4', './tmp/')
    .on('error', function(err) {
        console.log('Error ' + err.message);
    })
    .on('end', function() {
        console.log('Finished!');
    });
}


// Даём время на скачивание клипов и конвертацию, 5 минут
setTimeout(awaitVideoMerge, 300000, 'funky');
process.exit(0)