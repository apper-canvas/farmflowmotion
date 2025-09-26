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

    return {
      temperature: current.temperature,
      condition: current.condition,
      icon: getWeatherIcon(current.condition),
      location: location
    };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export default new WeatherService();