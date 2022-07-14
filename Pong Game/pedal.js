class Pedal {

	constructor(x) {
		this.x = x;
		this.y = 200;
		this.width = 20;
		this.height = 100;
		this.velocity = 0;
	}

	move() {

	}

	show() {

		rect(this.x,this.y,this.width,this.height);
	}
}