import React, { useState } from 'react';

function FarmerInputPage({setPage}) {
  const [pincode, setPincode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cropType, setCropType] = useState('');
  const [soilType, setSoilType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [nitrogen, setNitrogen] = useState(0);
  const [phosphorus, setPhosphorus] = useState(0);
  const [potassium, setPotassium] = useState(0);
  const [soilPh, setSoilPh] = useState(6.0);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [averageTemperature, setAverageTemperature] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/get-weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode, startDate, endDate, cropType, soilType, farmSize }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocationData({ latitude: data.latitude, longitude: data.longitude });
        if (data.weatherData) {
          setWeatherData(data.weatherData);
          let totalTemperature = 0;
          let validDays = 0;
          for (const date in data.weatherData) {
            if (data.weatherData[date].temperature_2m_avg !== null) {
              totalTemperature += data.weatherData[date].temperature_2m_avg;
              validDays++;
            }
          }
          setAverageTemperature(validDays > 0 ? (totalTemperature / validDays).toFixed(2) : null);
        } else {
          setAverageTemperature(null);
        }
        setError(null);
      } else {
        throw new Error('Failed to fetch weather data.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError(error.message);
      setAverageTemperature(null);
      setLocationData(null);
    }
  };

  const fetchFertilizerRecommendation = async () => {
    try {
      if (!weatherData) {
        throw new Error('Weather data not available.');
      }
  
      // Structure the weather data arrays the backend expects
      const temperature_2m = [];
      const soil_moisture_1_to_3cm = [];
      const rain = [];
  
      for (const day in weatherData) {
        const dayData = weatherData[day];
        if (dayData.temperature_2m_avg !== null) temperature_2m.push(dayData.temperature_2m_avg);
        if (dayData.soil_moisture_1_to_3cm_avg !== null) soil_moisture_1_to_3cm.push(dayData.soil_moisture_1_to_3cm_avg);
        if (dayData.rain_sum !== null) rain.push(dayData.rain_sum);
      }
  
      const response = await fetch('http://localhost:3000/api/recommend-fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          soilType,
          cropType,
          farmSize: parseFloat(farmSize), // ensure it's a number
          nitrogen,
          phosphorus,
          potassium,
          soilPh,
          weatherData: {
            temperature_2m,
            soil_moisture_1_to_3cm,
            rain
          }
        }),
      });
  
      if (!response.ok) throw new Error('Failed to fetch fertilizer recommendation.');
  
      const data = await response.json();
      setRecommendation(data.recommendation);
      setError(null);
    } catch (error) {
      console.error('Error fetching fertilizer recommendation:', error);
      setError(error.message);
      setRecommendation(null);
    }
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pincode.trim() && startDate.trim() && endDate.trim()) {
      fetchWeatherData();
      fetchFertilizerRecommendation();
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 mt-60">Farmer Input</h2>
      <button
        onClick={() => setPage("LandingPage")}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        ⬅ Back
      </button>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Pincode</label>
          <input
            type="text"
            className="w-full border-gray-300 border rounded-md px-3 py-2"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            required
          />
        </div>
        <div className="mb-4">
  <label className="block text-gray-700">Crop Type</label>
  <select
    className="w-full border-gray-300 border rounded-md px-3 py-2"
    value={cropType}
    onChange={(e) => setCropType(e.target.value)}
    required
  >
    <option value="">Select Crop Type</option>
    <option value="Rice">Rice</option>
    <option value="Wheat">Wheat</option>
    <option value="Corn">Corn</option>
    <option value="Sugarcane">Sugarcane</option>
    <option value="Soybean">Soybean</option>
    <option value="Barley">Barley</option>
    <option value="Cotton">Cotton</option>
    <option value="Potato">Potato</option>
    <option value="Tomato">Tomato</option>
    <option value="Onion">Onion</option>

  </select>
</div>

<div className="mb-4">
  <label className="block text-gray-700">Soil Type</label>
  <select
    className="w-full border-gray-300 border rounded-md px-3 py-2"
    value={soilType}
    onChange={(e) => setSoilType(e.target.value)}
    required
  >
    <option value="">Select Soil Type</option>
    <option value="Sandy">Sandy</option>
    <option value="Loamy">Loamy</option>
    <option value="Clay">Clay</option>
    <option value="Silty">Silty</option>
    <option value="Peaty">Peaty</option>
  </select>
</div>

        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input
            type="date"
            className="w-full border-gray-300 border rounded-md px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input
            type="date"
            className="w-full border-gray-300 border rounded-md px-3 py-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
  <label className="block text-gray-700">Soil pH</label>
  <input
    type="number"
    step="0.1"
    min="0"
    max="14"
    className="w-full border-gray-300 border rounded-md px-3 py-2"
    value={soilPh}
    onChange={(e) => setSoilPh(parseFloat(e.target.value))}
    placeholder="Enter Soil pH (e.g., 6.0)"
    required
  />
</div>
<div className="mb-4">
  <label className="block text-gray-700">Soil Nutrient Values (N, P, K)</label>
  <div className="flex flex-wrap gap-4">
    <input
      type="number"
      step="1"
      className="w-full sm:w-1/3 border-gray-300 border rounded-md px-3 py-2"
      value={nitrogen}
      onChange={(e) => setNitrogen(parseInt(e.target.value))}
      placeholder="Nitrogen (N)"
      required
    />
    <input
      type="number"
      step="1"
      className="w-full sm:w-1/3 border-gray-300 border rounded-md px-3 py-2"
      value={phosphorus}
      onChange={(e) => setPhosphorus(parseInt(e.target.value))}
      placeholder="Phosphorus (P)"
      required
    />
    <input
      type="number"
      step="1"
      className="w-full sm:w-1/3 border-gray-300 border rounded-md px-3 py-2"
      value={potassium}
      onChange={(e) => setPotassium(parseInt(e.target.value))}
      placeholder="Potassium (K)"
      required
    />
  </div>
</div>

        <div className="mb-4">
          <label className="block text-gray-700">Farm Size (e.g., 1 hectare)</label>
          <input
            type="text"
            className="w-full border-gray-300 border rounded-md px-3 py-2"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            placeholder="Enter Farm Size"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md"
        >
          Recommendation
        </button>
      </form>
      

      {recommendation && (
        <div className="mt-4 p-4 bg-blue-200 rounded">
          <h3 className="text-lg font-bold">🌾 Fertilizer Recommendation</h3>
          <p><strong>Fertilizer:</strong> {recommendation.recommendedFertilizer}</p>
          <p><strong>Nitrogen:</strong> {recommendation.nitrogen} kg</p>
          <p><strong>Phosphorus:</strong> {recommendation.phosphorus} kg</p>
          <p><strong>Potassium:</strong> {recommendation.potassium} kg</p>
        </div>
      )}

      {error && <div className="mt-4 p-4 bg-red-200 rounded">{error}</div>}
    </div>
  );
}


export default FarmerInputPage;