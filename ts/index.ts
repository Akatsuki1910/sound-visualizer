import p5 from 'p5/lib/p5.min'

// let audio;
// let fft;
const bgColor = '#0c0f27'
const bassColor = ['#313e9b', '#1200b3']
const midColor = '#da1500'
const trembleColor = '#728d0d'
let pieces
let radius

let audio = null
let audioSource = null
let intervalId = null
let spectrumArray = new Uint8Array()
let analyzerNode: AnalyserNode = null
let gainNode = null
let bass: BiquadFilterNode = null
let middle: BiquadFilterNode = null
let treble: BiquadFilterNode = null
let bassArray = new Uint8Array()
let middleArray = new Uint8Array()
let trebleArray = new Uint8Array()

const height = 850
const width = 850

const volumeControl = document.getElementById('volume') as HTMLInputElement

volumeControl.addEventListener(
  'input',
  () => {
    gainNode.gain.value = volumeControl.value
  },
  false
)

const fileInput = document.querySelector('#file-input') as HTMLInputElement
fileInput.addEventListener('change', async (event) => {
  const audioContext = new AudioContext()
  analyzerNode = audioContext.createAnalyser()
  gainNode = audioContext.createGain()
  bass = audioContext.createBiquadFilter() //  500 Hz
  middle = audioContext.createBiquadFilter() // 1000 Hz
  treble = audioContext.createBiquadFilter() // 2000 Hz
  bass.type = 'lowshelf'
  middle.type = 'peaking'
  treble.type = 'highshelf'

  if (audio) {
    audio.pause()
    audio.src = ''
  }

  if (audioSource) {
    audioSource.disconnect()
  }

  if (intervalId) {
    clearInterval(intervalId)
  }

  analyzerNode.fftSize = 512 * 2

  const file = fileInput.files[0]
  if (file) {
    spectrumArray = new Uint8Array(analyzerNode.frequencyBinCount)
    bassArray = new Uint8Array(analyzerNode.frequencyBinCount)
    middleArray = new Uint8Array(analyzerNode.frequencyBinCount)
    trebleArray = new Uint8Array(analyzerNode.frequencyBinCount)

    audio = new Audio()
    audio.src = await convertAudioFileToDataUrl(file)

    audioSource = audioContext.createMediaElementSource(audio)
    audioSource.connect(analyzerNode)
    audioSource.connect(gainNode)
    audioSource.connect(bass)
    audioSource.connect(middle)
    audioSource.connect(treble)
    analyzerNode.connect(audioContext.destination)
    gainNode.connect(audioContext.destination)
    bass.connect(audioContext.destination)
    middle.connect(audioContext.destination)
    treble.connect(audioContext.destination)
    audio.play()
  }
})

async function convertAudioFileToDataUrl(file: Blob) {
  const reader = new FileReader()

  const loadPromise = new Promise((resolve) => {
    reader.onload = (event) => {
      resolve(event.target.result)
    }
  })

  reader.readAsDataURL(file)

  return loadPromise
}

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(width, height)
    pieces = 30
    radius = height / 4
  }

  p.draw = () => {
    p.background(bgColor)
    p.strokeWeight(1)

    if (analyzerNode) {
      analyzerNode.getByteFrequencyData(spectrumArray)
      analyzerNode.getByteFrequencyData(bassArray)
      analyzerNode.getByteFrequencyData(middleArray)
      analyzerNode.getByteFrequencyData(trebleArray)
      const bass = bassArray[Math.floor((500 * 1024) / 44100)]
      const treble = trebleArray[Math.floor((2000 * 1024) / 44100)]
      const mid = middleArray[Math.floor((1000 * 1024) / 44100)]

      const mapMid = p.map(mid, 0, 255, -radius, radius)
      const scaleMid = p.map(mid, 0, 255, 1, 1.5)

      const mapTreble = p.map(treble, 0, 255, -radius / 2, radius * 2)
      const scaleTreble = p.map(treble, 0, 255, 0.5, 2)

      const mapbass = p.map(bass, 0, 255, 0, 200)
      const scalebass = p.map(bass, 0, 255, 0, 0.8)

      pieces = 9
      radius = 200

      p.translate(width / 2, height / 2)

      for (let i = 0; i < pieces; i += 1) {
        p.rotate(p.TWO_PI / pieces)

        p.noFill()

        /*----------  BASS  ----------*/
        p.push()
        p.strokeWeight(8)
        p.stroke(bassColor[0])
        p.scale(scalebass + 1)
        p.rotate(-p.frameCount * 0.05)
        p.point(mapbass, radius / 2)
        p.stroke(bassColor[1])
        p.strokeWeight(2.2)
        p.line(200, 200, radius, radius)
        p.pop()

        /*----------  MID  ----------*/
        p.push()
        p.stroke(midColor)
        p.strokeWeight(4)
        p.rotate(-p.frameCount * 0.01)
        p.point(mapMid, radius)
        p.pop()

        /*----------  TREMBLE  ----------*/
        p.push()
        p.stroke(trembleColor)
        p.strokeWeight(4)
        p.scale(scaleTreble)
        p.rotate(p.frameCount * 0.01)
        p.point(-100, radius / 2)
        p.point(100, radius / 2)
        p.pop()
      }
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(width, height)
  }
}

new p5(sketch, 'con1')
