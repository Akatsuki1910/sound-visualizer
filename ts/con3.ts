import p5 from 'p5/lib/p5.min'

export default function con3(
  p: p5,
  width: number,
  height: number,
  bass: number,
  treble: number,
  mid: number,
  sa: Uint8Array
) {
  p.translate(width / 2, height / 2)

  p.noFill()
  for (let i = 0; i < sa.length; i += 10) {
    const l = i / 10
    p.rotate((p.TWO_PI / sa.length) * 10)

    p.stroke('#fff')
    var amp = sa[i]
    var y = p.map(amp, 0, 255, 10, 20)
    polygon(p, y + l / 2, y - l * 2, y * l, 7)
  }
}

function polygon(p, x, y, radius, npoints) {
  var angle = p.TWO_PI / npoints
  p.beginShape()
  for (var a = 0; a < p.TWO_PI; a += angle) {
    var sx = p.cos(a) * radius
    var sy = p.sin(a) * radius
    p.vertex(sx, sy)
  }
  p.endShape(p.CLOSE)
}
