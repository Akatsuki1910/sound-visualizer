import p5 from 'p5/lib/p5.min'

const bassColor = ['#313e9b', '#1200b3']
const midColor = '#da1500'
const trembleColor = '#728d0d'

export default function con2(
  p: p5,
  width: number,
  height: number,
  bass: number,
  treble: number,
  mid: number
) {
  let pieces = 30

  const mapMid = p.map(mid, 0, 255, 10, 20)

  const mapTreble = p.map(treble, 0, 255, 10, 20)

  const mapbass = p.map(bass, 0, 255, 10, 20)

  p.translate(width / 2, height / 2)

  for (let i = 0; i < pieces; i += 1) {
    p.rotate(p.TWO_PI / pieces)

    p.noFill()

    /*----------  BASS  ----------*/
    p.stroke('#0f0')
    polygon(
      p,
      p.cos((p.TWO_PI / 3) * 0) * 40,
      p.sin((p.TWO_PI / 3) * 0) * 40,
      (mapbass + 20) * i,
      7
    )

    /*----------  MID  ----------*/
    p.stroke('#f00')
    polygon(
      p,
      p.cos((p.TWO_PI / 3) * 1) * 40,
      p.sin((p.TWO_PI / 3) * 1) * 40,
      (mapMid + 20) * i,
      7
    )

    /*----------  TREMBLE  ----------*/
    p.stroke('#00f')
    polygon(
      p,
      p.cos((p.TWO_PI / 3) * 2) * 40,
      p.sin((p.TWO_PI / 3) * 2) * 40,
      (mapTreble + 20) * i,
      7
    )
  }
}

function polygon(p, x, y, radius, npoints) {
  var angle = p.TWO_PI / npoints
  p.beginShape()
  for (var a = 0; a < p.TWO_PI; a += angle) {
    var sx = x + p.cos(a) * radius
    var sy = y + p.sin(a) * radius
    p.vertex(sx, sy)
  }
  p.endShape(p.CLOSE)
}
