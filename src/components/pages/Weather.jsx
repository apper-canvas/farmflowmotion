import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    current: null,
    forecast: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeatherData = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await weatherService.getWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

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

  const getWeatherAdvice = (weather, forecast) => {
    if (!weather || !forecast) return [];

    const advice = [];
    
    // Temperature-based advice
    if (weather.temperature > 85) {
      advice.push({
        type: "warning",
        icon: "Thermometer",
        title: "High Temperature Alert",
        message: "Consider increasing irrigation and checking livestock water supplies."
      });
    } else if (weather.temperature < 35) {
      advice.push({
        type: "warning",
        icon: "Snowflake",
        title: "Frost Warning",
        message: "Protect sensitive crops and ensure livestock have adequate shelter."
      });
    }

    // Rain prediction
    const rainyDays = forecast.filter(day => day.condition === "rainy" || day.condition === "stormy");
    if (rainyDays.length > 0) {
      advice.push({
        type: "info",
        icon: "CloudRain",
        title: "Rain Expected",
        message: "Plan indoor activities and check drainage systems. Adjust irrigation schedules."
      });
    }

    // Wind conditions
    if (weather.windSpeed > 20) {
      advice.push({
        type: "warning",
        icon: "Wind",
        title: "High Wind Advisory",
        message: "Secure loose equipment and postpone spraying applications."
      });
    }

    // Humidity conditions
    if (weather.humidity > 80) {
      advice.push({
        type: "info",
        icon: "Droplets",
        title: "High Humidity",
        message: "Monitor crops for fungal diseases and ensure good air circulation."
      });
    }

    // Default advice if no specific conditions
    if (advice.length === 0) {
      advice.push({
        type: "success",
        icon: "CheckCircle",
        title: "Good Conditions",
        message: "Weather conditions are favorable for most farm activities."
      });
    }

    return advice;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadWeatherData} />;
  }

  const advice = getWeatherAdvice(weatherData.current, weatherData.forecast);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          Weather Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Current conditions and forecast for your farming operations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <ApperIcon name="CloudSun" size={20} />
                Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherData.current && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Main Weather Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-blue-900 mb-2">
                        {weatherData.current.temperature}°F
                      </p>
                      <p className="text-xl text-blue-700 font-medium capitalize mb-1">
                        {weatherData.current.condition.replace("_", " ")}
                      </p>
                      <p className="text-blue-600">{weatherData.current.location}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-6 rounded-full">
                      <ApperIcon 
                        name={getWeatherIcon(weatherData.current.condition)} 
                        size={48} 
                        className="text-blue-700" 
                      />
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-4 rounded-lg text-center">
                      <ApperIcon name="Droplets" size={24} className="text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{weatherData.current.humidity}%</p>
                      <p className="text-sm text-blue-600">Humidity</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg text-center">
                      <ApperIcon name="Wind" size={24} className="text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{weatherData.current.windSpeed} mph</p>
                      <p className="text-sm text-blue-600">Wind Speed</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg text-center col-span-2">
                      <ApperIcon name="Gauge" size={24} className="text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{weatherData.current.pressure} mb</p>
                      <p className="text-sm text-blue-600">Pressure</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extended Forecast */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" size={20} className="text-primary-600" />
                3-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg text-center">
                    <p className="font-semibold text-gray-900 mb-2">{day.day}</p>
                    <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <ApperIcon 
                        name={getWeatherIcon(day.condition)} 
                        size={24} 
                        className="text-blue-700" 
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">{day.high}°</span>
                        <span className="text-lg text-gray-600">{day.low}°</span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">
                        {day.condition.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farming Advice */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Lightbulb" size={20} className="text-primary-600" />
                Farming Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advice.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      item.type === "warning" 
                        ? "bg-yellow-50 border-yellow-200" 
                        : item.type === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        item.type === "warning" 
                          ? "bg-yellow-200" 
                          : item.type === "success"
                          ? "bg-green-200"
                          : "bg-blue-200"
                      }`}>
                        <ApperIcon 
                          name={item.icon} 
                          size={16} 
                          className={
                            item.type === "warning" 
                              ? "text-yellow-700" 
                              : item.type === "success"
                              ? "text-green-700"
                              : "text-blue-700"
                          } 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          item.type === "warning" 
                            ? "text-yellow-800" 
                            : item.type === "success"
                            ? "text-green-800"
                            : "text-blue-800"
                        }`}>
                          {item.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          item.type === "warning" 
                            ? "text-yellow-700" 
                            : item.type === "success"
                            ? "text-green-700"
                            : "text-blue-700"
                        }`}>
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="BarChart3" size={20} className="text-primary-600" />
                Weather Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">UV Index</span>
                  <span className="font-semibold">Moderate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Visibility</span>
                  <span className="font-semibold">10 miles</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sunrise</span>
                  <span className="font-semibold">6:42 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sunset</span>
                  <span className="font-semibold">7:28 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Weather;