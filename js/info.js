function drawInfo(o) {

	clearScreen(1);
	
	ctx2.fillStyle = "blue";
	ctx2.font = "bold 24px Arial";
	
	ctx2.fillText(o.name, 50-o.name.length*4, 40);
	ctx2.drawImage(o.img, 40, 50);
	
	ctx2.fillStyle = "blue";
	ctx2.font = "bold 16px Arial";
		
	if (!o.isEnemy) {
		//ctx2.fillText("ID : "+id, 150, 15);
		
		for (var i = 0 ; i < bList.length; i++) { // upgrades
			bList[i].update();
			if (bList[i].clicked) {
				switch (i) {
					case 0:
						turrets[o.id].damage++;
						break;
					case 1:
						turrets[o.id].range+=10;
						break;
					case 2:
						turrets[o.id].firespeed-=20;
						break;
					default:
						break;
				}	
				bList[i].clicked = false;
			}
		}

		ctx2.fillStyle = "rgb(0,0,175)"
		ctx2.fillText("Damage : "+o.damage, 150, 25);
		ctx2.fillText("Range : "+o.range, 150, 45);
		ctx2.fillText("Firespeed : "+o.firespeed, 150, 65);
		ctx2.fillText("Experience: "+o.experience, 150,85);
		//ctx2.fillText("Perk: "+turrets[id].type,150,120);
		
		if (o.density != null) ctx2.fillText("debug: density = "+o.density,250,95);
		
		makeButton("Fire","red",280,10,90,30);
		makeButton("Ice","cyan",280,40,90,30);
		makeButton("Lightning","yellow",370,10,90,30);
		makeButton("Explosive","purple",370,40,90,30);

		ctx2.fillStyle = "black";				
		ctx2.fillText("Money : "+money,50,480);
	
	}
	else
	{	
		var htext = "Health : "+o.health;
		ctx2.fillText(htext, 150, 25);
		ctx2.fillText("/ "+enemyTypes[o.type].health, 150+htext.length*8, 25);
		ctx2.fillText("Speed : "+o.speed, 150, 45);
		ctx2.fillText("Moved : "+o.moved,150,65);
	}
	
	lastid = o.id;
	mouseup2 = false;
		
}
function makeButton(text,color,x,y,w,h)  {
	ctx2.fillStyle = color;
	ctx2.fillRect(x, y, w, h);
	ctx2.fillStyle = "black";				
	ctx2.fillText(text,x+10,y+20);
}