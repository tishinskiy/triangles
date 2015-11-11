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

var angleProto = {
	value: 0,
	parent: 0,
	constructor: function(value, parent) {
		this.value = value;
		this.parent = parent;
		return this;
	}
}

var pointProto = {
	x: 0,
	y: 0,
	angles: [],
	parentA: 0,
	constructor: function(xy, angles) {
		this.x = xy[0];
		this.y = xy[1];
		this.angles = angles;
		return this;
	}
}

var allSides = [];
var allPoints = [];
var closedSides = [];

var threangles = [];

threangleStart = {

	bg: "rgba(65, 240, 240, 0.5)",
	constructor: function(){

		this.center = [w/2, h/2];
		this.points = [];
		this.sides = [];

		var sideA = this.sides[0] = getRandomInt(lMin, lMax);
		var sideB = this.sides[1] = getRandomInt(lMin, lMax);
		var sideC = this.sides[2] = getRandomInt(lMin, lMax);

		// var sideA = this.sides[0] = 60;
		// var sideB = this.sides[1] = 80;
		// var sideC = this.sides[2] = 100;

		var angleA = angleXvalue(sideB, sideA, sideC);//60
		var angleB = angleXvalue(sideC, sideB, sideA);//90
		var angleC = angleXvalue(sideA, sideB, sideC); //30

		// console.log(angleA);
		// console.log(angleB);
		// console.log(angleC);


		this.points[0] = [getRandomInt(this.center[0] - sideA / 2, this.center[0] + sideA / 2), getRandomInt(this.center[1] - sideA / 2, this.center[1] + sideA / 2)];

		this.points[1] = [];
		this.points[1][0] = getRandomInt(this.points[0][0] - l / 2, this.points[0][0] + l / 2);

		if (this.points[0][1] < this.center[1]) {
			this.points[1][1] = this.points[0][1] + Math.sqrt(Math.pow(sideA, 2) - Math.pow(this.points[0][0] - this.points[1][0], 2));
		} else {
			this.points[1][1] = this.points[0][1] - Math.sqrt(Math.pow(sideA, 2) - Math.pow(this.points[0][0] - this.points[1][0], 2));
		}

		this.points[2] = therdPoint(this);

		this.center = centerNormalize(this);

		var pointA = Object.create(pointProto).constructor(this.points[0], []);
		var pointB = Object.create(pointProto).constructor(this.points[1], []);
		var pointC = Object.create(pointProto).constructor(this.points[2], []);

		allPoints.push(this.points[0] = pointA);
		allPoints.push(this.points[1] = pointB);
		allPoints.push(this.points[2] = pointC);

		pointA.angles.push(Object.create(angleProto).constructor(angleA, this));
		pointB.angles.push(Object.create(angleProto).constructor(angleB, this));
		pointC.angles.push(Object.create(angleProto).constructor(angleC, this));
		
		allSides.push(this.sides[0] = Object.create(sideProto).constructor(sideC, true, [pointA, pointB], this));
		allSides.push(this.sides[1] = Object.create(sideProto).constructor(sideB, true, [pointC, pointA], this));
		allSides.push(this.sides[2] = Object.create(sideProto).constructor(sideA, true, [pointC, pointB], this));

		// this.sides[2].points = pointC;

		this.draw();

		return this;

	},

	draw: function() {
		drawObject(this);
	}

};



var threangleProto = {

	constructor: function(side) {
		this.bg = "rgba(255, 255, 255, " + (0.05+(++helpC)/20) + ")";

		this.points = [];
		this.sides = [];

		var angleSum = 0;

		side.points[0].angles.forEach(function(item, i, arr) {
			angleSum += item.value;
			
		});

		var freeAngle = 2*Math.PI - angleSum;

		function nextSide(obj) {
			if (allSides.indexOf(obj) == allSides.length-1) {return 0;}
			else {return allSides.indexOf(obj)+1;}
		}

		var sideA = this.sides[0] = side.lgth;
		var sideB = this.sides[1] = getRandomInt(lMin, lMax);
		var sideC = this.sides[2] = getRandomInt(lMin, lMax);

		this.points[0] = [side.points[0].x, side.points[0].y];
		this.points[1] = [side.points[1].x, side.points[1].y];

		this.center = [
			(this.points[0][0] + this.points[1][0]) / 2 + ((this.points[0][0] + this.points[1][0]) / 2 - side.parentA.center[0]),
			(this.points[0][1] + this.points[1][1]) / 2 + ((this.points[0][1] + this.points[1][1]) / 2 - side.parentA.center[1])
		];
		
		this.points[2] = therdPoint(this);

		var angleA = angleXvalue(sideB, sideA, sideC);

		if (angleA < freeAngle) {

			
			this.center = centerNormalize(this);

			var angleB = angleXvalue(sideC, sideB, sideA);
			var angleC = angleXvalue(sideA, sideB, sideC);

			var pointA = side.points[0];
			var pointB = side.points[1];
			var pointC = Object.create(pointProto).constructor(this.points[2], []);

			this.points[0] = pointB;
			this.points[1] = pointA;
			allPoints.push(this.points[2] = pointC);

			pointA.angles.push(Object.create(angleProto).constructor(angleA, this));
			pointB.angles.push(Object.create(angleProto).constructor(angleB, this));
			pointC.angles.push(Object.create(angleProto).constructor(angleC, this));

			this.sides[0] = Object.create(sideProto).constructor(sideA, true, [pointB, pointC], this);
			this.sides[1] = Object.create(sideProto).constructor(sideC, true, [pointA, pointB], this);
			this.sides[2] = Object.create(sideProto).constructor(sideB, true, [pointA, pointC], this);

			allSides.splice(allSides.indexOf(side), 1, this.sides[1], this.sides[2]);

		}

		else {
			this.bg = "rgba(255, 255, 0, 0.5)";

			this.points[2] = [allSides[allSides.indexOf(side)+1].points[0].x, allSides[allSides.indexOf(side)+1].points[0].y];
			this.center = centerNormalize(this);

			var sideA = sideLgth(this.points[0], this.points[1]);
			var sideB = sideLgth(this.points[1], this.points[2]);
			var sideC = sideLgth(this.points[2], this.points[0]);

			var angleA = angleXvalue(sideB, sideA, sideC);
			var angleB = angleXvalue(sideC, sideB, sideA);
			var angleC = angleXvalue(sideA, sideB, sideC);

			var pointA = this.points[0] = side.points[0];
			var pointB = this.points[1] = side.points[1];
			var pointC = this.points[2] = allSides[allSides.indexOf(side)+1].points[0];

			console.log(pointA);
			console.log(pointB);
			console.log(pointC);

			pointA.angles.push(Object.create(angleProto).constructor(angleA, this));
			pointB.angles.push(Object.create(angleProto).constructor(angleB, this));
			pointC.angles.push(Object.create(angleProto).constructor(angleC, this));

			this.sides[0] = Object.create(sideProto).constructor(sideA, true, [pointB, pointC], this);
			this.sides[1] = Object.create(sideProto).constructor(sideC, true, [pointA, pointB], this);
			this.sides[2] = Object.create(sideProto).constructor(sideB, true, [pointA, pointC], this);

			allSides.splice(allSides.indexOf(side), 2, this.sides[2]);


		}
		this.draw();

		return this;

	},
	draw: function() {
		drawObject(this);
	},

};

function centerNormalize(obj) {
	return [(obj.points[0][0] + obj.points[1][0] +obj.points[2][0]) / 3, (obj.points[0][1] + obj.points[1][1] + obj.points[2][1]) / 3];
}

function sideLgth(a, b) {
	return Math.sqrt(Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2));
}

function angleXvalue(a, b, c) {
	return Math.acos((Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c));
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

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

var drawObject = function(obj) {

	// console.log(obj);

	ctx.fillStyle = obj.bg;
	ctx.strokeStyle = "transparent";
	ctx.lineWidth = 1;
	ctx.beginPath();

	obj.points.forEach(function(item, i, arr) {
		// console.log(item);
		ctx.lineTo(item.x, item.y);
	});

	ctx.fill();
	ctx.closePath();

	// ctx.fillStyle = "#000";
	// ctx.fillRect(obj.center[0]-1,obj.center[1]-1, 2, 2);
	// ctx.fillStyle = "red";
	// ctx.fillRect(obj.points[0].x,obj.points[0].y, 2, 2);
	// ctx.fillStyle = "yellow";
	// ctx.fillRect(obj.points[1].x-1,obj.points[1].y-1, 2, 2);
	// ctx.fillStyle = "#00FF06";
	// ctx.fillRect(obj.points[2].x-1,obj.points[2].y-1, 2, 2);
	// ctx.fillStyle = "#18D1FF";
	// ctx.fillRect(ww-1, obj.center[1]-1, 2, 2);
}



function draw() {
	threangles.push(Object.create(threangleStart).constructor());
	threangles[0].draw();

	// var c = allPoints.slice(0); 
	// for (var i = 0; i < c.length; i++) {
	// 	allSides.forEach(function(item, j, arr) {
	// 		if (item.points[0] === c[i]) {
					threangles.push(Object.create(threangleProto).constructor(allSides[0]));
					threangles.push(Object.create(threangleProto).constructor(allSides[1]));
					threangles.push(Object.create(threangleProto).constructor(allSides[2]));
					threangles.push(Object.create(threangleProto).constructor(allSides[3]));
					threangles.push(Object.create(threangleProto).constructor(allSides[4]));
					threangles.push(Object.create(threangleProto).constructor(allSides[5]));
					threangles.push(Object.create(threangleProto).constructor(allSides[6]));
					threangles.push(Object.create(threangleProto).constructor(allSides[7]));
					threangles.push(Object.create(threangleProto).constructor(allSides[8]));
					// threangles.push(Object.create(threangleProto).constructor(allSides[9]));
					// threangles.push(Object.create(threangleProto).constructor(allSides[10]));
	// 		}
	// 	});
	// };

	console.log(threangles);
	// console.log(allSides);
	console.log(allPoints);


};

init();

draw();
