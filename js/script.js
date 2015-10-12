var w = 500;
var h = 500;

var l = 200;

var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var threangle = {
	// center: [getRandomInt(0, w), getRandomInt(0, h)],
	center: [w/2, h/2],
	points: [],
	sides: [],
	bg: "rgba(65, 240, 240, 0.5)",
	create: function(){
		this.sides[0] = getRandomInt(l - l * 0.25, l + l * 0.25);
		this.sides[1] = getRandomInt(l - l * 0.25, l + l * 0.25);
		this.sides[2] = getRandomInt(l - l * 0.25, l + l * 0.25);
		// this.sides[0] = l;
		// this.sides[1] = l;
		// this.sides[2] = l;

		this.points[0] = [getRandomInt(this.center[0] - this.sides[0] / 2, this.center[0] + this.sides[0] / 2),
						  getRandomInt(this.center[1] - this.sides[0] / 2, this.center[1] + this.sides[0] / 2)];

		this.points[1] = [];
		this.points[1][0] = getRandomInt(this.points[0][0] - l / 2, this.points[0][0] + l / 2);

		if (this.points[0][1] < this.center[1]) {
			this.points[1][1] = this.points[0][1] + Math.sqrt(Math.pow(this.sides[0], 2) - Math.pow(this.points[0][0] - this.points[1][0], 2));
		} else {
			this.points[1][1] = this.points[0][1] - Math.sqrt(Math.pow(this.sides[0], 2) - Math.pow(this.points[0][0] - this.points[1][0], 2));
		}

		angleR = Math.acos((Math.pow(this.sides[1], 2) + Math.pow(this.sides[2], 2) - Math.pow(this.sides[0], 2)) / (2 * this.sides[1] * this.sides[2]));
		
			// console.log(angleR*180/Math.PI);

		angle = Math.atan((this.points[1][1] - this.points[0][1]) / (this.points[1][0] - this.points[0][0]));
			// console.log(angle*180/Math.PI);

		ww = this.points[0][0] - (1 / (Math.tan(angle))*(this.points[0][1] - this.center[1]));

		if (ww > this.center[0]) {
			wCenter = 0;
		} else {
			wCenter = 1;
		}

		// console.log(ww);


		this.points[2] = [];


		if((this.points[0][0] > this.points[1][0]) && (this.points[0][1] >= this.points[1][1])) {
			if (wCenter == 0) {
				angleN = angle - Math.PI - angleR;
				// angleN = angle + angleR;

			}
			else {
				angleN = -(Math.PI - (angleR + angle));
			}
			// console.log(1);
		}

		if((this.points[0][0] > this.points[1][0]) && (this.points[0][1] < this.points[1][1])) {
			if (wCenter == 0) {
				angleN = -Math.PI + (angle + angleR);
				// angleN = angle + angleR;

			}
			else {
				angleN = (Math.PI/2 - angleR) - (-Math.PI/2 - angle);
				// angleN = angle - angleR;
			}
			// console.log(2);
		}

		if((this.points[0][0] < this.points[1][0]) && (this.points[0][1] >= this.points[1][1])) {

			if (wCenter ==0) {
				angleN = angle - angleR;

			}
			else {
				angleN = angle + angleR;
			}
			// console.log(3);
		}

		if((this.points[0][0] <= this.points[1][0]) && (this.points[0][1] < this.points[1][1])) {
			if (wCenter ==0) {
				angleN = -Math.PI - (Math.PI/2 -(angleR - (Math.PI/2 - angle)));

			}
			else {
				angleN = angle - angleR;
			}
			// console.log(4);
		}

		// console.log(wCenter);
		// console.log(angleN*180/Math.PI);

		this.points[2][0] = this.points[0][0] + Math.cos(angleN) * this.sides[2];
		this.points[2][1] = this.points[0][1] + Math.sin(angleN) * this.sides[2];
	},

	draw: function() {
		this.create();
		drawObject(this);
	}
};

var threangle_2 = {
	center: threangle.center,
	points: [],
	sides: [],
	bg: "rgba(255, 255, 255, 0.3)",
	create: function(){
		this.sides[0] = threangle.sides[2];
		this.sides[1] = getRandomInt(l - l * 0.25, l + l * 0.25);
		this.sides[2] = getRandomInt(l - l * 0.25, l + l * 0.25);
		
		this.points[0] = threangle.points[1];
		this.points[1] = threangle.points[2];

		angle = Math.atan((this.points[1][1] - this.points[0][1]) / (this.points[1][0] - this.points[0][0]));

		angleR = Math.acos((Math.pow(this.sides[1], 2) + Math.pow(this.sides[2], 2) - Math.pow(this.sides[0], 2)) / (2 * this.sides[1] * this.sides[2]));


		this.points[2] = [];


		if((this.points[0][0] > this.points[1][0]) && (this.points[0][1] >= this.points[1][1])) {
			angleN = -(Math.PI - (angleR + angle));
		}
		if((this.points[0][0] > this.points[1][0]) && (this.points[0][1] < this.points[1][1])) {
			angleN = 90 * (Math.PI/180) - angleR + (angle + 90 * (Math.PI/180));
		}

		if((this.points[0][0] < this.points[1][0]) && (this.points[0][1] >= this.points[1][1])) {

			angleN = angle + angleR;
		}


		if((this.points[0][0] <= this.points[1][0]) && (this.points[0][1] < this.points[1][1]))  {
			angleN = angle - angleR;
		}

		this.points[2][0] = this.points[0][0] + Math.cos(angleN) * this.sides[2];
		this.points[2][1] = this.points[0][1] + Math.sin(angleN) * this.sides[2];
	},

	draw: function() {
		this.create();
		drawObject(this);
	}
}

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
}

var drawObject = function(obj) {

	ctx.clearRect(-20, -20, w+20, h+20);
	// console.log(obj);

	ctx.fillStyle = obj.bg;
	ctx.strokeStyle = "transparent";
	ctx.lineWidth = 1;
	ctx.beginPath();

	obj.points.forEach(function(item, i, arr) {
		ctx.lineTo(item[0], item[1]);
	});

	// ctx.lineTo(obj.center[0] + obj.points[0][0], obj.center[1] + obj.points[0][1]);
	ctx.fill();
	// ctx.stroke();
	ctx.closePath();

	ctx.fillStyle = "#fff";
	ctx.fillRect(obj.center[0]-1,obj.center[1]-1,2,2);
	ctx.fillStyle = "red";
	ctx.fillRect(obj.points[0][0]-1,obj.points[0][1]-1,2,2);
	ctx.fillStyle = "yellow";
	ctx.fillRect(obj.points[1][0]-1,obj.points[1][1]-1,2,2);
	ctx.fillStyle = "#00FF06";
	ctx.fillRect(obj.points[2][0]-1,obj.points[2][1]-1,2,2);
	ctx.fillStyle = "#18D1FF";
	ctx.fillRect(ww-1, obj.center[1]-1, 2, 2);

}


function draw() {
	threangle.draw();
	threangle_2.draw();
	return function() {

	threangle.draw();
	// threangle_2.draw();
	}
};

init();

// draw();
setInterval(draw(),200);
