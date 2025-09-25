import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const TaskItem = ({ task, onComplete, onEdit, onDelete }) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "default";
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      task.completed 
        ? "bg-gray-50 border-gray-200 opacity-75" 
        : "bg-white border-earth-200 hover:shadow-md"
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(task.Id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-300 hover:border-primary-500"
          }`}
        >
          {task.completed && <ApperIcon name="Check" size={12} className="text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-medium ${
              task.completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(task.priority)}>
                {task.priority}
              </Badge>
              {isOverdue && (
                <Badge variant="error">Overdue</Badge>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-2 ${
              task.completed ? "text-gray-400" : "text-gray-600"
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" size={14} />
                {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </div>
              {task.farmName && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" size={14} />
                  {task.farmName}
                </div>
              )}
              {task.cropName && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Wheat" size={14} />
                  {task.cropName}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onDelete(task.Id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;