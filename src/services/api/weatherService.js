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

  delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export default new WeatherService();