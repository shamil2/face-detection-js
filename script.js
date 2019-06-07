const video = document.getElementById('video')
const imgUrl = './photos/shamil.jpg'
const img =  faceapi.fetchImage(imgUrl)
var descriptors;
var faceMatcher;


const labels = ['shamil']
//const imgUrl = `./photos/${label}.jpg `
async function recupImage(label) {
  console.log ("Loadinf image of " +label)
  return faceapi.fetchImage(`./photos/${label}.jpg `);
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),

]).then(myfunction).then(startVideo)

 async function myfunction() {
//const labeledFaceDescriptors = await Promise.all(
  labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
   // const imgUrl = `./photos/${label}.jpg `
    // const img = await faceapi.fetchImage(imgUrl)
    const img =await recupImage(label);
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingleFace(img,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
    
    if (!fullFaceDescription) {
      throw new Error(`no faces detected for ${label}`)
    }
    
    const faceDescriptors = [fullFaceDescription.descriptor]
    descriptors = new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
   faceMatcher = new faceapi.FaceMatcher(descriptors)
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

    if (resizedDetections.length > 0) {
      resizedDetections.forEach(fd => {
        const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
        const text = bestMatch.toString()
        fd.name = text
      
        // see DrawTextField below
      //   const drawOptions = {
      //     anchorPosition: 'TOP_LEFT',
      //     backgroundColor: 'rgba(0, 0, 0, 0.5)'
      //   }
      //   const drawBox = new faceapi.draw.DrawTextField(text,anchor, drawOptions)
      // drawBox.draw(canvas)
      })
        }

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    faceapi.draw.drawAge(canvas, resizedDetections)
    faceapi.draw.drawGender(canvas, resizedDetections)
    faceapi.draw.drawName(canvas, resizedDetections)
    //faceapi.draw.drawGender(canvas, resizedDetections)



  }, 200)
})