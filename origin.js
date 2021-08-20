var song;
var fft;
var button;
var mic;

var volHistory = [];
var w;

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }

}

function preload() {
  song = loadSound('music.mp3');
}

function setup() {
  createCanvas(600, 400);
  angleMode(DEGREES);
  song.play();
  button = createButton('toggle');
  button.mousePressed(toggleSong);
  fft = new p5.FFT(0.5, 64);
  w = width / 64;

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(0);
  var spectrum = fft.analyze();
  stroke(255);

  noFill();
  translate(width/2, height/2)
  for (i = 0; i < spectrum.length; i++) {
    rotate(TWO_PI / spectrum.length)
    var amp = spectrum[i];
    var y = map(amp, 0, 256, 200, 300);
    strokeWeight(3);
    polygon(y + i / 2, y - i * 2, mouseX * i, 7);
  }
}

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}