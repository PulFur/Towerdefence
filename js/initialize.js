var mineimg = new Image();
	mineimg.src = "gfx/mine.bmp";
	
var turimg = new Image();
	turimg.src = "gfx/turret.png";
	
var logo = new Image();
	logo.src = "ui/infoUI.jpg";
	
var bulimg = new Image();
	bulimg.src = "gfx/br.bmp";
	
var rocketimg = new Image();
	rocketimg.src = "gfx/rocket.png";
	
var aturimg = new Image();
	aturimg.src = "gfx/auraturret.gif";
	
var sellimg = new Image();
	sellimg.src = "gfx/sell.png";

var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	var cwidth = c.width;
	var cheight = c.height;

var c2=document.getElementById("info");
	var ctx2=c2.getContext("2d");
	var c2width = c2.width;
	var c2height = c2.height;
	

var mousex = 0, mousey = 0, mouseup = 0;
var mousex2 = 0, mousey2 = 0, mouseup2 = 0;

c2.addEventListener('mousedown', function(evt){
	checkMenu();
}, true);
c2.addEventListener('mousemove', function(evt){
	mousex2 = evt.clientX;
	mousey2 = evt.clientY;
  }, true);

c2.addEventListener('mouseup', function(evt){
	mouseup2=1;
}, true);

c.addEventListener('mouseup', function(evt){
	mouseup=1;
}, true);

c.addEventListener('mousedown', function(evt){
	click();
}, true);

c.addEventListener('mousemove', function(evt){
	mousex = evt.clientX;
	mousey = evt.clientY;
}, true);

c.addEventListener("touchstart", function() {
click();
}, true);
c.addEventListener("touchend", function() {
mouseup=1;
}, true);
c.addEventListener("touchmove", function(evt) {
mousex = evt.clientX;
mousey = evt.clientY;
}, true);


var menu = new Array();	  // turret selection in bottom
var buttons = new Array(); // buttons in main menu
var bList = new Array(); // buttonlist in info canvas

var maps = new Array();

var enemyTypes = new Array();
var enemies = new Array();


var turretTypes = new Array();
var turrets = new Array();

var perks = new Array();

var bullets = new Array();
var notices = new Array();
var thunders = new Array();
var explosives = new Array();


var path;
var drag = false;
var dragi;
var atan=0;
var lastid=0;
var spotavailable;
var distance;
var xs, ys;
var aika = Date.now();

var level=0;
var wave = 0 ;
var kills = 0;
var money = 10;

var currentMap;
var enemiesLeft = 0;

var showMenu = true;
var gameStarted = false;
var showInfo = false;			
var showCredits = false;
var selectLevel = false;

var sellRate = 0.8;

var mouseObject;
var spectate = 0;

var bottomUIheight = 68;

var currentInterval;