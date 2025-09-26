import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FarmGrid = ({ farms, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {farms.map((farm) => (
        <Card key={farm.Id} className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="MapPin" size={18} className="text-primary-600" />
                {farm.name}
              </CardTitle>
              <Badge variant="primary">{farm.size} acres</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <ApperIcon name="MapPin" size={14} />
                <span className="text-sm">{farm.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ApperIcon name="Mountain" size={14} />
                <span className="text-sm capitalize">{farm.soilType} soil</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ApperIcon name="Calendar" size={14} />
                <span className="text-sm">
                  Added {new Date(farm.createdAt).toLocaleDateString()}
                </span>
              </div>
              {farm.weatherSummary && (
                <div className="flex items-center gap-2 text-gray-600 pt-2 border-t border-gray-100">
                  <ApperIcon name={farm.weatherSummary.icon} size={14} className="text-blue-500" />
                  <span className="text-sm font-medium">
                    {farm.weatherSummary.temperature}°F - {farm.weatherSummary.condition}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => onViewDetails(farm)}
                className="flex-1 flex items-center justify-center gap-1"
              >
                <ApperIcon name="Eye" size={14} />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(farm)}
                className="flex items-center justify-center gap-1"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(farm.Id)}
                className="flex items-center justify-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FarmGrid;