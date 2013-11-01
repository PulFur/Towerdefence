
setInterval(loop, 10);

function loop() {
	
	clearScreen(0);
	
	if (gameStarted) {
	
		ctx.drawImage(maps[level].background,0,0);	
		
		mapAI();
		drawUI();
		drawObjects();
		drawPoints();
		drawDrag();

		if (spectate != 0 || spectate != null && spectate.name != null) {
			drawInfo(spectate);
		} else {
			ctx2.drawImage(l,0,0);
		}
		
	} else {
		
		ctx2.drawImage(l,0,0);
				
		ctx.fillStyle = "green";
		ctx.fillRect(0,0,cwidth,cheight);
		
		
		if (showMenu) {
		
			for (var oButton = 1 ; oButton < buttons.length; oButton++) {
				buttons[oButton].draw();
				if (mouseup && buttons[oButton].read()) {
					switch (oButton) {
						case 1:
							gameStarted = true;
							//selectLevel = true;
							break;
						case 2:
							showInfo = true;
							break;
						case 3:
							showCredits = true;
							break;
						default:
							break;
					}
					
					showMenu = false;
				}
			}
			
		 }
		 
		 
		if (!showMenu) { // back button
			buttons[0].draw();
			if (mouseup && buttons[0].read()) {
				showCredits = false;
				showInfo = false;
				showMenu = true;
				selectLevel = false;
			}	
		}
		
		if (selectLevel) {
			for (var i = 0 ; i < maps.length; i++) {
			var levelSelect =  maps[i].background;
			var pp = 0;
			var padding = 35;
			if (i >= 3 || i >= 6) {
				a = 0;
				pp = (a+1)*200;
			} else {
				a = i;
				pp = 0 ;
			}
			
			if (mInsideObj(levelSelect)) {}
			
			ctx.drawImage(levelSelect,0,0,levelSelect.width, levelSelect.height, padding+a*150,padding+a+pp,120,180	);	
			}
		}
		
		if (showInfo) {

		}
			
		if (showCredits) {
			//ctx.font = 'italic 40pt Calibri';
			
			ctx.fillText("Programming : ",cwidth/2-50,100);
			ctx.fillText("Pauli			",cwidth/2-50,120);
			
			ctx.fillText("Graphics : ",cwidth/2-50,150);
			ctx.fillText("Tuomas	",cwidth/2-50,170);
			ctx.fillText("Aatu		",cwidth/2-50,180);
			ctx.font = null;
			
		}
		
	}
	
	mouseup=false;
}

function mapAI() {

	currentMap = maps[level];

	if (currentMap.wait == 0 ) {
		if (since(aika) > currentMap.interval) {
			currentMap.newEnemy(); 
		}
	} else {
		if (Date.now() > currentMap.wait) {
			currentMap.nextWave();
		}
	}
	
	
	
}

function drawUI() {

	
	ctx.fillStyle = "green";
	ctx.fillRect(0, c.height-bottomUIheight, c.width, bottomUIheight);
	ctx.fillStyle = "black";
	
	ctx.fillText("Money : "+money,20,cheight-50);		
	ctx.fillText("Enemies : "+currentMap.waveProg+" / "+currentMap.waves[currentMap.wave].length,20,cheight-40);	
	ctx.fillText("Wave : "+currentMap.wave+" / "+currentMap.waves.length,20,cheight-30);
	
	var t = currentMap.wait - Date.now();
	t = Math.floor(t/1000);
	if (t>0 && t<60) {
		ctx.fillText("Time : "+t,20,cheight-20);
	}
	
	ctx.stroke();
	
	ctx.fillText(kills,0,cheight-50);
	
}
function drawDrag() {
	if (drag) {
		ctx.drawImage(dragi.img,mousex-dragi.img.width/2,mousey-dragi.img.height/2-c2height);
		if (dragi.range != null) {
			ctx.beginPath();
			ctx.strokeStyle="red";
			ctx.arc(mousex,mousey-c2height, dragi.range, 0, 2 * Math.PI, true);
			ctx.lineWidth = 1;
			ctx.stroke(); 
		}
	}
}

function clearScreen(which) {
	if (which == 0) {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, c.width, c.height);
	} else {
		ctx2.fillStyle = "white";
		ctx2.fillRect(0, 0, c.width, c.height);	
	}
}

function drawObjects() {
	for (var oTurret = 0; oTurret<turrets.length; oTurret++) 	turrets[oTurret].update();
	for (var oBullet = 0; oBullet<bullets.length;oBullet++) 	bullets[oBullet].update();
	for (var oMenu = 0; oMenu<menu.length; oMenu++) 			menu[oMenu].draw();
	for (var aNotice = 0 ; aNotice<notices.length; aNotice++) 	notices[aNotice].draw();
	for (var aThunder = 0 ; aThunder < thunders.length; aThunder++) thunders[aThunder].update();
	for (var aExplosive = 0 ; aExplosive < explosives.length; aExplosive++) explosives[aExplosive].update();
	
	for (var enemy=0;enemy<enemies.length;enemy++) {
		if (enemies[enemy].health>0) {
			enemies[enemy].update()
		
			path = maps[level].path[enemies[enemy].path];
			
			for (var bulletone = 0; bulletone < bullets.length;bulletone++) {
				//if (objectsOverlap(bullets[bulletone],enemies[enemy])) {
				if (bullets[bulletone].x > enemies[enemy].x-enemies[enemy].img.width/2 && bullets[bulletone].x < enemies[enemy].x+enemies[enemy].img.width/2 && 
					bullets[bulletone].y > enemies[enemy].y-enemies[enemy].img.height/2 && bullets[bulletone].y < enemies[enemy].y+enemies[enemy].img.height/2 && bullets[bulletone].active) {
					enemies[enemy].takeDamageFrom(bullets[bulletone]);
				}			 
			}
			
			for (var turret=0;turret<turrets.length;turret++) {
				if (turrets[turret].ableToShoot(enemies[enemy])) {
					turrets[turret].shoot(enemies[enemy]);
				}
			}
			
		} 
		
	}	
	
	
}

function drawPoints(){
	ctx.fillStyle = 'green';
	for (var b=0;b<currentMap.path.length; b++)  {
		path = currentMap.path[b];
		for (var i=0;i<currentMap.path[b].length;i++) {
			ctx.fillRect(path[i].x,path[i].y,10,10);
			if (drag && dragi.ttype != 1 && !dragi.isTool) {
				if (i+1<path.length) {
					distance = lineDistance(path[i].x,path[i].y,path[i+1].x,path[i+1].y);
					ctx.fillStyle = 'red';
					ctx.strokeStyle = 'red';
					for (var a=0;a<distance;a+=20) {
						atan=-Math.atan2(path[i].x-path[i+1].x,path[i].y-path[i+1].y); 
						xs = path[i].x+Math.sin(atan)*a;
						ys = path[i].y-Math.cos(atan)*a;
						
						ctx.beginPath();
						ctx.arc(xs,ys,30, 0, 2 * Math.PI, true);
						ctx.lineWidth = 1;
						ctx.fill();
		
					}
				}
			}
		}
		ctx.stroke();
	}
}

function createEnemy(type) {
	enemies[enemies.length] = new enemy(type);
}
function checkMenu() { // 'll be changed
	//alert(mousex2+" "+mousey2);
	if (mousex2>280 && mousex2<280+90 && mousey2>10 && mousey2<40 ) {
		if (turrets[lastid].experience>= 0 ) {
			turrets[lastid].experience-=1;
			turrets[lastid].type=1;
		}
	}
	if (mousex2>280 && mousex2<280+90 && mousey2>40 && mousey2<80 ) {
		if (turrets[lastid].experience>= 0 ) {
			turrets[lastid].experience-=1;
			turrets[lastid].type=2;
		}
	}
	if (mousex2>370 && mousex2<370+90 && mousey2>10 && mousey2<40 ) {
		if (turrets[lastid].experience>= 0 ) {
			turrets[lastid].experience-=1;
			turrets[lastid].type=3;
		}
	}
	if (mousex2>370 && mousex2<370+90 && mousey2>40 && mousey2<80 ) {
		if (turrets[lastid].experience>= 0 ) {
			turrets[lastid].experience-=1;
			turrets[lastid].type=4;
		}
	}
	
	
}

function click() {

	spotavailable=true;
	if (!drag) {
		for (var menuitem=0;menuitem<menu.length;menuitem++) {
			if (mInsideObj(menu[menuitem])) {
				if (money >= menu[menuitem].value) {
					drag = true;
					dragi = menu[menuitem];
				} else {
					notices[notices.length] = new notice(menu[menuitem].x-40, menu[menuitem].y-30,"Insufficient funds",255,0,0);
				}
			}

		}
	} else {
		if (insideMap(mousex,mousey)) {
		
			for (var c = 0; c < turrets.length; c++) {
				if (turrets[c].active) {
					if (mInsideObj(turrets[c])) {
						if (dragi.isTool) { 
							turrets[c].onSold();
							resetDrag();
						}
						spotavailable = false;
					}
				}
			}

			
			for (var b=0;b<currentMap.path.length; b++)  {
				path = currentMap.path[b];
				for (var i=0;i<path.length;i++) {
					if (i+1<path.length) {
						distance = lineDistance(path[i].x,path[i].y,path[i+1].x,path[i+1].y);
						for (var a=0;a<distance;a+=10) {
							atan=-Math.atan2(path[i].x-path[i+1].x,path[i].y-path[i+1].y); 
							xs = path[i].x+Math.sin(atan)*a;
							ys = path[i].y-Math.cos(atan)*a;
							
							if (mInsideObj({x:xs,y:ys, width:60, height:60}) && dragi.ttype != 1 && !dragi.isTool) {
								spotavailable = false;
							}
			
						}
					}
				}
				
			}
				
			if (spotavailable) { // buy turret
				turrets[turrets.length] = new turret(dragi.ttype,mousex,mousey-100,turrets.length);
				turrets[turrets.length-1].onBought();
				resetDrag();
			}
		}
	}
}


$(document).keydown(function(e){
	var key = e.which;
	if (key == "37") {
	aturrets[lastid].density+=0.01;
	}
	if (key == "39") {
	aturrets[lastid].density-=0.01;	
	
	}
	
});