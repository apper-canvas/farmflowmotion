import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather, forecast }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      partly_cloudy: "CloudSun"
    };
    return iconMap[condition] || "Sun";
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <ApperIcon name="CloudSun" size={20} />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weather && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-blue-900">{weather.temperature}°</p>
                <p className="text-blue-700 font-medium capitalize">{weather.condition}</p>
                <p className="text-sm text-blue-600">{weather.location}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-4 rounded-full">
                <ApperIcon 
                  name={getWeatherIcon(weather.condition)} 
                  size={32} 
                  className="text-blue-700" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <ApperIcon name="Droplets" size={16} className="text-blue-600 mx-auto mb-1" />
                <p className="font-medium text-blue-800">{weather.humidity}%</p>
                <p className="text-blue-600">Humidity</p>
              </div>
              <div className="text-center">
                <ApperIcon name="Wind" size={16} className="text-blue-600 mx-auto mb-1" />
                <p className="font-medium text-blue-800">{weather.windSpeed} mph</p>
                <p className="text-blue-600">Wind</p>
              </div>
              <div className="text-center">
                <ApperIcon name="Gauge" size={16} className="text-blue-600 mx-auto mb-1" />
                <p className="font-medium text-blue-800">{weather.pressure} mb</p>
                <p className="text-blue-600">Pressure</p>
              </div>
            </div>
          </div>
        )}

        {forecast && forecast.length > 0 && (
          <div className="border-t border-blue-200 pt-4">
            <h4 className="font-semibold text-blue-800 mb-3">3-Day Forecast</h4>
            <div className="space-y-2">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <ApperIcon 
                      name={getWeatherIcon(day.condition)} 
                      size={16} 
                      className="text-blue-600" 
                    />
                    <span className="font-medium text-blue-800">{day.day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-700">{day.high}°</span>
                    <span className="text-blue-500">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;