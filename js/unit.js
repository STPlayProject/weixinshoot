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
		destWidth : 10,
		destHeight : 22
	},size : [10,18]
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
		destWidth : 10,
		destHeight : 22
	},size : [10,22]
},normalWeapon = {
	bullet : normalBullet,
	bulletSum : Infinity,
	speed : 5,
	shiftX : 50,
	shiftY : -10,
	bulletBeforeFire : function(bullet){
		bullet.shape.destX = this.posX;
		bullet.shape.destY = this.posY;
		return [bullet];
	}
},doubleBulletWeapon = {
	bullet : normalBullet,
	bulletSum : Infinity,
	speed : 5,
	shiftX : 50,
	shiftY : -10,
	bulletBeforeFire : function(bullet){
		var bullet1 = bullet.deepClone(),
			bullet2 = bullet.deepClone();
		bullet1.shape.destX = this.posX-10;
		bullet1.shape.destY = this.posY;
		bullet2.shape.destX = this.posX+10;
		bullet2.shape.destY = this.posY;
		return [bullet1,bullet2];
	}
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
		destWidth : 100,
		destHeight : 120
	},size : [40,120]
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
		destWidth : 56, 
		destHeight : 45,
	},size : [48,45]
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
		destWidth : 69, 
		destHeight : 93,
	},size : [69,93]
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
		destWidth : 164, 
		destHeight : 256,
	},size : [164,256]
};