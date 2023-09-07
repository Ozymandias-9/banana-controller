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

    // var sumaX = 0;
    // var sumaY = 0;
    // var cuenta = 0;

    var bananas = [];

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
            // pixels[p] = 255;
            // pixels[p + 1] = 0;
            // pixels[p + 2] = 0;

            // cuenta++;

            var x = (p / 4) % canvas.width;
            var y = Math.floor(p / 4 / canvas.width);

            if (bananas.length == 0) {
                var banana = new Banana(x, y);
                bananas.push(banana);
            } else {
                var found = false;
                for (var pl = 0; pl < bananas.length; pl++) {
                    if (bananas[pl].isNear(x, y)) {
                        bananas[pl].addPixel(x, y);

                        found = true;

                        break;
                    }
                }

                if (!found) {
                    var banana = new Banana(x, y);

                    bananas.push(banana);
                }
            }

            // sumaX += x;
            // sumaY += y;
            // cuenta++;
        } else {

        }

        // if (lowestDistance == null || distance < lowestDistance) {
        //     lowestDistance = distance;

        //     var x = (p / 4) % canvas.width;
        //     var y = Math.floor(p / 4 / canvas.width);

        //     yellowestPx = { x, y };
        // }
    }

    ctx.putImageData(imgData, 0, 0);

    bananas = joinBananas(bananas);

    for (var pl = 0; pl < bananas.length; pl++) {
        var width = bananas[pl].maxX - bananas[pl].minX;
        var height = bananas[pl].maxY - bananas[pl].minY;
        var area = width * height;

        if (area > 1500) {
            bananas[pl].draw(ctx);
        }
    }

    console.log(bananas);

    // if (cuenta > 0) {
    //     ctx.fillStyle = "#00f";
    //     ctx.beginPath();
    //     ctx.arc(sumaX/cuenta, sumaY/cuenta, 10, 0, 2*Math.PI);
	// 	ctx.fill();
    // }

    setTimeout(processCamera, 20);
}

function joinBananas(bananas) {
    var exit = false;

    for (var p1 = 0; p1< bananas.length; p1++) {
        for (var p2 = 0; p2< bananas.length; p2++) {
            if (p1 == p2) continue

            var banana1 = bananas[p1];
            var banana2 = bananas[p2];

            var bananasIntersect = banana1.minX < banana2.maxX &&
                banana1.maxX && banana2.minX &&
                banana1.minY && banana2.maxY &&
                banana1.maxY && banana2.minY;
            
            if (bananasIntersect) {
                for (var p = 0 ; p < banana2.pixels.length; p++) {
                    banana1.addPixel(banana2.pixels[p].x, banana2.pixels[p].y);
                }

                bananas.splice(p2, 1);
                exit = true;
                break;
            }
        }

        if (exit) {
            break;
        }
    }

    if (exit) {
        return joinBananas(bananas);
    } else {
        return bananas;
    }
}