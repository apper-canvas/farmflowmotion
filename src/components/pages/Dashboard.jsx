import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import transactionService from "@/services/api/transactionService";
import weatherService from "@/services/api/weatherService";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    farms: [],
    crops: [],
    upcomingTasks: [],
    transactions: [],
    weather: null,
    forecast: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);

      const [farms, crops, upcomingTasks, transactions, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getUpcoming(5),
        transactionService.getAll(),
        weatherService.getWeatherData()
      ]);

      setDashboardData({
        farms,
        crops,
        upcomingTasks,
        transactions,
        weather: weatherData.current,
        forecast: weatherData.forecast
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateStats = () => {
    const totalFarms = dashboardData.farms.length;
    const totalCrops = dashboardData.crops.length;
    const activeTasks = dashboardData.upcomingTasks.filter(task => !task.completed).length;
    const totalIncome = dashboardData.transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = dashboardData.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    return {
      totalFarms,
      totalCrops,
      activeTasks,
      netProfit
    };
  };

  const getRecentCrops = () => {
    return dashboardData.crops
      .sort((a, b) => new Date(b.plantingDate) - new Date(a.plantingDate))
      .slice(0, 5);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const stats = calculateStats();
  const recentCrops = getRecentCrops();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Farm Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Overview of your farming operations and recent activity
          </p>
        </div>
        <Button
          onClick={() => navigate("/farms")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Farm
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="MapPin"
          title="Active Farms"
          value={stats.totalFarms}
          subtitle="Managed properties"
        />
        <StatCard
          icon="Wheat"
          title="Crops Planted"
          value={stats.totalCrops}
          subtitle="Current season"
        />
        <StatCard
          icon="CheckSquare"
          title="Pending Tasks"
          value={stats.activeTasks}
          subtitle="Need attention"
        />
        <StatCard
          icon="DollarSign"
          title="Net Profit"
          value={`$${stats.netProfit.toLocaleString()}`}
          subtitle="This year"
          trend={{
            positive: stats.netProfit >= 0,
            value: stats.netProfit >= 0 ? "Profitable" : "Loss"
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tasks and Crops */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
                  Upcoming Tasks
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/tasks")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming tasks</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/tasks")}
                    className="mt-2"
                  >
                    Add First Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.upcomingTasks.map((task) => (
                    <div key={task.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Calendar" size={14} />
                            {format(new Date(task.dueDate), "MMM dd")}
                          </div>
                          <div className="flex items-center gap-1">
                            <ApperIcon name="MapPin" size={14} />
                            {task.farmName}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === "high" ? "bg-red-100 text-red-700" :
                        task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Crops */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="Wheat" size={20} className="text-primary-600" />
                  Recent Plantings
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/crops")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentCrops.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Wheat" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No crops planted yet</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/crops")}
                    className="mt-2"
                  >
                    Add First Crop
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCrops.map((crop) => (
                    <div key={crop.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{crop.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Seedling" size={14} />
                            {crop.variety}
                          </div>
                          <div className="flex items-center gap-1">
                            <ApperIcon name="MapPin" size={14} />
                            {crop.farmName}
                          </div>
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Square" size={14} />
                            {crop.area} acres
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                        crop.status === "harvested" ? "bg-green-100 text-green-700" :
                        crop.status === "ready" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {crop.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Weather */}
        <div className="space-y-6">
          <WeatherCard
            weather={dashboardData.weather}
            forecast={dashboardData.forecast}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;