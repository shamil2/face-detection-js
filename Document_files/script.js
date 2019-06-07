const video = document.getElementById('video')
const imgUrl = ('./photos/shamil.jpg')
const img =  faceapi.fetchImage(imgUrl)

const labels = ['shamil']
//const imgUrl = `./photos/${label}.jpg `

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),

]).then(myfunction).then(startVideo).

 function myfunction() {
//const labeledFaceDescriptors = await Promise.all(
  labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
   // const imgUrl = `./photos/${label}.jpg `
    const img = await faceapi.fetchImage(imgUrl)
    console.log(img)
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingleFace(img,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
    
    if (!fullFaceDescription) {
      throw new Error(`no faces detected for ${label}`)
    }
    
    const faceDescriptors = [fullFaceDescription.descriptor]
    console.log(new faceapi.LabeledFaceDescriptors(label, faceDescriptors))
    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
  })
//)
}

function startVideo() {

  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    faceapi.draw.drawAge(canvas, resizedDetections)
    faceapi.draw.drawGender(canvas, resizedDetections)
    if (detections.length > 0) {


detections.forEach(fd => {
  console.log(fd);
})

  }

  }, 200)
})