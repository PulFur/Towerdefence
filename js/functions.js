function inRange(o1,o2) {
	return lineDistance(o1.x,o1.y,o2.x,o2.y) < o1.range;
}

function sButton(o) {

	this.clicked = false;
	
	this.update = function () {
	
		this.draw();
		this.readMouse();
	}
	
	this.draw = function () {
		ctx2.fillStyle = "rgba(0,255,255,0.5)"
		ctx2.beginPath();
		ctx2.fillRect(o.x,o.y,o.w,o.h);
		ctx2.stroke();
		
		ctx2.strokeStyle = "rgb(0,255,0)";
		ctx2.beginPath();
		ctx2.moveTo(o.x,o.y+o.h/2);
		ctx2.lineTo(o.x+o.w,o.y+o.h/2);
		ctx2.stroke();
		
		ctx2.beginPath();
		ctx2.moveTo(o.x+o.w/2,o.y);
		ctx2.lineTo(o.x+o.w/2,o.y+o.h);
		ctx2.stroke();
	}
	
	this.readMouse = function () {
		if (mouseup2) {
			if (mousex2 > o.x && mousex2 < o.x+o.w &&
				mousey2 > o.y && mousey2 < o.y+o.h) {
				this.clicked = true;
			} else {
				this.clicked = false;
			}
		}
	}
	
}


function getAngle(o1,o2) {
	return -Math.atan2(o1.x-o2.x,o1.y-o2.y);
}

function since(time) {
	return Date.now() - time;
}

function lineDistance( x1,y1,x2,y2 ) { 
	var dx = x1 - x2;
	var dy = y1 - y2;
	distance = Math.sqrt(dx*dx + dy*dy);
	return distance;
}

function insideMap(x,y) {
return (x > 0 && x < cwidth &&
		y > c2height && y < cheight+c2height-bottomUIheight);
}

function objectsOverlap(o1,o2) {
return	o1.x > o2.x - o2.width && o1.x < o2.x +o2.width &&
		o1.y > o2.y - o2.height && o1.y < o2.y +o2.height;
}
		
function mInsideObj(o) {
if (o.img != null) {
	o.width = o.img.width;
	o.height = o.img.height;
}
return 	(mousex > o.x-o.width/2 && mousex < o.x+o.width/2) &&
		(mousey > o.y-o.height/2+c2height && mousey < o.y+o.height/2+c2height);
}

function addImage(path) {
	var a = new Image();
	a.src = path;
	return a;
	
}


function clearObjects() {
	mines.length = null;
	notices.length = null;
	thunders.length = null;
	enemies.length = null;
	turrets.length = null;
	bullets.length = null;
}


function drawRotatedImage(image, x, y, angle) { 
	ctx.save(); 
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
	ctx.restore(); 
}

function resetDrag() {
	drag = false;
	dragi = null;
}
