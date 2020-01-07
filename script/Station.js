class Station {
	

	getInfo(stationNameValue, stationAdressValue, bikeStandsValue, availableBikesValue){
		let stationName = document.getElementById("name"),
		stationAdress = document.getElementById("adresse"),
		bikeStands = document.getElementById("places"),
		availableBikes = document.getElementById("available");
		
		stationName.innerHTML = stationNameValue;
		stationAdress.innerHTML = stationAdressValue;
		bikeStands.innerHTML = bikeStandsValue;
		availableBikes.innerHTML = availableBikesValue;
	}

	saveInfo(name, adress, availableBikes){
		window.sessionStorage.setItem("chosenStation", JSON.stringify({
			name : name,
			adress: adress,
			quantity: availableBikes,
			}))
		}
	
	
}