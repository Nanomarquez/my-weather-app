/* eslint-disable import/first */
const API_KEY = "0fe403b914cbf12e695f0332de6a9918";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
import DateTime from "luxon/src/datetime";

const getWeatherData = async (infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({...searchParams, appid:API_KEY});

    return fetch(url)
    .then((res)=>res.json())
};

const formatCurrentWeather = async (data) =>{
    
     const {
        coord: {lon,lat},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
     } = data
    
    const {main: details, icon} = weather[0]

     return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, country, sunrise, sunset, weather, details, icon, speed}
}

const formatForecastWeather = async (data) =>{
    let {timezone, daily, hourly} = data;
    daily = daily.slice(1,6).map(d =>{
        return{
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon 
        }
    });
    hourly = hourly.slice(1,6).map(d =>{
        return{
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon 
        }
    });

    return { timezone, daily, hourly};
}

const getFormatedWeatherData = async (searchParams) => {
    const formatedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather);

    const {lat,lon} = formatedCurrentWeather

    const formatedForecastWeather = await getWeatherData('onecall', {
        lat, lon, exclude: 'current,minutely,alerts', units: searchParams.units
    }).then(formatForecastWeather)

    return {...formatedCurrentWeather, ...formatedForecastWeather}
}

const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => {
    if(code==="01d"){
        return `https://developer.accuweather.com/sites/default/files/01-s.png`
    }
    else if(code==="01n"){
        return `https://developer.accuweather.com/sites/default/files/33-s.png`
    }
    else if(code==="02d"){
        return `https://developer.accuweather.com/sites/default/files/06-s.png`
    }
    else if(code==="02n"){
        return `https://developer.accuweather.com/sites/default/files/38-s.png`
    }
    else if(code==="03d"){
        return `https://developer.accuweather.com/sites/default/files/07-s.png`
    }
    else if(code==="03n"){
        return `https://developer.accuweather.com/sites/default/files/08-s.png`
    }
    else if(code==="04d"||code==="04n"){
        return `https://developer.accuweather.com/sites/default/files/08-s.png`
    }
    else if(code==="09d"||code==="09n"){
        return `https://developer.accuweather.com/sites/default/files/12-s.png`
    }
    else if(code==="10d"){
        return `https://developer.accuweather.com/sites/default/files/14-s.png`
    }
    else if(code==="10n"){
        return `https://developer.accuweather.com/sites/default/files/39-s.png`
    }
    else if(code==="11d"){
        return `https://developer.accuweather.com/sites/default/files/16-s.png`
    }
    else if(code==="11n"){
        return `https://developer.accuweather.com/sites/default/files/42-s.png`
    }
}


export default getFormatedWeatherData;
export {formatToLocalTime, iconUrlFromCode};

