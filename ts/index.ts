import p5 from 'p5/lib/p5.min'
import con1 from './con1'

const bgColor = '#000000'

let audio: HTMLAudioElement = null
let audioSource: MediaElementAudioSourceNode = null
let spectrumArray = new Uint8Array()
let analyzerNode: AnalyserNode = null
let gainNode: GainNode = null
let bass: BiquadFilterNode = null
let middle: BiquadFilterNode = null
let treble: BiquadFilterNode = null
let bassArray = new Uint8Array()
let middleArray = new Uint8Array()
let trebleArray = new Uint8Array()

const height = 500
const width = 500

const volumeControl = document.getElementById('volume') as HTMLInputElement

volumeControl.addEventListener(
  'input',
  () => {
    gainNode.gain.value = +volumeControl.value
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

async function convertAudioFileToDataUrl(file: Blob): Promise<string> {
  const reader = new FileReader()

  const loadPromise: Promise<string> = new Promise((resolve) => {
    reader.onload = (event) => {
      resolve(event.target.result as string)
    }
  })

  reader.readAsDataURL(file)

  return loadPromise
}

function rBTM() {
  analyzerNode.getByteFrequencyData(spectrumArray)
  analyzerNode.getByteFrequencyData(bassArray)
  analyzerNode.getByteFrequencyData(middleArray)
  analyzerNode.getByteFrequencyData(trebleArray)
  const bass = bassArray[Math.floor((500 * 1024) / 44100)]
  const mid = middleArray[Math.floor((1000 * 1024) / 44100)]
  const treble = trebleArray[Math.floor((2000 * 1024) / 44100)]

  return [bass, treble, mid]
}

const sketch1 = (p: p5) => {
  p.setup = () => {
    p.createCanvas(width, height)
  }

  p.draw = () => {
    p.background(bgColor)
    p.strokeWeight(1)

    if (analyzerNode) {
      const [bass, treble, mid] = rBTM()
      con1(p, width, height, bass, treble, mid)
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(width, height)
  }
}

new p5(sketch1, 'con1')
