// const video = document.getElementById('video')
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  // faceapi.nets.ageGenderNet.loadFromUri('/models')
])
let isDetection;
var outputImageData;
async function uploadImage() {
 
  // const imgFile = document.getElementById('myFileUpload').files[0]
  // document.getElementById('myImg').src = img.src
  const myimg = document.getElementById('face-image')
  const canvas = faceapi.createCanvasFromMedia(myimg)
  document.getElementById("upload-wrap").appendChild(canvas);
  document.getElementById("upload-wrap").appendChild(myimg);
  const displaySize = { width: myimg.clientWidth, height: myimg.clientHeight }
  faceapi.matchDimensions(canvas, displaySize)
  const detections = await faceapi.detectAllFaces(myimg, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()//.withAgeAndGender()

  // get extract face
  if (detections.length > 0) {
    isDetection = true;
    // await extractFaceFromBox(myimg, detections[0].detection.box)
    let outputImage = document.getElementById('faceImg')
    const box = detections[0].detection.box;
    const regionsToExtract = [
      new faceapi.Rect(box.x, box.y, box.width, box.height)// box.x , box.y - 20 , box.width * 3 , box.width * 3)
    ]
    let faceImages = await faceapi.extractFaces(myimg, regionsToExtract)    
    
    if (faceImages.length == 0) {
      isDetection = false;
      console.log('Face not found')
    }
    else {
      isDetection = true;
      outputImageData = faceImages[0]
      faceImages.forEach(cnv => {
        var cnvURI = cnv.toDataURL("image/jpeg");
        var tempImage = new Image();
        tempImage.src = cnvURI;
        tempImage.onload = function () {
          var canvas = document.createElement('canvas');
          var canvasContext = canvas.getContext("2d");
          var width = 400;
          var height = 400;
          canvas.width = width;
          canvas.height = height;
          canvasContext.drawImage(this, 0, 0, width, height);
          var dataURI = canvas.toDataURL("image/jpeg");
          outputImage.src = dataURI;
          // console.log("aaa" + outputImage.src)
        }
      })
    }
  } else {
    isDetection = false;
  }
  const resizedDetections = faceapi.resizeResults(detections, displaySize)
  // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  faceapi.draw.drawDetections(canvas, resizedDetections)
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  setTimeout(function () {
    $('canvas').css("visibility", "hidden");
  }, 1000);
}

// function SetoutputImage() {
//   var cnvURI = cnv.toDataURL("image/jpeg");
//   var tempImage = new Image();
//   tempImage.src = cnvURI;
//   tempImage.onload = function () {
//     var canvas = document.createElement('canvas');
//     var canvasContext = canvas.getContext("2d");
//     var width = 400;
//     var height = 400;
//     canvas.width = width;
//     canvas.height = height;
//     canvasContext.drawImage(this, 0, 0, width, height);
//     var dataURI = canvas.toDataURL("image/jpeg");
//     outputImage.src = dataURI;
//     outputImageData = dataURI;
//     console.log("aaaaa")
//   }
// }

async function extractFaceFromBox(inputImage, box) {
  let outputImage = document.getElementById('faceImg')
  const regionsToExtract = [
    new faceapi.Rect(box.x, box.y - 5, box.width, box.height)// box.x , box.y - 20 , box.width * 3 , box.width * 3)
  ]
  let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract)
  if (faceImages.length == 0) {
    console.log('Face not found')
  }
  else {
    faceImages.forEach(cnv => {
      var cnvURI = cnv.toDataURL("image/jpeg");
      var tempImage = new Image();
      tempImage.src = cnvURI;
      tempImage.onload = function () {
        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext("2d");
        var width = 400;
        var height = 400;
        canvas.width = width;
        canvas.height = height;
        canvasContext.drawImage(this, 0, 0, width, height);
        var dataURI = canvas.toDataURL("image/jpeg");
        outputImage.src = dataURI;
        outputImageData = dataURI;
        console.log("aa" + outputImageData)
      }
    })
  }
}
