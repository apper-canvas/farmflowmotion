import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ icon, title, value, subtitle, trend, className = "" }) => {
  return (
    <Card className={`bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-full">
            <ApperIcon name={icon} size={24} className="text-primary-600" />
          </div>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}>
              <ApperIcon 
                name={trend.positive ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className="mr-1" 
              />
              {trend.value}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;