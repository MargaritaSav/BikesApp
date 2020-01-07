class Slider {
	constructor() {
		this.prev = document.getElementById("prev");
		this.next = document.getElementById("next");
		this.pause = document.getElementById("pause");
		this.play = document.getElementById("start");
		this.images = document.getElementsByClassName("sliderItems");
		this.interval = 5000;
		this.i = 0;
		this.isPaused = false;
		this.setHeight();

		this.images[0].style.opacity = 1;
		

		this.autoPlay = setInterval(this.start.bind(this), this.interval);

		document.addEventListener("keydown", this.pressKeyboard.bind(this));
		window.addEventListener("resize", this.setHeight);
		next.addEventListener("click", this.nextElement.bind(this));
		prev.addEventListener("click", this.prevElement.bind(this));
		pause.addEventListener("click", this.stopSlider.bind(this));
		start.addEventListener("click", this.restart.bind(this));

	}
		
		start(){
			if (!this.isPaused) {
				this.nextElement();

			}

		};

		restart(){
			this.isPaused = false;
		}

		nextElement(){
			this.images[this.i].classList.remove("showed");
			this.i++;
			if (this.i >= this.images.length) {
				this.i = 0};
			this.images[this.i].classList.add("showed");
		};

		prevElement(){
			this.images[this.i].classList.remove("showed");
			this.i--;
			if (this.i < 0) {
				this.i = this.images.length - 1;
			};
			this.images[this.i].classList.add("showed");
		};

		stopSlider(){
			this.isPaused = true;
		};

		pressKeyboard(event){
			if (event.isComposing || event.code === 'ArrowLeft') {
				this.prevElement();
			} if (event.isComposing || event.code === 'ArrowRight') {
				this.nextElement();
			}
		};

		setHeight(){

			let height = document.getElementById("sliderItem").height + "px"
			document.getElementById("navSlider").style.height = height;
			document.getElementById("sliderId").style.height = height;
		}
		
}

