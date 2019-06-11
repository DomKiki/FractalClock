/****************** Global variables *****************/

var canvas, center;

var tree, branches, angles,
	time   = { h: 0, m: 0, s: 0 };
	sizes  = [100, 180, 200],
	colors = ["#FF0000", "#66FF00", "#0066FF"];
	shrink = 0.6,
	minLen = 5,
	clockRadius = 250;

/************************* p5 ************************/

function setup() {

	canvas = createCanvas(800, 800);
	center = createVector(width/2, height/2);
	initTree();
	frameRate(5);

}

function draw() {

	background(255);

	drawClock();
	setClockTime();
	updateAngles();

	translate(center.x, center.y);
	for (let i = 0; i < tree.length; i++) {
		push();
			rotate(angles[i]);
			branch(i, sizes[i], colors[i]);
		pop();
	}
}

/************************* Tree **********************/

function initTree() {
	tree = [ new Hand(createVector(width/2, height/2 - 100)),
			 new Hand(createVector(width/2, height/2 - 180)),
			 new Hand(createVector(width/2, height/2 - 200)) ];
}

function branch(index, len, col) {
	
	stroke(color(col));
	noFill();
	strokeWeight(len / 50);

	line(0, 0, 0, -len);
	if (len > minLen) {
		push();
			translate(0, -len);
			for (let i = 0; i < angles.length; i++) {
				let a = angles[i];
				push();
					rotate(a);
					branch(index, len * shrink, colors[i]);
				pop();
			}
		pop();
	}
}

/************************ Clock **********************/

function drawClock() {

	let divis = 12;
	translate(width / 2, height / 2);

	// Circle
	stroke(0);
	strokeWeight(2);
	noFill();
	ellipse(0, 0, clockRadius * 2);

	// Divisions
	noStroke();
	fill(0);
	for (let h = 0; h <= divis; h++) {
		let a = h * (TWO_PI / divis);
		let x = clockRadius * cos(a);
		let y = clockRadius * sin(a);
		let c = createVector(x, y);
		ellipse(c.x, c.y, 10);
	}

	translate(-center.x, -center.y);

}

function setClockTime() {
	let sec = second();
	let min = minute() + sec/60;
	let hr  = hour()   + min/60;
	tree[0].setPosition(hr * 5);
	tree[1].setPosition(min);
	tree[2].setPosition(sec);
}

function updateAngles() {
	let refs   = [ createVector(0, -100), createVector(0, 100) ];
	    angles = [];
	for (let i = 0; i < tree.length; i++) {
		let ref = (tree[i].getDir().x > 0) ? 0 : 1;
		let off = (ref == 1) ? PI : 0;
		angles.push(p5.Vector.sub(tree[i].p2, center).angleBetween(refs[ref]) + off);
	}
}