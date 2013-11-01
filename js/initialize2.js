turretTypes[turretTypes.length] = 
{
	name: "Turret", // the name displayed in info
	damage : 1,
	ttype : 0, // turret id
	range : 100,
	firespeed : 300,
	fires : true, // if false, attacking is automated
	img : turimg,
	value : 5, // how much the tower is worth. this affects selling amount
	shoot : function(o) {
		bullets[bullets.length] = new bullet (0,this.x,this.y,getAngle(this,o),this.type,this.id,o);
		this.timer = new Date().getTime();
		this.shot = getAngle(this,o);
	},
	
	ableToShoot: function(o) {
		return (since(this.timer) > this.firespeed) && this.active && inRange(this,o);
	}
}
turretTypes[turretTypes.length] = 	
{
	name: "Mine",
	damage : 5,
	ttype : 1,
	range : 20,
	firespeed : 0,
	fires : false,
	img : mineimg,
	value : 5,
	isDestructive : true,
	shoot : function(o) {
		if (o != null) {
			explosives[explosives.length] = new explosive(o,this.id);
			this.active = false;
		}
	},
	ableToShoot: function(o) {
		return this.active && inRange(this,o);
	}
}

turretTypes[turretTypes.length] = 
{
	name: "Aura turret",
	damage : 1,
	ttype : 2,
	range : 80,
	firespeed : 300,
	fires : false,
	img : aturimg,
	value : 5,
	shoot : function(o) {
		if (o == null) {
		for (var i=this.range; i > 15; i-=10) {
			var den = this.density + this.tick / 1000;
			ctx.beginPath();
			ctx.fillStyle = "rgba(0,0,0,"+den+")";
			ctx.arc(this.x, this.y, i, 0, 2 * Math.PI, true);
			ctx.lineWidth = this.density;
			ctx.fill(); 
		}		
		
		this.tick+=1;
		if (this.tick >= this.range) {
				for (var a = 0 ; a < enemies.length; a++) {
					if (enemies[a].health > 0 && lineDistance(this.x,this.y,enemies[a].x,enemies[a].y) < this.range) { 
						enemies[a].takeDamageFrom(this);
					}
				}
			this.tick = -50;
		}
		}
	},
	ableToShoot: function(o) {
		return this.active;
	}
}



turretTypes[turretTypes.length] = 
{
	name: "Element turret",
	damage : 1,
	ttype : 3,
	range : 80,
	firespeed : 1000,
	fires : false,
	img : aturimg,
	value : 5,
	shoot : function(o) {
	
		if (o != null && o.health>0) {
		if (this.type == 4) {
			bullets[bullets.length] = new bullet(1,this.x,this.y,getAngle(this,o),this.type,this.id,o);
			this.timer = new Date().getTime();
		}
		
		if (this.type == 3) {
			this.timer = new Date().getTime();
			
			var arr = new Array();
			arr.length=0;
			
			for (var i= 0 ; i < enemies.length; i++) {
				if (enemies[i].health>0 && inRange(this,enemies[i])) {
					arr[arr.length] = enemies[i];
				}
			}
			
			var r = Math.floor(Math.random()*(arr.length));
			

			thunders[thunders.length] = new thunder(this,arr[r]);
			
				
			}
		}
	},
	ableToShoot: function(o) {
		return (since(this.timer) > this.firespeed && this.active && inRange(this,o));
	}
}




enemyTypes[1] =	
{
	name : "Rat",
	speed : 1,
	health : 8,
	rewardmoney : 5,
	img : addImage("enemies/t.png")
}

enemyTypes[2] =	
{
	name : "Hamster",
	speed : 1,
	health : 15,
	rewardmoney : 5,
	img : addImage("enemies/nuppu.png")
}

enemyTypes[3] =	
{
	name : "Cat",
	speed : 2,
	health : 10,
	rewardmoney : 5,
	img : addImage("enemies/cat.png") 
}

enemyTypes[4] =	
{
	name : "dunno",
	speed : 0.5,
	health : 20,
	rewardmoney : 4,
	img : addImage("enemies/olio.png") 
}

enemyTypes[5] =	
{
	name : "Slug",
	speed : 0.5,
	health : 25,
	rewardmoney : 4,
	img : addImage("enemies/Slug.gif") 
}

enemyTypes[6] =	
{
	name : "Bee",
	speed : 1.5,
	health : 10,
	rewardmoney : 4,
	img : addImage("enemies/Bee.gif") 
}

enemyTypes[7] =	
{
	name : "Spider",
	speed : 1.8,
	health : 5,
	rewardmoney : 4,
	img : addImage("enemies/Spider.gif") 
}

enemyTypes[8] =	
{
	name : "Ant",
	speed : 1.0,
	health : 15,
	rewardmoney : 4,
	img : addImage("enemies/Ant.gif") 
}

enemyTypes[9] =	
{
	name : "Mantis",
	speed : 1.0,
	health : 25,
	rewardmoney : 10,
	img : addImage("enemies/Mantis.gif") 
}

enemyTypes[10] =	
{
	name : "Roach",
	speed : 0.5,
	health : 50,
	rewardmoney : 10,
	img : addImage("enemies/Roach.gif") 
}



menu[menu.length] = new turret(0,150,cheight-40,-1); // normal
menu[menu.length] = new turret(1,200,cheight-40,-1); // mine
menu[menu.length] = new turret(2,250,cheight-40,-1); // aura
menu[menu.length] = new turret(3,300,cheight-40,-1); // elemental

menu[menu.length] = new sell(450,cheight-40); // sell button

buttons[buttons.length] = new button("Back",cwidth/2-100,450,200,40);
buttons[buttons.length] = new button("Play",cwidth/2-100,100,200,40);
buttons[buttons.length] = new button("Info",cwidth/2-100,150,200,40);
buttons[buttons.length] = new button("Credits",cwidth/2-100,200,200,40);

perks[1] = "red";
perks[2] = "cyan";
perks[3] = "yellow";
perks[4] = "purple";




maps[maps.length] =	new map(
new Array( // waves
	new Array(5,5,6,5,5,7),
	new Array(5,5,6,5,7,7),
	new Array(5,5,6,7,7,7),
	new Array(7,6,6,5,5,7),
	new Array(7,7,7,6,6,7)
	),
new Array( // path
		new Array(
			new dot(0,20),
			new dot(220,20),//220 
			new dot(370,100), //370,100
			new dot(424,340),
			new dot(316,484),
			new dot(200,510),
			new dot(100,433),
			new dot(0,250)
		)
),		
		
500, // interval
"maps/map1.jpg" // map src
);

maps[maps.length] =	new map(
new Array(
	new Array(1,2),
	new Array(2,2,1,1),
	new Array(2,2,2,2),
	new Array(2,2,2,2)
	),
new Array( 
	new Array(
		new dot(480,5), 
		new dot(200,10),
		new dot(50,160),
		new dot(50,400),
		new dot(100,450),
		new dot(380,475),
		new dot(480,400)
		)
	),
500,
"maps/map2.jpg"
);	

	
maps[maps.length] =	new map( // uusi kenttä
new Array(
	new Array(5,5,6,5,5,7,8,8),
	new Array(5,5,6,5,7,7),
	new Array(5,5,6,8,8,7,7,7),
	new Array(7,6,6,5,5,7,9),
	new Array(7,7,7,6,6,7,10)
	),
new Array(
	new Array ( 
		new dot(0,275), 
		new dot(187,275),
		new dot(250,40),
		new dot(325,40),
		new dot(400,275),
		new dot(480,275)
	),
	new Array ( 
		new dot(0,275), 
		new dot(187,275),
		new dot(250,505),
		new dot(325,505),
		new dot(400,275),
		new dot(480,275)	
	)
),200,
"maps/map3.jpg"
);	


maps[maps.length] =	new map( // uusi kenttä
new Array(
	new Array(5,5,6,5,5,7,8,8),
	new Array(5,5,6,5,7,7),
	new Array(5,5,6,8,8,7,7,7),
	new Array(7,6,6,5,5,7,9),
	new Array(7,7,7,6,6,7,10)
	),
new Array(
	new Array ( 
		new dot(0,275), 
		new dot(187,275),
		new dot(250,40),
		new dot(325,40),
		new dot(400,275),
		new dot(480,275)
	),
	new Array ( 
		new dot(0,275), 
		new dot(187,275),
		new dot(250,505),
		new dot(325,505),
		new dot(400,275),
		new dot(480,275)	
	)
),200,
"maps/map4.jpg"
);	






bList[0] = new sButton({x : 135, y : 15, w : 10, h : 10});
bList[1] = new sButton({x : 135, y : 35, w : 10, h : 10});
bList[2] = new sButton({x : 135, y : 55, w : 10, h : 10});