Object.prototype.deepClone = function(){
	var obj = {};
	for( var key in this ){
		if( key == 'deepClone' || this[key] == null ){
            continue;
        }
		if( this[key].toString() == "[object Object]" ){
			obj[key] = this[key].deepClone();
		}else if( this[key] instanceof Array ){
			obj[key] = this[key].deepClone();
		}else{
			obj[key] = this[key];
		}
	}
	return obj;
};
Array.prototype.deepClone = function(){
	var i , sum , arr = [];
	for( i = 0 , sum = this.length ; i < sum ; ++i ){
		if( !this[i] ){
			continue;
		}
		if( this[i].toString() == "[object Object]" ){
			arr[i] = this[i].deepClone();
		}else if( this[i] instanceof Array ){
			arr[i] = this[i].deepClone();
		}else{
			arr[i] = this[i];
		}
	}
	return arr;
};
Array.prototype.del = function(n){
	if(n<0){
		return this;
	}else{
		return this.slice( 0 , n ).concat( this.slice( n + 1 , this.length ) );
	}
};
var randomArea = function(init){
	var x = Math.random(),
		result = [],
		key;
	for( key in init ){
		if( x < init[key].percent ){
			result.push(init[key].value);
		}
	}
	return result;
};

var Aircraft = function(init){
	for( var key in init ){
		this[key] = init[key];
	}
	if( !this.attack ){
		this.loadWeapon();
	}
	this.fly = this.fly();
	this.damage = this.damage();
	this.destroy = this.destroy();
};
Aircraft.prototype = {
	health : 0,
	speed : 0,
	score : 0,
	die : false,
	checkArea : true,
	animateType : 'fly',
	fly : function(){
		return function(){};
	},damage : function(){
		return function(){};
	},destroy : function(){
		return function(){};
	},loadWeapon : function(){
		this.attack = new Weapon(this.weapon,this);
	},remove : function(){
		if( this.shape.destY > 1000 ){
			this.die = true;
		}
		return this.die;
	},control : function(){
		this.updataArea();
		if( !this.isDied() ){
			this.shape.destY += this.speed;
		}
		this[this.animateType].call(this);
		return null;
	},isDied : function(){
		if( this.health > 0 ){
			return false;
		}else{
			this.animateType = 'destroy';
			this.checkArea = false;
			return true;
		}
	},getDamage : function( attack ){
		this.health -= attack;
		this.animateType = 'damage';
		return this;
	},updataArea : function(){
		var x = (this.shape.destWidth - this.size[0])/2,
			y = (this.shape.destHeight - this.size[1])/2;
		this.area[0][0] = x + this.shape.destX;
		this.area[0][1] = y + this.shape.destY;
		this.area[1][0] = this.area[0][0] + this.size[0];
		this.area[1][1] = this.area[0][1] + this.size[1];
		return this;
	}
};
var Weapon = function( init , airCraft ){
	for( var key in init ){
		this[key] = init[key];
	}
	this.airCraft = airCraft;
	this.loadBullet();
};
Weapon.prototype = {
	airCraft : null,
	bullet : null,
	bulletSum : 0,
	speed : 0,
	posX : 0,
	posY : 0,
	upgrade : function(init){
		for( var key in init ){
			this[key] = init[key];
		}
	},updataPos : function(){
		var airCraftShape = this.airCraft.shape;
		this.posX = airCraftShape.destX;
		this.posY = airCraftShape.destY;
		return this;
	},loadBullet : function(){
		this.fire = (function(speed,_this){
			var time,count;
			time = count = speed;
			return function(){
				var bullet = null;
				if( count != 0 ){
					--count;
					return null;
				}else{
					count = time;
					if( _this.bulletSum == 0 ){
						_this.bulletRunout();
						return null;
					}
					--_this.bulletSum;
					_this.updataPos();
					_this.bullet.shape.destX = _this.posX+_this.airCraft.shape.destWidth/2;
					_this.bullet.shape.destY = _this.posY-10;
					return new Bullet(_this.bullet.deepClone());
				}
				
			}
		})(this.speed,this);
	},bulletRunout : function(){
		this.bullet = normalBullet;
		this.bulletSum = Infinity;
	}
};
var Bullet = function( init ){
	for( var key in init ){
		this[key] = init[key];
	}
	this.area = [[0,0],[0,0]];
};
Bullet.prototype = {
	weapen : null,
	speed : 0,
	health : 0,
	attack : 0,
	die : false,
	checkArea : true,
	fly : function(){},
	damage : function(){},
	destroy : function(){
		this.die = true;
	},control : function(){
		this.updataArea();
		if( this.health > 0 ){
			this.shape.destY -= this.speed;
		}else{
			this.checkArea = false;
			this.destroy();
		}
		return null;
	},getDamage : function( attack ){
		this.health -= attack;
		return this;
	},remove : function(){
		if( this.shape.destY < 0 ){
			this.die = true;
		}
		return this.die;
	},updataArea : function(){
		var x = (this.shape.destWidth - this.size[0])/2,
			y = (this.shape.destHeight - this.size[1])/2;
		this.area[0][0] = x + this.shape.destX;
		this.area[0][1] = y + this.shape.destY;
		this.area[1][0] = this.area[0][0] + this.size[0];
		this.area[1][1] = this.area[0][1] + this.size[1];
		return this;
	}
};
var GameControl = function( cxt , player , enemy , width , height ){
	this.cxt = cxt;
	this.player = new Aircraft(player);
	this.enemyList = enemy;
	this.maxWidth = width;
	this.maxHeight = height;
	this._canvasBuffer = document.createElement('canvas');
	this._canvasBuffer.width = width;
	this._canvasBuffer.height = height;
	this._cxt = this._canvasBuffer.getContext('2d');
	this.keyBoardEvet(this.player);
};
GameControl.prototype = {
	$score : $('#score'),
	cxt : null,
	_canvasBuffer : null,
	_cxt : null,
	player : null,
	enemyList : null,
	bulletControlList : [],
	enemyControlList : [],
	animateList : [],
	maxWidth : 0,
	maxHeight : 0,
	time : 0,
	score : 0,
	push : function( obj , type ){
		if( obj ){
			switch(type){
				case 'bullet' : 
					this.bulletControlList.push(obj);
					break;
				case 'enemy' : 
					this.enemyControlList.push(obj);
			}
		}
		return this;
	},remove : function(index){
		this.animateList.del(index);
		return this;
	},draw : function(){
		this.control();
		var i ,
			sum ,
			animateList = this.animateList,
			cxt = this.cxt,
			_cxt = this._cxt,
			_canvasBuffer = this._canvasBuffer;
		_cxt.clearRect( 0 , 0 , this.maxWidth , this.maxHeight );
		for( i = 0 , sum = animateList.length ; i < sum ; ++i ){
			_cxt.drawImage( animateList[i].image , animateList[i].sourceX , animateList[i].sourceY , animateList[i].sourceWidth , animateList[i].sourceHeight , animateList[i].destX , animateList[i].destY , animateList[i].destWidth , animateList[i].destHeight );
		}
		cxt.drawImage(_canvasBuffer, 0, 0);
		return this;
	},control : function(){
		var i , sum ,
			enemyControlList = this.enemyControlList;
			bulletControlList = this.bulletControlList;
		this.animateList = [];
		if( this.player.remove() ){
			//game over
			//alert( 'game over' );
		}
		this.push(this.player.control(),'bullet');
		this.animateList.push(this.player.shape);


		i = 0 , sum = enemyControlList.length;
		
		while( i < sum ){
			if( enemyControlList[i]['remove']() ){
				this.score += enemyControlList[i].score;
				enemyControlList = enemyControlList.del(i);
				sum -= 1;
				if( i >= sum ){
					break;
				}
			}
			this.animateList.push(enemyControlList[i]['shape']);
			enemyControlList[i]['control']();
			++i;
		}

		this.enemyControlList = enemyControlList;

		i = 0 , sum = bulletControlList.length;

		while( i < sum ){
			if( bulletControlList[i]['remove']() ){
				bulletControlList = bulletControlList.del(i);
				sum -= 1;
				if( i >= sum ){
					break;
				}
			}
			this.animateList.push(bulletControlList[i]['shape']);
			bulletControlList[i]['control']();
			++i;
		}
		this.bulletControlList = bulletControlList;
		
		this.cheakDistance();
		this.addEnemy();
		this.showScore();
	},cheakDistance : function(){
		// check palyer and enemy
		var i , sumi , j , sumj,
			eAList = this.enemyControlList,
			bAList = this.bulletControlList,
			player = this.player;

		for( i = 0 , sumi = eAList.length ; i < sumi ; ++i ){
			if( player.checkArea && eAList[i].checkArea && this.checkOverlap( player.area , eAList[i].area ) ){
				player.getDamage( eAList[i].attack );
			}
		}

		// check bullet and enemy
		
		for( i = 0 , sumi = eAList.length ; i < sumi ; ++i ){
			for( j = 0 , sumj = bAList.length ; j < sumj ; ++j ){
				if( eAList[i].checkArea && bAList[j].checkArea && this.checkOverlap( eAList[i].area , bAList[j].area ) ){
					eAList[i].getDamage(bAList[j].attack);
					bAList[j].getDamage(eAList[i].attack);
				}
			}
		}
	},addEnemy : function(){
		var index = randomArea(this.randEnemy),
				enemy,
				i,
				sum;
		if( Math.random() < 0.03 ){
			for( i = 0 , sum = index.length ; i < sum ; ++i ){
				this.enemyList[index[i]].shape.destX = Math.ceil(Math.random()*(this.maxWidth-this.enemyList[index[i]].shape.destWidth));
				enemy = this.enemyList[index[i]].deepClone();
				this.push( new Aircraft(enemy) , 'enemy' );
			}
		}
	},levelControl : function(){	
	},checkOverlap : function( arr1 , arr2 ){
		if( arr1[1][0] < arr2[0][0] || arr1[1][1] < arr2[0][1] || arr1[0][0] > arr2[1][0] || arr1[0][1] > arr2[1][1] ){
			return false;
		}else{
			return true;
		}
	},randEnemy : [
		{
			percent : 0.7,
			value : 0
		},{
			percent : 0.25,
			value : 1
		},{
			percent : 0.05,
			value : 2
		}
	],keyBoardEvet : function(obj){
		var arrowUp = 38,
			arrowRight = 39,
			arrowDown = 40,
			arrowLeft = 37;

		$(window).on('keydown',function(e){
			var keyCode = e.keyCode;
			if( keyCode == arrowUp ){
				obj.moveUp = true;
			}else if( keyCode == arrowRight ){
				obj.moveRight = true;
			}else if( keyCode == arrowDown ){
				obj.moveDown = true;
			}else if( keyCode == arrowLeft ){
				obj.moveleft = true;
			}
		});
		$(window).on('keyup',function(e){
			var keyCode = e.keyCode;
			if( keyCode == arrowUp ){
				obj.moveUp = false;
			}else if( keyCode == arrowRight ){
				obj.moveRight = false;
			}else if( keyCode == arrowDown ){
				obj.moveDown = false;
			}else if( keyCode == arrowLeft ){
				obj.moveleft = false;
			}
		});


		$(window).on('touchstart',function(e){
			if( !(e.pageX < obj.shape.destX || e.pageY < obj.shape.destY || e.pageX > (obj.shape.destX+obj.shape.destWidth) || e.pageY > (obj.shape.destY+obj.shape.destHeight)) ){
				obj.touchmove = true;
			}
		});
		$(window).on('touchmove',function(e){
			if( obj.touchmove ){
				obj.shape.destX = e.pageX;
				obj.shape.destY = e.pageY;
			}
		});
		$(window).on('touchend',function(e){
			obj.touchmove = false;
		});

	},showScore : function(){
		this.$score.html(this.score);
	}
};

$(function(){
	var $canvas = $('#canvas'),
		cxt = $canvas.get(0).getContext('2d'),
		canvasWidth = $canvas.width(),
		canvasHeight = $canvas.height(),
		shoot = new Image(),
		shootBackground = new Image(),
		scale = 1,
		resizeCanvas = function(){
			var height = $(window).height() > 850 ? 850 : $(window).height(),
				width = $(window).width() > 480 ? 480 : $(window).width();
			$canvas.attr('width', width);
			$canvas.attr('height',height);
			canvasWidth = $canvas.width();
			canvasHeight = $canvas.height();
			scale = height / 850;
		};
		resizeCanvas();

	shoot.src = 'images/shoot.png';
	shootBackground.src = 'images/shoot_background.png';

	var normalBullet = {
		speed : 20,
		attack : 1,
		health : 1,
		shape : {
			image : shoot,
			sourceX : 1004,
			sourceY : 987,
			sourceWidth : 10,
			sourceHeight : 22,
			destX : 0,
			destY : 0,
			destWidth : 10 * scale,
			destHeight : 22 * scale
		},size : [10*scale,18*scale]
	},blueBullet = {
		speed : 10,
		attack : 3,
		shape : {
			image : shoot,
			sourceX : 69,
			sourceY : 77,
			sourceWidth : 10,
			sourceHeight : 22,
			destX : 0,
			destY : 0,
			destWidth : 10 * scale,
			destHeight : 22 * scale
		},size : [10*scale,22*scale]
	},normalWeapon = {
		bullet : normalBullet,
		bulletSum : Infinity,
		speed : 5
	},playerAircraft = {
		moveUp : false,
		moveDown : false,
		moveleft : false,
		moveRight : false,
		health : 1,
		speed : 6,
		score : 0,
		touchmove : false,
		weapon : normalWeapon,
		fly : function(){
			var time , count;
			time = count = 20;
			return function(){
				switch( count ){
					case time :
						this.shape.sourceX = 165;
						this.shape.sourceY = 360;
						break;
					case time / 2 :
						this.shape.sourceX = 0;
						this.shape.sourceY = 99;
						break;
				}
				--count;
				if( count < 0 ){
					count = time
				}
			}
		},destroy : function(){
			var time , count;
			time = count = 20;
			return function(){

			}
		},control : function(){
			if( this.moveUp && this.shape.destY > 0 ){
				this.shape.destY -= this.speed;
			}
			if( this.moveDown && this.shape.destY < canvasHeight - this.shape.destHeight ){
				this.shape.destY += this.speed;
			}
			if( this.moveleft && this.shape.destX > 0 ){
				this.shape.destX -= this.speed;
			}
			if( this.moveRight && this.shape.destX < canvasWidth - this.shape.destWidth ){
				this.shape.destX += this.speed;
			}
			this.fly();
			this.updataArea();
			return this.attack.fire();
		},
		shape : {
			image : shoot,
			sourceX : 0,
			sourceY : 99,
			sourceWidth : 100,
			sourceHeight : 120,
			destX : canvasWidth / 2 - 50,
			destY : canvasHeight - 150,
			destWidth : 100*scale,
			destHeight : 120*scale
		},size : [40*scale,120*scale],
		area : [[0,0],[0,0]]
	},shape1Aircraft = {
		health : 1,
		speed : 5,
		score : 1000,
		attack : 1,
		destroy : function(){
			var time,count;
			time = count = 32;
			return function(){
				switch( count ){ 
					case time :
						this.shape.sourceX = 268; // 268
						this.shape.sourceY = 350; // 350
						break;
					case time * 3 / 4 :
						this.shape.sourceX = 874;
						this.shape.sourceY = 700;
						break;
					case time * 2 / 4:
						this.shape.sourceX = 268;
						this.shape.sourceY = 300;
						break;
					case time / 4:
						this.shape.sourceX = 933;
						this.shape.sourceY = 700;
						break;
					case 0 : 
					    this.die = true;
						break;
				}
				--count;		
			}
		},shape : {
			image : shoot,
			sourceX : 535, // 535
			sourceY : 610, // 610
			sourceWidth : 56,
			sourceHeight : 45,
			destX : 0,
			destY : -100,
			destWidth : 56*scale, 
			destHeight : 45*scale,
		},size : [48*scale,45*scale],
		area : [[0,0],[0,0]]
	},shape2Aircraft = {
		health : 3,
		speed : 3,
		score : 6000,
		attack : 1,
		damage : function(){
			var time , count;
			time = count = 20;
			return function(){
				switch( count ){
					case time :
						this.shape.sourceX = 432;
						this.shape.sourceY = 527;
						break;
					case time / 2 :
						this.shape.sourceX = 0;
						this.shape.sourceY = 2;
						break;
				}

				--count;
				if( count < 0 ){
					count = time;
				}
			};
		},destroy : function(){
			var time,count;
			time = count = 32;
			return function(){
				switch( count ){
					case time :
						this.shape.sourceX = 534;
						this.shape.sourceY = 657;
						break;
					case time * 3 / 4 :
						this.shape.sourceX = 603;
						this.shape.sourceY = 657;
						break;
					case time * 2 / 4:
						this.shape.sourceX = 672;
						this.shape.sourceY = 656;
						break;
					case time / 4:
						this.shape.sourceX = 741;
						this.shape.sourceY = 657;
						break;
					case 0 :
					    this.die = true;
					    break;
				}
				--count;
			}
		},shape : {
			image : shoot,
			sourceX : 0, // 0
			sourceY : 2, // 2
			sourceWidth : 69,
			sourceHeight : 93,
			destX : 0,
			destY : -100,
			destWidth : 69*scale, 
			destHeight : 93*scale,
		},size : [69*scale,93*scale],
		area : [[0,0],[0,0]]
	},shape3Aircraft = {
		health : 10,
		speed : 2,
		score : 30000,
		attack : 1,
		fly : function(){
			var time , count;
			time = count = 20;
			return function(){
				switch( count ){
					case time :
						this.shape.sourceX = 507;
						this.shape.sourceY = 749;
						break;
					case time / 2 :
						this.shape.sourceX = 338;
						this.shape.sourceY = 749;
						break;
				}
				--count;
				if( count < 0 ){
					count = time;
				}
			}
		},damage : function(){
			var time , count;
			time = count = 8;
			return function(){
				switch( count ){
					case time :
						this.shape.sourceX = 169;
						this.shape.sourceY = 749;
						break;
					case time / 2 :
						this.shape.sourceX = 338;
						this.shape.sourceY = 749;
						break;
				}
				--count;
				if( count < 0 ){
					count = time
				}
			};
		},destroy : function(){
			var time,count;
			time = count = 48;
			return function(){
				switch( count ){
					case time :
						this.shape.sourceX = 1;
						this.shape.sourceY = 485;
						break;
					case time * 5 / 6 :
						this.shape.sourceX = 1;
						this.shape.sourceY = 223;
						break;
					case time * 4 / 6:
						this.shape.sourceX = 840;
						this.shape.sourceY = 746;
						break;
					case time * 3 / 6:
						this.shape.sourceX = 166;
						this.shape.sourceY = 484;
						break;
					case time * 2 / 6:
						this.shape.sourceX = 674;
						this.shape.sourceY = 745;
						break;
					case time / 6:
						this.shape.sourceX = 3; // 3
						this.shape.sourceY = 756; // 756
						break;
					case 0 :
						this.die = true;
						break;
				}
				--count;
			}
		},shape : {
			image : shoot,
			sourceX : 338, // 338
			sourceY : 749, // 749
			sourceWidth : 164,
			sourceHeight : 256,
			destX : 0,
			destY : -300,
			destWidth : 164*scale, 
			destHeight : 256*scale,
		},size : [164*scale,256*scale],
		area : [[0,0],[0,0]]
	};
	var player = playerAircraft,
	enemylist = [
		shape1Aircraft,
		shape2Aircraft,
		shape3Aircraft
	],
	gameControl = new GameControl(cxt,player,enemylist,canvasWidth,canvasHeight);
	



	var FPS = 60,

		playAnimation = true,

		shootBackgroundPosY = 0,


		animate = function(){
			cxt.clearRect( 0 , 0 , canvasWidth , canvasHeight );
			drawBackground();
			gameControl.draw();
			if( playAnimation ){
				setTimeout( animate , 1000 / FPS );
			}
		},drawBackground = function(){
			shootBackgroundPosY = shootBackgroundPosY >= canvasHeight ? 0 : shootBackgroundPosY;
			cxt.drawImage( shootBackground , 0 , 75 , canvasWidth , canvasHeight , 0 , shootBackgroundPosY , canvasWidth , canvasHeight );
			cxt.drawImage( shootBackground , 0 , 75 , canvasWidth , canvasHeight , 0 , shootBackgroundPosY-canvasHeight , canvasWidth , canvasHeight );
			shootBackgroundPosY += 5;
		};
	$('#begin').click(function(){
		animate();
		$('#begin').hide();
	});
	$('#begin').click();
});