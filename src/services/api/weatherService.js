import weatherData from "@/services/mockData/weather.json";

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