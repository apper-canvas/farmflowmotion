// Inline weather data to resolve missing file dependency
const weatherData = {
  current: {
    temperature: 22,
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    windDirection: "SW",
    condition: "Partly Cloudy",
    icon: "partly-cloudy-day",
    visibility: 10,
    uvIndex: 6,
    feelsLike: 24
  },
  forecast: [
    {
      date: "2024-01-15",
      day: "Today",
      high: 25,
      low: 18,
      condition: "Partly Cloudy",
      icon: "partly-cloudy-day",
      humidity: 65,
      windSpeed: 12,
      precipitation: 10
    },
    {
      date: "2024-01-16", 
      day: "Tomorrow",
      high: 28,
      low: 20,
      condition: "Sunny",
      icon: "clear-day",
      humidity: 55,
      windSpeed: 8,
      precipitation: 0
    },
    {
      date: "2024-01-17",
      day: "Wednesday", 
      high: 26,
      low: 19,
      condition: "Cloudy",
      icon: "cloudy",
      humidity: 70,
      windSpeed: 15,
      precipitation: 25
    },
    {
      date: "2024-01-18",
      day: "Thursday",
      high: 23,
      low: 16,
      condition: "Light Rain",
      icon: "rain",
      humidity: 80,
      windSpeed: 18,
      precipitation: 65
    },
    {
      date: "2024-01-19",
      day: "Friday",
      high: 27,
      low: 21,
      condition: "Partly Cloudy", 
      icon: "partly-cloudy-day",
      humidity: 60,
      windSpeed: 10,
      precipitation: 15
    }
  ],
  location: {
    name: "Farm Location",
    region: "Agricultural District",
    country: "Country",
    lat: -25.7461,
    lon: 28.1881
  }
};

class WeatherService {
  constructor() {
    this.weather = { ...weatherData };
  }

  async getCurrent() {
    await this.delay();
    return { ...this.weather.current };
  }

  async getForecast() {
    await this.delay();
    return [...this.weather.forecast];
  }

  async getWeatherData() {
    await this.delay();
    return {
      current: { ...this.weather.current },
      forecast: [...this.weather.forecast]
    };
  }

  async getWeatherSummary(location) {
    await this.delay();
    const current = this.weather.current;
    
    // Map weather conditions to appropriate icons
    const getWeatherIcon = (condition) => {
      const conditionLower = condition.toLowerCase();
      if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return 'Sun';
      if (conditionLower.includes('cloud')) return 'Cloud';
      if (conditionLower.includes('rain')) return 'CloudRain';
      if (conditionLower.includes('storm')) return 'CloudLightning';
      if (conditionLower.includes('snow')) return 'CloudSnow';
      if (conditionLower.includes('fog')) return 'CloudFog';
      return 'Sun'; // default
    };

// Generate comprehensive weather summary
    const generateSummary = (temp, condition) => {
      const tempDesc = temp >= 75 ? 'warm' : temp >= 60 ? 'comfortable' : temp >= 45 ? 'cool' : 'cold';
      const conditionLower = condition.toLowerCase();
      
      if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
        return `Pleasant ${condition.toLowerCase()} day with ${tempDesc} temperatures`;
      } else if (conditionLower.includes('cloud')) {
        return `${condition} conditions with ${tempDesc} temperatures and light winds`;
      } else if (conditionLower.includes('rain')) {
        return `${condition} weather with ${tempDesc} temperatures - good day for indoor activities`;
      } else if (conditionLower.includes('storm')) {
        return `${condition} conditions with ${tempDesc} temperatures - stay indoors and safe`;
      } else {
        return `${condition} weather with ${tempDesc} temperatures`;
      }
    };

    return {
      temperature: current.temperature,
      condition: current.condition,
      icon: getWeatherIcon(current.condition),
      location: location,
      summary: generateSummary(current.temperature, current.condition)
    };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export default new WeatherService();