var w = 500;
var h = 500;
var helpC = 0;

var l = 100;
var lShift = 0.3;
var lMin = l - l*lShift;
var lMax = l + l*lShift;

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var sideProto = {
	lgth: 0,
	state: true,
	points: [],
	parentA: 0,
	constructor: function(lgth, state, points, parentA){
		this.lgth = lgth;
		this.state = state;
		this.points = points;
		this.parentA = parentA;
		return this;
	}
}

var allSides = [];
var closedSides = [];

var threangles = [];

threangleStart = {
	points: [],
	sides: [],
	bg: "rgba(65, 240, 240, 0.5)",
	constructor: function(){
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

		allSides.push(Object.create(sideProto).constructor(this.sides[0], true, [this.points[0], this.points[1]], this));
		allSides.push(Object.create(sideProto).constructor(this.sides[1], true, [this.points[1], this.points[2]], this));
		allSides.push(Object.create(sideProto).constructor(this.sides[2], true, [this.points[2], this.points[0]], this));

		return this;

	},

	draw: function() {
		drawObject(this);
	}

};

function centerNormalize(obj) {
	return [(obj.points[0][0] + obj.points[1][0] +obj.points[2][0]) / 3, (obj.points[0][1] + obj.points[1][1] + obj.points[2][1]) / 3];
}

function therdPoint(obj) {

	var angleR = Math.acos((Math.pow(obj.sides[2], 2) + Math.pow(obj.sides[0], 2) - Math.pow(obj.sides[1], 2)) / (2 * obj.sides[2] * obj.sides[0]));


	var angle = Math.atan((obj.points[1][1] - obj.points[0][1]) / (obj.points[1][0] - obj.points[0][0]));
	var angleN;

	if ((obj.points[1][0] - obj.points[0][0]) < 0) { angle = Math.PI + angle; }
	
	ww = obj.points[0][0] - (1 / (Math.tan(angle))*(obj.points[0][1] - obj.center[1]));

	if (ww > obj.center[0]) {wCenter = 0;}
	else {wCenter = 1;}

	if((obj.points[0][0] > obj.points[1][0]) && (obj.points[0][1] >= obj.points[1][1])) {
		if (wCenter == 0) {angleN = angle - angleR;}
		else {angleN = angle + angleR;}
	}

	if((obj.points[0][0] > obj.points[1][0]) && (obj.points[0][1] < obj.points[1][1])) {
		if (wCenter == 0) {angleN = angle + angleR;}
		else {angleN = angle - angleR;}
	}

	if((obj.points[0][0] < obj.points[1][0]) && (obj.points[0][1] >= obj.points[1][1])) {
		if (wCenter == 0) {angleN = angle - angleR;}
		else {angleN = angle + angleR;}
	}

	if((obj.points[0][0] <= obj.points[1][0]) && (obj.points[0][1] < obj.points[1][1])) {
		if (wCenter == 0) {angleN = angle + angleR;}
		else {angleN = angle - angleR;}
	}

	var a = Math.cos(angleN);
	var b = Math.sin(angleN);

	var xN = obj.points[0][0] + a * obj.sides[2];
	var yN = obj.points[0][1] + b * obj.sides[2];

	return [xN, yN];
}

function sideLgth(a, b) {
	return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
}


var threangleProto = {
	points: [],
	sides: [],

	constructor: function(side){

		this.bg = "rgba(255, 255, 255, " + (0.1+(++helpC)/10) + ")";

		function nextSide(obj) {
			// console.log(allSides.indexOf(obj));
			if (allSides.indexOf(obj) == allSides.length-1) {return 0;}
			else {return allSides.indexOf(obj)+1;}
		}


		var pointA = side.points[0];
		var pointB = side.points[1];
		var pointC = allSides[nextSide(side)].points[1];



		var sideA = sideLgth(pointC, pointB);
		var sideB = sideLgth(pointA, pointC);
		var sideC = sideLgth(pointA, pointB);

		var angleB = Math.acos((Math.pow(sideC, 2) + Math.pow(sideA, 2) - Math.pow(sideB, 2)) / (2 * sideA * sideC));
		if (allSides[nextSide(side)].parentA !== side.parentA) {
			// console.log("equal");
			console.log("angleB = "+angleB*180/Math.PI);
		}



		this.sides[0] = sideLgth(side.points[0], side.points[1]);
		// this.sides[0] = Math.sqrt(Math.pow((side.points[0][0] - side.points[1][0]), 2) + Math.pow((side.points[0][1] - side.points[1][1]), 2));
		this.sides[1] = getRandomInt(lMin, lMax);
		this.sides[2] = getRandomInt(lMin, lMax);

		this.points[0] = side.points[0];
		this.points[1] = side.points[1];

		this.center = [
			(this.points[0][0] + this.points[1][0]) / 2 + ((this.points[0][0] + this.points[1][0]) / 2 - side.parentA.center[0]),
			(this.points[0][1] + this.points[1][1]) / 2 + ((this.points[0][1] + this.points[1][1]) / 2 - side.parentA.center[1])
		];
		
		this.points[2] = therdPoint(this);
		this.center = centerNormalize(this);

		var a =Object.create(sideProto).constructor(this.sides[2], true, [this.points[0], this.points[2]], this);
		var b = Object.create(sideProto).constructor(this.sides[1], true, [this.points[2], this.points[1]], this);

		allSides.splice(allSides.indexOf(side), 1, a, b);



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

	ctx.fillStyle = "#000";
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
	threangles.push(Object.create(threangleStart).constructor());
	threangles[0].draw();

	// console.log(threangle);



	// threangles.push(Object.create(threangleProto).constructor(threangle.points[0], threangle.points[1]));
	// threangles.push(Object.create(threangleProto).constructor(threangle.points[1], threangle.points[2]));
	// threangles.push(Object.create(threangleProto).constructor(threangle.points[2], threangle.points[0]));

	// console.log(threangles[0]);
	// console.log(threangles[1]);
	// console.log(threangles[2]);

	// threangles[0].draw();
	// threangles[1].draw();
	// threangles[2].draw();

		console.log(allSides);
	// setTimeout(function(){


		var c = allSides.slice(0); 
		console.log(c);

		for (var i = 0; i < c.length; i++) {
			if (allSides[i].state = true) {
				threangles.push(Object.create(threangleProto).constructor(c[i]));
				threangles[i+1].draw();
			}
			
		};
		console.log(allSides);
	console.log(threangles);
	// }, 1000);
	var c = allSides.slice(0); 
	console.log(c);

	tc = threangles.length;

	for (var i = 0; i < c.length; i++) {
		if (allSides[i].state = true) {
			threangles.push(Object.create(threangleProto).constructor(c[i]));
			threangles[tc+i].draw();
		}
		
	};
	console.log(threangles);
	console.log(allSides);

};

init();

draw();
