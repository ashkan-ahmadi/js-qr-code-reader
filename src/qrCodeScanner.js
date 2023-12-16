const QRCode = window.qrcode

const video = document.createElement('video')
const canvasElement = document.getElementById('qr-canvas')
const canvas = canvasElement.getContext('2d')

const btnScanQR = document.getElementById('btn-scan-qr')

let scanning = false // initial state

QRCode.callback = res => {
  if (res) {
    alert(res)
    scanning = false

    video.srcObject.getTracks().forEach(track => {
      track.stop()
    })

    canvasElement.hidden = true
    btnScanQR.hidden = false
  }
}

document.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
    scanning = true
    btnScanQR.hidden = true
    canvasElement.hidden = false
    video.setAttribute('playsinline', true) // required to tell iOS safari we don't want fullscreen
    video.srcObject = stream
    video.play()
    tick()
    scan()
  })
})

function tick() {
  canvasElement.height = video.videoHeight
  canvasElement.width = video.videoWidth
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height)

  scanning && requestAnimationFrame(tick)
}

function scan() {
  try {
    QRCode.decode()
  } catch (e) {
    setTimeout(scan, 300)
  }
}
