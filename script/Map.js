class Map {
	constructor() {
		this.mymap = L.map('map').setView([47.2173295, -1.5489631], 15);
 		this.initializeMap(this.mymap);

		this.veloIconClosed = L.icon({
			    	iconUrl: 'icon-red.png',
			    	iconSize:     [32, 50], 
			    	className: 'marker', 
				});
		this.veloIcon = L.icon({
					iconUrl: 'icon.png',
					iconSize:     [32, 50], 
					className: 'marker', 
					});
		
		this.initializeStations(this.mymap, this.veloIcon, this.veloIconClosed);

	}

	//Initialization de l'API openstreetmap
	initializeMap(mymap){
		L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   	 		maxZoom: 18,
    		id: 'mapbox/streets-v11',
    		accessToken: 'pk.eyJ1IjoibWFyZ2FyaXRhc2F2IiwiYSI6ImNrM2VnOTB4cjA3dmMzbW16bHg4MWxkZ2QifQ.fu5kmulnXnD7SRsIF2d0tA'
		}).addTo(this.mymap);
	}
	
	//Reception des données 
	 initializeStations(mymap, veloIcon, veloIconClosed){
		const requestURL = "https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey=b8f782763792b84c62a3fb9a96eeb40eff4e1540";
		this.sendRequest("GET", requestURL).then((data) => {
			let bookingWindow = document.getElementById("book");
			for (let i = 0; i < data.length; i++) {
				if (data[i].status == "CLOSED") {
					console.log(i + "closed")
					let redMarker = L.marker([data[i].position.lat, data[i].position.lng], {icon: veloIconClosed}).addTo(mymap);
					redMarker.addEventListener("click", () => {
						redMarker.bindPopup("<p> Station fermé </p>").openPopup();
					})
				}
				if (data[i].status == "OPEN"){
					let station = new Station();
					let marker = L.marker([data[i].position.lat, data[i].position.lng], {icon: veloIcon}).addTo(mymap);
					
					marker.addEventListener("click", () => {
					bookingWindow.style.display = "block";
					let splitName = data[i].name.split('-');
					station.getInfo(splitName[1], data[i].address, data[i].bike_stands, data[i].available_bikes)
					station.saveInfo(splitName[1], data[i].address, data[i].available_bikes)
					window.scrollBy(0, window.innerHeight);
					})
				}
			}
		}
			).catch(err => console.log(err));    
	};


	sendRequest(method, requestURL){
		return new Promise ((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open(method, requestURL);
			request.onload = () =>{
				if (request.status == 200){
					resolve(JSON.parse(request.response));
				} else {
					reject (request.response);
				}
			}
			request.send();
		})
	}

}
