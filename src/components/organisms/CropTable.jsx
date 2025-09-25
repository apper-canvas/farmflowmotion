import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const CropTable = ({ crops, onEdit, onDelete }) => {
  const getStatusBadge = (crop) => {
    const today = new Date();
    const plantingDate = new Date(crop.plantingDate);
    const harvestDate = new Date(crop.expectedHarvest);
    const daysToHarvest = differenceInDays(harvestDate, today);
    
    if (crop.status === "harvested") {
      return <Badge variant="success">Harvested</Badge>;
    } else if (daysToHarvest < 0) {
      return <Badge variant="warning">Overdue</Badge>;
    } else if (daysToHarvest <= 7) {
      return <Badge variant="warning">Ready Soon</Badge>;
    } else if (daysToHarvest <= 30) {
      return <Badge variant="info">Growing</Badge>;
    } else {
      return <Badge variant="default">Planted</Badge>;
    }
  };

  if (crops.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="Wheat" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No crops planted yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Wheat" size={20} className="text-primary-600" />
          Crop Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farm
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planted
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Harvest
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crops.map((crop) => (
                <tr key={crop.Id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                      <div className="text-sm text-gray-500">{crop.variety}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{crop.farmName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(crop.plantingDate), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{crop.area} acres</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(crop)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(crop)}
                        className="h-8 w-8 p-0"
                      >
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(crop.Id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropTable;