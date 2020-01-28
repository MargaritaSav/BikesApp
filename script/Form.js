class Form {
	constructor(){
		this.bookingWindow = document.getElementById("book")
		this.submit = document.getElementById("submit");
		this.nom = document.getElementById("nom");
		this.prenom = document.getElementById("prenom");
		
		this.canvasBlock = document.getElementById("canvas-block")
		this.validateCanvBtn = document.getElementById("validate");
		this.clearCanvBtn = document.getElementById("clear");
		this.infoField = document.getElementById("infoField");
		
		this.setValues();
		this.booking = new Booking(nom.value, prenom.value, 1);
		this.initializeCanvas(this.validateCanvBtn, this.clearCanvBtn);
		this.onreload();

		submit.addEventListener("click", (e) => {
			e.preventDefault();
			if (nom.value == "" || prenom.value=="") {
				this.showError(1);
				return;
			}
			this.saveData();
			this.canvasBlock.style.display = "block";
		})
	}

	saveData(){
		window.localStorage.setItem("nom", this.nom.value);
		window.localStorage.setItem("prenom", this.prenom.value);
		this.booking.lastName = this.nom.value;
		this.booking.firstName = this.prenom.value;
	}

	setValues(){
		this.nom.value = window.localStorage.getItem("nom");
		this.prenom.value = window.localStorage.getItem("prenom");
	}

	initializeCanvas(validateCanvBtn, clearCanvBtn){
		let canv = document.getElementById("canvas");
		let ctx = canv.getContext('2d');
		let isMouseDown;
		let coords = [];
		
		canv.width = 170;
		canv.height = 120;
		ctx.fillStyle = "burlywood";
		ctx.strokeStyle = "burlywood";
		ctx.font = "18px OpenSans"
		ctx.fillText("Votre signature", 0, 20);

		ctx.lineWidth = 2*2;
		
		
		canv.addEventListener("mousedown", () => {
			isMouseDown = true;
		})

		canv.addEventListener("mouseup", () => {
			isMouseDown = false;
			ctx.beginPath();
		})

		canv.addEventListener("touchstart", () => {
			isMouseDown = true;
	
		})

		canv.addEventListener("touchend", () => {
			isMouseDown = false;
			ctx.beginPath();
		})

		canv.addEventListener('mousemove', (e) => {
			coords.push([e.offsetX, e.offsetY]);
			this.draw(isMouseDown, ctx, e);	
		});

		
		document.body.addEventListener("touchmove", (e)=> {
		  if (e.target == canvas) {
		    e.preventDefault();
		    coords.push([e.touches[0].clientX, e.touches[0].clientY]);
		    this.draw(isMouseDown, ctx, e);	
		  }
		}, {passive: false});

		// création de la réservation, initialization du minuteur
		validateCanvBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if(this.check(coords)){
				this.booking.signature = coords;
				this.booking.createBooking();
				this.booking.displayInfo();

				clearInterval(this.booking.timer);
				this.booking.countDown(this.booking.validityTime);
				this.canvasBlock.style.display="none";
			}
		});

		clearCanvBtn.addEventListener("click", () => {
			this.clearCanvas(canv, ctx, coords)
		});
		
	}

	draw(isEvent, ctx, e){
		if (isEvent) {
			let x;
			let y;
			let rect = canvas.getBoundingClientRect();
			//Pour les mobiles
			if (e.type=="touchmove") {
				x = e.touches[0].clientX - rect.left;
				y = e.touches[0].clientY - rect.top;
			} else {
				x = e.offsetX;
				y = e.offsetY;
			}
			
			ctx.lineTo(x, y);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(x, y, 2, 0, Math.PI * 2);
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(x, y);
	
	}
}

	clearCanvas(canv, ctx, coords){
		if(coords.length){
			ctx.clearRect(0,0,canv.width,canv.height);
			ctx.fillText("Votre signature", 0, 20)
			coords.length = 0;
			ctx.beginPath();	
		}
		
	}

	showError(id){
		const errorField = document.getElementById("error");
		switch(id){
			case 1: 
				errorField.innerHTML = "Veuiller renseigner votre nom et votre prenom";
				break;
			case 2: 
				errorField.innerHTML = "Veuillez renseigner votre signature";
				break;
			case 3: 
				errorField.innerHTML = "Désolé, il n'y a plus de vélos disponibles à cette station";
				break;
			case 4: 
				errorField.innerHTML = "Votre vélo est déjà reservé dans cette station";
				break;
		}
	
		errorField.style.display = "block";
		setTimeout(() => {
			errorField.style.display = "none"
		}, 4000)
	}

	check(coords){
		if(coords.length<10){
			this.showError(2);
			return false;
		}

		if (JSON.parse(sessionStorage.getItem("chosenStation")).quantity<=0 ){
			this.showError(3);
			return false;
		}

		if (sessionStorage.getItem("BookedStation")!= "Cette reservation est annulée"){
			if (JSON.parse(sessionStorage.getItem("chosenStation")).name == JSON.parse(sessionStorage.getItem("BookedStation")).name ) {
				this.showError(4);	
				return false;
			}
		};
		this.infoField.style.visibility = "visible";
		return true;
		
	}

	onreload(){
		if(sessionStorage.getItem("BookedStation")!= "Cette reservation est annulée" && sessionStorage.getItem("BookedStation")){
			this.bookingWindow.style.display = "block";
			this.booking.bookingStatus.style.visibility = "visible";
			this.infoField.style.visibility = "visible";
			clearInterval(this.booking.timer);
			this.booking.displayInfo();
			this.booking.countDown(this.booking.validityTime);
		}
	}

}