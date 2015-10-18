var w = 500;
var h = 500;

var l = 100;
var lShift = 0.3;
var lMin = l - l*lShift;
var lMax = l + l*lShift;

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var threangles= [];

var threangle = {
	points: [],
	sides: [],
	bg: "rgba(65, 240, 240, 0.5)",
	create: function(){
	this.center = [w/2, h/2],
		this.sides[0] = getRandomInt(lMin, lMax);
		this.sides[1] = getRandomInt(lMin, lMax);
		this.sides[2] = getRandomInt(lMin, lMax);


		this.points[0] = [getRandomInt(this.center[0] - this.sides[0] / 2, this.center[0] + this.sides[0] / 2),
						  getRandomInt(this.center[1] - this.sides[0] / 2, this.center[1] + this.sides[0] / 2)];

		this.points[1] = [];
		this.points[1][0] = getRandomInt(this.points[0][0] - l / 2, this.points[0][0] + l / 2);

		if (this.points[0][1] < this.center[1]) {
			this.points[1][1] = this.points[0][1] + Math.sqrt(Math.pow(this.sides[0], 2) - Math.pow(this.points[0][0] - this.points[1][0], 2));
		} else {
			this.points[1][1] = this.points[0][1] - Math.sqrt(Math.pow(this.sides[0], 2) - Math.pow(this.points[0][0] - this.points[1][0], 2));
		}

		this.points[2] = therdPoint(this);

		this.center = centerNormalize(this);

	},

	draw: function() {
		this.create();
		drawObject(this);
	}

};

function centerNormalize(obj) {
	return [(obj.points[0][0] + obj.points[1][0] +obj.points[2][0]) / 3, (obj.points[0][1] + obj.points[1][1] + obj.points[2][1]) / 3];
}

function therdPoint( obj) {

	angleR = Math.acos((Math.pow(obj.sides[1], 2) + Math.pow(obj.sides[2], 2) - Math.pow(obj.sides[0], 2)) / (2 * obj.sides[1] * obj.sides[2]));

	angle = Math.atan((obj.points[1][1] - obj.points[0][1]) / (obj.points[1][0] - obj.points[0][0]));

	ww = obj.points[0][0] - (1 / (Math.tan(angle))*(obj.points[0][1] - obj.center[1]));

	if (ww > obj.center[0]) {wCenter = 0;}
	else {wCenter = 1;}

	if((obj.points[0][0] > obj.points[1][0]) && (obj.points[0][1] >= obj.points[1][1])) {
		if (wCenter == 0) {angleN = angle - Math.PI - angleR;}
		else {angleN = -(Math.PI - (angleR + angle));}
	}

	if((obj.points[0][0] > obj.points[1][0]) && (obj.points[0][1] < obj.points[1][1])) {
		if (wCenter == 0) {angleN = -Math.PI + (angle + angleR);}
		else {angleN = (Math.PI/2 - angleR) - (-Math.PI/2 - angle);}
	}

	if((obj.points[0][0] < obj.points[1][0]) && (obj.points[0][1] >= obj.points[1][1])) {

		if (wCenter ==0) {angleN = angle - angleR;}
		else {angleN = angle + angleR;}
	}

	if((obj.points[0][0] <= obj.points[1][0]) && (obj.points[0][1] < obj.points[1][1])) {
		if (wCenter ==0) {angleN = -Math.PI - (Math.PI/2 -(angleR - (Math.PI/2 - angle)));}
		else {angleN = angle - angleR;}
	}

	xN = obj.points[0][0] + Math.cos(angleN) * obj.sides[2];
	yN = obj.points[0][1] + Math.sin(angleN) * obj.sides[2];

	return [xN, yN];
}


var threangleProto = {
	bg: "rgba(255, 255, 255, 0.3)",

	constructor: function(a, b){
		this.points = [],
		this.sides = [],

		this.sides[0] = Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
		this.sides[1] = getRandomInt(lMin, lMax);
		this.sides[2] = getRandomInt(lMin, lMax);

		this.points[0] = a;
		this.points[1] = b;

		this.center = [
			(this.points[0][0] + this.points[1][0]) / 2 + ((this.points[0][0] + this.points[1][0]) / 2 - threangle.center[0]),
			(this.points[0][1] + this.points[1][1]) / 2 + ((this.points[0][1] + this.points[1][1]) / 2 - threangle.center[1])
		];
		

		this.points[2] = therdPoint(this);
		this.center = centerNormalize(this);

		return this;

	},
	draw: function() {
		drawObject(this);
	},

};


function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

var drawObject = function(obj) {


	ctx.fillStyle = obj.bg;
	ctx.strokeStyle = "transparent";
	ctx.lineWidth = 1;
	ctx.beginPath();

	obj.points.forEach(function(item, i, arr) {
		ctx.lineTo(item[0], item[1]);
	});

	ctx.fill();
	ctx.closePath();

	ctx.fillStyle = "#fff";
	ctx.fillRect(obj.center[0]-1,obj.center[1]-1, 2, 2);
	ctx.fillStyle = "red";
	ctx.fillRect(obj.points[0][0]-1,obj.points[0][1]-1, 2, 2);
	ctx.fillStyle = "yellow";
	ctx.fillRect(obj.points[1][0]-1,obj.points[1][1]-1, 2, 2);
	ctx.fillStyle = "#00FF06";  
	ctx.fillRect(obj.points[2][0]-1,obj.points[2][1]-1, 2, 2);
	// ctx.fillStyle = "#18D1FF";
	// ctx.fillRect(ww-1, obj.center[1]-1, 2, 2);


}


function draw() {
	threangle.draw();

	// console.log(threangle);

	threangles = [];

	threangles.push(Object.create(threangleProto).constructor(threangle.points[0], threangle.points[1]));
	threangles.push(Object.create(threangleProto).constructor(threangle.points[1], threangle.points[2]));
	threangles.push(Object.create(threangleProto).constructor(threangle.points[2], threangle.points[0]));


	// console.log(threangles[0]);
	// console.log(threangles[1]);
	// console.log(threangles[2]);

	threangles[0].draw();
	threangles[1].draw();
	threangles[2].draw();

};

init();

draw();
