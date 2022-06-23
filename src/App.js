import './App.css';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TemperatureAndDetails from './components/TemperatureAndDetails';
import Forecast from './components/Forecast';
import getFormatedWeatherData from './services/weatherService';
import { useState } from 'react';
import { useEffect } from 'react';
/* eslint-disable import/first */

function App() {

  const [query, setQuery] = useState();
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormatedWeatherData({ ...query, units }).then((data) => {
        setWeather(data);
      });
    };

    fetchWeather();
  }, [query, units]);

  const changeBackground = () => {
    if(!weather) return 'bg-gradient-to-br from-slate-500 to-yellow-100'
    if(weather["details"]==="Clear"){
      return 'bg-gradient-to-r from-sky-400 to-blue-500'
    }
    if(weather["details"]==="Clouds"){
      return 'bg-gradient-to-tl from-gray-400 via-gray-600 to-blue-800'
    }
    if(weather["details"]==="Mist"||weather["details"]==="Rain"){
      return 'bg-gradient-to-br from-gray-900 to-gray-600 bg-gradient-to-r'
    }

    
  }



  console.log(weather)
  return (
    <div className={`rounded-md mx-auto max-w-screen-md mt-4 mb-4 py-5 px-32 ${changeBackground()} shadow-gray-600 `}>
      <TopButtons setQuery={setQuery}/>
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits}/>

      {weather && (
        <div>
        <TimeAndLocation weather={weather}/>
        <TemperatureAndDetails weather={weather}/>
        <Forecast title="hourly forecast" items={weather.hourly}/>
        <Forecast title="daily forecast" items={weather.daily}/>
        </div>
      )}
    </div>
  );
}






export default App;
