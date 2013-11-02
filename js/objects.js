function bullet(ttype,x,y,angle,type,hostid,enemy) {
	this.isExplosive = ttype;
	this.enemy = enemy;
	this.ttype = ttype;
	this.isDestructive = true;
	this.damage=turrets[hostid].damage;
	this.type=type;
	this.active=1;
	this.speed=2;
	this.x=x;
	this.y=y;
	this.host=hostid;
	this.atan=angle;
	this.img = bulimg;
	
	if (ttype == 1) {
		this.img = rocketimg;	
		this.speed=0.5;
	}
	
	this.increaseExp = function() {
		turrets[this.host].experience++;
	}
	
	this.update = function () {
		if (this.active) {
			this.move();
			this.draw();
			
			if (this.enemy.health > 0) {
				this.atan = getAngle(this,this.enemy);
			}
			
			if (lineDistance(turrets[this.host].x,turrets[this.host].y,this.x,this.y) >  turrets[this.host].range) {
				this.active = false;
			}
				
			
		}
		
	}
	
	this.move = function () {
		this.x += Math.sin(this.atan)*3*this.speed;
		this.y -= Math.cos(this.atan)*3*this.speed;
	}
	
	this.draw = function () {
		drawRotatedImage(this.img,this.x,this.y,this.atan-1.6);
	}

}
function enemy(type) {
	this.isEnemy = true;
	this.type = type;
	this.name = enemyTypes[type].name;
	this.path = Math.floor(Math.random()*maps[level].path.length);
	this.rewardmoney = enemyTypes[type].rewardmoney;
	this.disadvantage = 0;
	this.x = maps[level].path[this.path][0].x;
	this.y = maps[level].path[this.path][0].y;
	this.speed = enemyTypes[type].speed;
	this.mSpeed = this.speed;
	this.health = enemyTypes[type].health;
	this.nextpoint = 0;
	this.img = enemyTypes[type].img;
	
	this.width = this.img.width;
	this.height = this.img.height;
	
	this.elementalStatus = new Array();
	this.moved = 0;
	
	this.update = function () {
		if (this.health > 0 ) {			
			this.updateBurdens();
			this.move();
			this.draw();
			this.drawHealthbar();
			
			if (mInsideObj(this)){
				if (mouseup==1) this.onclick();	
			}
			
		}
	}

	this.updateBurdens = function () {
		this.mSpeed = this.speed;
		for (var i=0; i < this.elementalStatus.length; i++) {
			if (this.elementalStatus[i].active) {
			
				if (Date.now() - this.elementalStatus[i].time > 0) {
					this.elementalStatus[i].active = false;
				}

				
				switch (this.elementalStatus[i].o.type) {
					case 0:
						break;
					case 1: // fire
						ctx.beginPath();
						ctx.fillStyle = "red";
						ctx.arc(this.x+Math.floor(Math.random()*20-10), this.y+Math.floor(Math.random()*20-10), 2, 0, 2 * Math.PI, true);
						ctx.fill(); 
						this.takeDamageFromFire(this.elementalStatus[i].o);
						break;
					case 2: // ice
						this.mSpeed = this.mSpeed*0.8; 
						break;
					case 3: // lightning
						var apu = (this.elementalStatus[i].time-Date.now())/25;
						this.mSpeed = this.mSpeed * apu;
						break;
					case 4: // explosive
						break;
					default:
						break;
				}				
				
				
			}
		}
	}
	
	this.move = function () {
	
		path = maps[level].path[this.path];
		
		if (this.x < path[this.nextpoint].x+2 && this.x > path[this.nextpoint].x-2 && 
			this.y < path[this.nextpoint].y+2 && this.y > path[this.nextpoint].y-2 ) {
			if (this.nextpoint == path.length-1) {
				//reached to end
				this.onDeath(true);
			} else {
				this.nextpoint++;
			}
		} 
		else {				
			
			atan=-Math.atan2(this.x-path[this.nextpoint].x,this.y-path[this.nextpoint].y); 			
			this.x += Math.sin(atan)*(this.mSpeed/2);
			this.y -= Math.cos(atan)*(this.mSpeed/2);
			this.moved += Math.abs(Math.sin(atan)*(this.mSpeed/2)) + Math.abs(Math.cos(atan)*(this.mSpeed/2));
		}
	}

	this.takeDamageFromFire = function (o) {
		this.health -= o.damage/500;
		if (this.isDead()) {
			o.increaseExp();
			this.onDeath(false);
		}
		
	}
	
	this.takeDamageFrom = function (o) {
	
		if (o.type != null && o.type != 0) {
			this.elementalStatus[this.elementalStatus.length] = new burden(o);
		}
		
		this.health -= o.damage;
		if (o.isDestructive) {
			o.active = false;
			
			if (o.isExplosive) {
				explosives[explosives.length] = new explosive(this,o.host);
			}
			
		}
		if (this.isDead()) {
			o.increaseExp();
			this.onDeath(false);
		}
	}

	this.onclick = onClick;
	
	this.isDead = function () {
		return (this.health <= 0);
	}
	
	this.onDeath = function (reachedEnd) {
		this.health = -1;
		if (!reachedEnd) {
			money += this.rewardmoney;
			notices[notices.length] = new notice(this.x,this.y,"+ "+this.rewardmoney+" $",100,255,0);
		}
		kills++;
	}
	
	this.draw = function () {
		path = maps[level].path[this.path];
		drawRotatedImage(this.img,this.x,this.y,-Math.atan2(path[this.nextpoint].x-this.x,path[this.nextpoint].y-this.y));
	}
	
	this.drawHealthbar = function () {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x-this.width/2,this.y-8-this.height/2,this.width,5);
		ctx.fillStyle = "green";
		var len = this.width / enemyTypes[type].health * this.health;
		ctx.fillRect(this.x-this.width/2,this.y-8-this.height/2,len,5);
		
		var rate = this.width / enemyTypes[type].health;
		for (var i = rate*5; i < this.width; i += rate * 5) {
			ctx.fillStyle = "black";
			ctx.fillRect(this.x+i-this.width/2,this.y-8-this.height/2,0.2,5);					
		}
		
	}
		
}



function turret(turtype,x,y,id) {
	this.active = false;
	this.id = id;
	this.x = x;
	this.y = y;
	
	this.type = 0;
	this.shot = 0;
	this.experience = 0;
	this.level = 1; //not used yet
	this.timer = new Date().getTime();
	this.aika = 0;
	
	this.ttype = turretTypes[turtype].ttype;
	this.name = turretTypes[turtype].name;
	this.damage = turretTypes[turtype].damage;
	this.range = turretTypes[turtype].range;
	this.firespeed = turretTypes[turtype].firespeed;
	this.fires = turretTypes[turtype].fires;
	this.value = turretTypes[turtype].value;
	this.img = turretTypes[turtype].img;
	this.width = this.img.width;
	this.height = this.img.height;
	
	this.tick = -50;
	this.density = this.damage / 15;
	
	this.isDestructive = turretTypes[turtype].isDestructive;
	
	this.update = function () {
		if (this.active) {
			if (!this.fires && this.ttype == 2) {
				this.shoot(null);
			}
			this.draw();
			
			if (mInsideObj(this)){
				this.circle();
				if (mouseup==1) this.onclick();	
			}
		} else {
			if (this.ttype == 1) {
				this.shoot(null);
			}
		}
	}
	
	this.draw = function () {
		ctx.beginPath();
		this.drawPerk();
		drawRotatedImage(this.img, this.x,this.y, this.shot-1.6);

	}
	
	this.onBought = onBought;
	this.onSold = onSold;
	this.drawPerk = drawPerk;
	this.onclick = onClick;
	this.circle = drawCircle;
	
	this.shoot = turretTypes[turtype].shoot;
	
	this.ableToShoot = turretTypes[turtype].ableToShoot
	
	this.increaseExp = function() {
		this.experience++;
	}
	
	this.explode = function () {
		this.aika = Date.now();
	}
	
}

function dot(x,y) {
	this.x = x;
	this.y = y;
}

function map(waves,path,interval,bgsrc) {
	this.wait = 0;
	this.waitForFinish = false;
	this.wave = 0;
	this.waveProg = 1;
	
	this.waveSpan = 15000;
	
	this.waves = waves;
	this.path = path;

	this.interval = 0;
	
	this.background = new Image();
	this.background.src= bgsrc;
	this.amount = 5;
	
	this.initialize = function () {
		this.interval = this.waves[this.wave][0];
		this.wait = Date.now() + 5000;
		this.wave = 0;
		this.waveProg = 1;
	}
	
	
	this.nextEnemy = function () {
		enemies[enemies.length] = new enemy(this.waves[this.wave][this.waveProg]);
		aika = Date.now();
		this.waveProg++;
		
		if (this.waveProg == this.waves[this.wave].length) {
			this.wait = Date.now() + this.waveSpan;
		}
	}
	
	this.nextWave = function () {
		if (this.waveProg > 1 ) {
			this.wave++;
		} 
		
		if (this.wave == this.waves.length) {
			this.wave--;
			this.waitForFinish = true;
			this.waveProg = 1;
			this.wait = 0;
		} else {
			this.wait = 0;
			this.waveProg = 1;
			this.interval = this.waves[this.wave][0];
		
		}		
		
	}

}

function notice(x,y,text,r,g,b) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.g = g;
	this.b = b;
	
	this.text = text;
	this.fade = 1;

	this.draw = function (){
		this.fade-=0.005;
		this.y-=0.1;
		ctx.fillStyle="rgba("+this.r+","+this.g+","+this.b+","+this.fade+")";
		ctx.fillText(this.text,this.x,this.y);
		ctx.stroke();
	}
}


function button(text,x,y,w,h) {
	this.text = text;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.draw = function () {
		ctx.fillStyle = "grey";
		ctx.fillRect(x,y,w,h);
		ctx.fillStyle = "black";				
		ctx.fillText(text,x+10,y+10);
		ctx.stroke();
	}
	this.read = function() {
		if (mousex > this.x && mousex < this.x+this.w &&
			mousey > this.y+c2height && mousey < this.y+this.h+c2height) {
				return true;
			}
	}

}

function sell(x,y) {
	this.isTool = true;
	this.value = 0 ;
	this.x = x;
	this.y = y;
	this.img = sellimg;
	this.width = this.img.width;
	this.height = this.img.height;
	
	this.draw = function () {
		ctx.drawImage(this.img,this.x-this.img.width/2,this.y-this.img.height/2);
	}
}

function onBought() {
	this.active = true;
	money -= this.value;
	notices[notices.length] = new notice(this.x,this.y,"- "+this.value+" $",255,0,0);
}

function onSold() {
	this.active = false;
	money += this.value * sellRate;
	notices[notices.length] = new notice(this.x,this.y,"+ "+this.value * sellRate+" $",100,255,0);
}

function onClick() {
	spectate = this;
}

function drawCircle() {
	ctx.beginPath();
	ctx.strokeStyle = "rgba(255,0,255,0.5";
	ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI, true);
	ctx.lineWidth = 2;
	ctx.stroke(); 
}

function drawPerk() {
	if (this.type>0) {
		ctx.fillStyle = perks[this.type];
		ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI, true);
		ctx.fill();
		//ctx.stroke();
	}
}


function thunder(o1,o2) {
	this.active = true;
	this.o1 = o1;
	this.o2 = o2;
	this.fade = 1;
	
	this.update = function () {
		if (this.active) {
			this.fade-=0.05;
			this.draw();
			
			if (this.fade<=0) {
				this.active = false;
				o2.takeDamageFrom(o1);
			}
		}
	}
	
	this.draw = function () {
		
		distance = lineDistance(o1.x,o1.y,o2.x,o2.y);
		for (var a=0;a<distance;a+=10) {

			ctx.strokeStyle = "rgba(0,255,255,"+this.fade+")";
			ctx.fillStyle = "rgba(0,255,"+distance+",1)";
			ctx.lineWidth = 5;

			var atan=-Math.atan2(o1.x-o2.x,o1.y-o2.y);
			
			var xs = o1.x+Math.sin(atan)*a;
			var ys = o1.y-Math.cos(atan)*a;
			
			ctx.beginPath();
			ctx.moveTo(xs-10,ys+10);
			ctx.lineTo(xs+10,ys-10);
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.moveTo(xs+10,ys+10);
			ctx.lineTo(xs-10,ys-10);
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.arc(xs,ys,3, 0, 2 * Math.PI, true);
			ctx.lineWidth = 1;
			ctx.fill();
			ctx.stroke();
			
		}

					
					
	}
}



function explosive(enemy,host) {
	this.type = 0;
	this.active = true;
	this.enemy = {x : enemy.x, y : enemy.y};
	this.host = host;
	this.tick = 50;
	this.range = 30;
	this.damage = 0.05;
	this.x = enemy.x;
	this.y = enemy.y;
	
	this.update = function () {
		if (this.active) {
			this.draw();
		}
	}	
	
	this.draw = function () {
		if (this.tick >= 0 && this.enemy != null ) {
			ctx.beginPath();
			ctx.fillStyle = "rgb(255,100,0";
			ctx.strokeStyle = "rgba(255,0,255,0.5";
			ctx.arc(this.enemy.x+Math.floor(Math.random()*10-5), this.enemy.y+Math.floor(Math.random()*10-5),Math.floor(Math.random()*20) , 0, 2 * Math.PI, true);
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fill();
			
			
			if (this.tick > 20 && this.tick < 35  ) {
				this.type = turrets[host].type;
			} else {
				this.type = 0;
			}
			
			for (var i=0; i<enemies.length; i++) {
				if (enemies[i].health>0 && inRange(this,enemies[i])) {
					enemies[i].takeDamageFrom(this);
				}			
			}
			
			
			this.tick--;

			
			
		} else {
			active = false;
		}
	}
	
	this.increaseExp = function () {
		turrets[this.host].experience++; 
	}
	
}



function burden(o) {
	this.active = true;
	this.o = o;
	this.time = Date.now()+5000;
	if (o.type == 3 ) {
		this.time = Date.now()+100;
	}
}