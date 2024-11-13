const weatherform=document.querySelector(".weatherform");
const cityinput=document.querySelector(".cityinput");
const card=document.querySelector(".card");
const apiKey="2801944ca20a5c09e25fa3de6459d636";

weatherform.addEventListener("submit", async event =>{
    event.preventDefault();
    const city=cityinput.value
    if(city){
        try{
            const weatherData= await getWeatherData(city);
            displayWeatherInfo(weatherData);

        }
        catch(error){
            console.error(error);
            displayError(error);
  
        }

    }
    else{
        displayError("Please Enter A City");
    }

});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response= await fetch(apiUrl);
    if(!response.ok){
        throw new Error("Could Not Fetch Weather Data");
    }
    return await response.json();
   
}

function displayWeatherInfo(data){
    console.log(data)
    const forecastList = data.list; 
    const now = new Date();
    const endTime = new Date(now.getTime() + 120 * 60 * 60 * 1000); // 120 hours in milliseconds

    const nextTwoDaysForecast = forecastList.filter(entry => {
    const forecastDate = new Date(entry.dt_txt);
            return forecastDate <= endTime;
            });

            
            nextTwoDaysForecast.forEach(({ dt_txt: date, main: { temp, humidity }, weather }) => {
                
                const forecastData=[{ date: `${date}`, temp: `${temp}`, humidity: `${humidity}`, description: `${weather[0].description}`}];
                function createForecastCard({ date, temp, humidity, description }) {
                    const card = document.createElement('div');
                    card.className = 'forecast-card';
                    card.textContent="";
                    card.style.display= "flex";
                    
                    card.innerHTML = `
                        <div class="forecast-date">${new Date(date).toLocaleString()}</div>
                        <div class="forecast-temp">${(temp-273.15).toFixed(1)}°C</div>
                        <div class="forecast-info">Humidity: ${humidity}%</div>
                        <div class="forecast-info">${description}</div>
                    `;
                    return card;
                }
                
                
                const forecastContainer = document.getElementById('forecastContainer');
                forecastData.forEach(data => {
                    const card = createForecastCard(data);
                    forecastContainer.appendChild(card);
                    
                    
                });
                
            });
}
