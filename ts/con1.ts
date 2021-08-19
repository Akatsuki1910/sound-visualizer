import p5 from 'p5/lib/p5.min'

const bassColor = ['#313e9b', '#1200b3']
const midColor = '#da1500'
const trembleColor = '#728d0d'

export default function con1(
  p: p5,
  width: number,
  height: number,
  bass: number,
  treble: number,
  mid: number
) {
  let pieces = 30
  let radius = height / 4

  const mapMid = p.map(mid, 0, 255, -radius, radius)
  const scaleMid = p.map(mid, 0, 255, 1, 1.5)

  const mapTreble = p.map(treble, 0, 255, -radius / 2, radius * 2)
  const scaleTreble = p.map(treble, 0, 255, 0.5, 2)

  const mapbass = p.map(bass, 0, 255, 0, 200)
  const scalebass = p.map(bass, 0, 255, 0, 0.8)

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
