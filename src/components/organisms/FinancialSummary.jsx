import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";

const FinancialSummary = ({ transactions }) => {
  const summary = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      totalProfit: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyProfit: monthlyIncome - monthlyExpenses
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return {
      series: Object.values(expensesByCategory),
      labels: Object.keys(expensesByCategory)
    };
  }, [transactions]);

  const chartOptions = {
    chart: {
      type: "donut",
      height: 300,
      toolbar: { show: false }
    },
    labels: categoryData.labels,
    colors: ["#2d5a27", "#8b4513", "#ff8c00", "#28a745", "#ffc107", "#17a2b8"],
    legend: {
      position: "bottom",
      fontSize: "12px"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Expenses",
              formatter: () => `$${summary.totalExpenses.toLocaleString()}`
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Income</p>
                <p className="text-2xl font-bold text-green-900">
                  ${summary.totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-200 to-green-300 p-3 rounded-full">
                <ApperIcon name="TrendingUp" size={24} className="text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900">
                  ${summary.totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-200 to-red-300 p-3 rounded-full">
                <ApperIcon name="TrendingDown" size={24} className="text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${
          summary.totalProfit >= 0 
            ? "from-blue-50 to-blue-100 border-blue-200" 
            : "from-red-50 to-red-100 border-red-200"
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  summary.totalProfit >= 0 ? "text-blue-700" : "text-red-700"
                }`}>
                  Net Profit
                </p>
                <p className={`text-2xl font-bold ${
                  summary.totalProfit >= 0 ? "text-blue-900" : "text-red-900"
                }`}>
                  ${summary.totalProfit.toLocaleString()}
                </p>
              </div>
              <div className={`bg-gradient-to-br p-3 rounded-full ${
                summary.totalProfit >= 0 
                  ? "from-blue-200 to-blue-300" 
                  : "from-red-200 to-red-300"
              }`}>
                <ApperIcon 
                  name={summary.totalProfit >= 0 ? "DollarSign" : "Minus"} 
                  size={24} 
                  className={summary.totalProfit >= 0 ? "text-blue-700" : "text-red-700"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">This Month</p>
                <p className="text-2xl font-bold text-amber-900">
                  ${summary.monthlyProfit.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-200 to-amber-300 p-3 rounded-full">
                <ApperIcon name="Calendar" size={24} className="text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {categoryData.series.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="PieChart" size={20} className="text-primary-600" />
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={chartOptions}
              series={categoryData.series}
              type="donut"
              height={300}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialSummary;