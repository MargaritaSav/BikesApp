class Booking {
	constructor(firstName, lastName, validityTime){
		this.lastName = lastName;
		this.firstName = firstName; 
		this.signature;
		this.timer = null;
		this.booking = null;
		this.validityTime = validityTime;

		this.bookingStatus = document.getElementById("status");
		this.timerField = document.getElementById("timer");
		this.stationNameBooked = document.getElementById("stationName");
		this.userInfo = document.getElementById("nomPrenom");
		this.cancelBtn = document.getElementById("cancel");

		this.cancelBtn.addEventListener("click", this.clearBooking.bind(this))
		
	}

	displayInfo(){	
		this.booking = JSON.parse(sessionStorage.getItem("BookedStation"))
		this.stationNameBooked.innerHTML = this.booking.name;
		this.userInfo.innerHTML = this.lastName + " " + this.firstName;
		this.bookingStatus.style.visibility = "visible"
		if(document.getElementById("available").innerHTML!=""){
			document.getElementById("available").innerHTML-=1;
		}
	}

	createBooking(){
		let date = new Date();
		this.booking = JSON.parse(sessionStorage.getItem("chosenStation"))
		this.booking.lastName = this.lastName;
		this.booking.firstName = this.firstName;
		this.booking.signature = this.signature;
		this.booking.reservationTime = date.getTime();
		window.sessionStorage.setItem("BookedStation", JSON.stringify(this.booking))
	}

	countDown(minutes){
		let comparedValue = this.booking.reservationTime;
		let reservationTime = minutes*60000;
		
		this.timer = setInterval(function() {
			let currentDate =  new Date;
			let temp = currentDate.getTime();
			
			let minutesLeft = Math.floor((reservationTime - (temp - comparedValue))/60000);
			let secondsLeft = Math.floor((reservationTime - (temp - comparedValue))/1000)%60;
					
			if (minutesLeft<10 && secondsLeft<10) {
				this.timerField.innerHTML = "0" + minutesLeft + ":0" + secondsLeft;
			} else if (minutesLeft<10){
				this.timerField.innerHTML = "0" + minutesLeft + ":" + secondsLeft;
			} else if (secondsLeft<10) {
				this.timerField.innerHTML = minutesLeft + ":0" + secondsLeft;
			} else {
				this.timerField.innerHTML = minutesLeft + ":" + secondsLeft;
			}

			if (comparedValue+reservationTime<=temp) {
				
				clearInterval(this.timer);
				this.clearBooking();
			} 
			
		}.bind(this), 1000);
}

	clearBooking(){
		sessionStorage.setItem("BookedStation", "Cette reservation est annulée");
		clearInterval(this.timer);
		
		document.getElementById("infoField").style.visibility = "hidden";
		this.timerField.innerHTML = "00:00"
		this.bookingStatus.style.visibility = "hidden";
		this.stationNameBooked.innerHTML = "";

		alert("Votre reservation est annulée");
	}
}


