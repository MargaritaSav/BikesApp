

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


	function initializeBookingApp(){
		const bookingWindow = document.getElementById("book"),
		stationName = document.getElementById("name"),
		stationAdress = document.getElementById("adresse"),
		bikeStands = document.getElementById("places"),
		availableBikes = document.getElementById("available"),
		veloIconClosed = L.icon({
			    	iconUrl: 'icon-red.png',
			    	iconSize:     [32, 50],
			    	className: 'marker', // size of the icon
				}),
		veloIcon = L.icon({
					iconUrl: 'icon.png',
					iconSize:     [32, 50],
					className: 'marker', // size of the icon
					}),

		submit = document.getElementById("submit"),
		nom = document.getElementById("nom"),
		prenom = document.getElementById("prenom"),
		errorMessage = document.getElementById("error"),
		validateCanvBtn = document.getElementById("validate"),
		clearCanvBtn = document.getElementById("clear"),
		stationNameBooked = document.getElementById("stationName"),
		cancelBtn = document.getElementById("cancel"),
		bookingStatus = document.getElementById("status");

		
		initializeMap();
		initializeForm();
		initializeCanvas();
	 
	function initializeMap(){
		let request = new XMLHttpRequest();
	 	request.onreadystatechange = function() {
	    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
	        let data = JSON.parse(this.responseText);
			for (let i = 0; i < data.length; i++) {
				if (data[i].status == "CLOSED") {
					let redMarker = L.marker([data[i].position.lat, data[i].position.lng], {icon: veloIconClosed}).addTo(mymap);
					redMarker.addEventListener("click", function(){
						redMarker.bindPopup("<p> Station fermé </p>").openPopup();
					})

				}
				if (data[i].status == "OPEN"){
					let marker = L.marker([data[i].position.lat, data[i].position.lng], {icon: veloIcon}).addTo(mymap);
					
					marker.addEventListener("click", function() {
					bookingWindow.style.visibility = "visible";
					let splitName = data[i].name.split('-');
					stationName.innerHTML = splitName[1];
					stationAdress.innerHTML = data[i].address;
					bikeStands.innerHTML = data[i].bike_stands;
					availableBikes.innerHTML = data[i].available_bikes;
					})
				}

		}	
	    }
	};
	request.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=b8f782763792b84c62a3fb9a96eeb40eff4e1540");
	request.send();

	};



	function initializeForm(){
		
		bookingWindow.style.visibility = "hidden";

		setValues(nom, prenom);

		submit.addEventListener("click", function(e){
			e.preventDefault();
			if (nom.value == "" || prenom.value=="") {
				errorMessage.innerHTML = "Veuiller renseigner votre nom et votre prenom"
				errorMessage.style.display = "block";
				return;
			}
			saveData(nom, prenom);
			errorMessage.style.display = "none";
			document.getElementById("canvas-block").style.visibility = "visible";

		})


	}

	function saveData(nom, prenom){
		window.localStorage.setItem("nom", nom.value);
		window.localStorage.setItem("prenom", prenom.value);
	}

	function setValues(nom, prenom){
		nom.value = window.localStorage.getItem("nom");
		prenom.value = window.localStorage.getItem("prenom");
	}

	function initializeCanvas(){
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
		
		
		canv.addEventListener("mousedown", function(){
			isMouseDown = true;
		})

		canv.addEventListener("mouseup", function(){
			isMouseDown = false;
			ctx.beginPath();
			//coords.push("mouseup");
		})

		canv.addEventListener("mousemove", function(e){
			if (isMouseDown) {
				coords.push([e.offsetX, e.offsetY]);
			}
		})


		
		canv.addEventListener('mousemove', function(e){
			
			if (isMouseDown) {

				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(e.offsetX, e.offsetY, 2, 0, Math.PI * 2);
				ctx.fill();

				ctx.beginPath();
				ctx.moveTo(e.offsetX, e.offsetY);
		}
			
		});
		validateCanvBtn.addEventListener("click", function(){
			book(coords);
		});

		clearCanvBtn.addEventListener("click", function(){
			clearCanvas(canv, ctx, coords);
		});
	}

	function clearCanvas(canv, ctx, coords){
		if(coords.length){
			ctx.clearRect(0,0,canv.width,canv.height);
			ctx.fillText("Votre signature", 0, 20)
			coords.length = 0;
			ctx.beginPath();	
		}
		
	}

	function book(coords){
		errorMessage.style.display = "none";
		if(coords.length<10){
			errorMessage.innerHTML = "Veuillez renseigner votre signature";
			errorMessage.style.display = "block";
			return;
		}
		
		bookingStatus.style.visibility = "visible";

		if (availableBikes.innerHTML<=0){
			errorMessage.innerHTML = "Désolé, il n'y a plus de vélos disponibles à cette station";
			errorMessage.style.display = "block";
			return;
		}
		
		window.sessionStorage.setItem("reservation", JSON.stringify({
			nom : nom.value,
			prenom: prenom.value,
			station: stationName.innerHTML,
			signature: coords,
			}));

		let stationBooked = JSON.parse(sessionStorage.getItem("reservation")).station;

		if (stationNameBooked.innerHTML == stationBooked) {
			errorMessage.innerHTML = "Vélo est déjà reservé à cette station";
			errorMessage.style.display = "block";
			return;
		};

		stationNameBooked.innerHTML = stationBooked;
		availableBikes.innerHTML -= 1;
		
		timer(0, 60);
		
	}

	function timer(minutes, seconds){
		
		let currentStation = stationName.innerHTML;
		let countDown = setInterval(function(){
			
			if (seconds == 0) {
				minutes-=1;
				seconds = 60;
			}
			seconds-=1;

			if (minutes == 0 && seconds==0) {
				
				clearInterval(countDown);
				clearBooking();

			} else if (currentStation!=stationNameBooked.innerHTML
							&& availableBikes.innerHTML!=0) {

					clearInterval(countDown);

				}
			
			if (minutes<10 && seconds<10) {
				document.getElementById("timer").innerHTML = "0" + minutes + ":0" + seconds;
			} else if (seconds<10) {
				document.getElementById("timer").innerHTML = minutes + ":0" + seconds;
			} else {
				document.getElementById("timer").innerHTML = minutes + ":" + seconds;
			}
			
			

		}, 1000 );

		cancelBtn.addEventListener("click", function(){
			clearBooking();
		});
		
		function clearBooking(){
			sessionStorage.clear();
			alert("Votre reservation est annulé");
			bookingStatus.style.visibility = "hidden";
			stationNameBooked.innerHTML = " "
			//availableBikes.innerHTML = parseInt(availableBikes.innerHTML, 10) + 1;

		}


	}


		
	
 	
	

}
	/*submit.addEventListener("submit", function(event){
		event.preventDefault();
		alert(213);
	})*/
 


	
	

//