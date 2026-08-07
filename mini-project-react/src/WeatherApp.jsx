import { useState } from 'react';
import InfoBox from './InfoBox';
import SearchBox from './SearchBox';

export default function WeatherApp(){
    const [weatherInfo,setWeatherInfo]=useState({
        city:"wanderland",
        feelsLike:26.5,
        temp:25.68,
        humidity:84,
        tempMax:25.68,
        tempMin:25.68,
        weather:"scattered clouds",  
    
    });
    let updateInfo=(newInfo)=>{
        setWeatherInfo(newInfo);
    }
      return (
       <div style={{textAlign:"center"}}>
         <h2>Weather App By Nitesh</h2>
         
         <SearchBox updateInfo={updateInfo}/>
         <InfoBox info={weatherInfo}/>
     </div>
    )
}