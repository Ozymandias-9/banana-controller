var video = document.getElementById('video');
var canvas = document.getElementById('canvas');

var cameraHeight = 720;
var cameraWidth = 720;

var yellow = {r: 255, g: 255, b: 0};

var acceptableDistance = 190;

function showCanva() {

    var options = {
        audios: false,
        video: {
            width: 720,
            height: 720,
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(options)
        .then(function (stream) {
            video.srcObject = stream;
            processCamera();
        })
        .catch(function (err) {
            console.log(`Ups, hubo un error... ${err}`);
        })
    }
    else {
        console.log("No existe la función \"getUserMedia\"")
    }
}

function processCamera() {
    var ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, cameraWidth, cameraHeight, 0, 0, canvas.width, canvas.height);

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imgData.data;

    // var yellowestPx = null;
    // var lowestDistance = null;

    var sumaX = 0;
    var sumaY = 0;
    var cuenta = 0;

    for (var p = 0; p < pixels.length; p+=4) {
        var red = pixels[p];
        var green = pixels[p + 1];
        var blue = pixels[p + 2];
        var alpha= pixels[p + 3];

        var distance = Math.sqrt(
            Math.pow(yellow.r-red, 2) + 
            Math.pow(yellow.g-green, 2) +
            Math.pow(yellow.b+blue, 2)
        )

        if (distance < acceptableDistance) {
            pixels[p] = 255;
            pixels[p + 1] = 0;
            pixels[p + 2] = 0;

            cuenta++;

            var x = (p / 4) % canvas.width;
            var y = Math.floor(p / 4 / canvas.width);

            sumaX += x;
            sumaY += y;
            cuenta++;
        }

        // if (lowestDistance == null || distance < lowestDistance) {
        //     lowestDistance = distance;

        //     var x = (p / 4) % canvas.width;
        //     var y = Math.floor(p / 4 / canvas.width);

        //     yellowestPx = { x, y };
        // }
    }

    ctx.putImageData(imgData, 0, 0);

    if (cuenta > 0) {
        ctx.fillStyle = "#00f";
        ctx.beginPath();
        ctx.arc(sumaX/cuenta, sumaY/cuenta, 10, 0, 2*Math.PI);
		ctx.fill();
    }

    setTimeout(processCamera, 20);
}