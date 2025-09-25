import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const TaskForm = ({ task, farms, crops, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });

  const [errors, setErrors] = useState({});
  const [filteredCrops, setFilteredCrops] = useState([]);

  useEffect(() => {
    if (task && isEdit) {
      setFormData({
        farmId: task.farmId || "",
        cropId: task.cropId || "",
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        priority: task.priority || "medium"
      });
    }
  }, [task, isEdit]);

  useEffect(() => {
    if (formData.farmId) {
      const farmCrops = crops.filter(crop => crop.farmId === formData.farmId);
      setFilteredCrops(farmCrops);
      
      if (formData.cropId && !farmCrops.find(crop => crop.Id === formData.cropId)) {
        setFormData(prev => ({ ...prev, cropId: "" }));
      }
    } else {
      setFilteredCrops([]);
      setFormData(prev => ({ ...prev, cropId: "" }));
    }
  }, [formData.farmId, crops]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmId) {
      newErrors.farmId = "Farm selection is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
      cropId: formData.cropId || null,
      completed: task?.completed || false,
      ...(isEdit ? { Id: task.Id } : {})
    };

    onSubmit(taskData);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
          {isEdit ? "Edit Task" : "Add New Task"}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <FormField
            label="Farm"
            type="select"
            required
            value={formData.farmId}
            onChange={handleChange("farmId")}
            error={errors.farmId}
          >
            <option value="">Select a farm</option>
            {farms.map(farm => (
              <option key={farm.Id} value={farm.Id}>{farm.name}</option>
            ))}
          </FormField>

          <FormField
            label="Related Crop (Optional)"
            type="select"
            value={formData.cropId}
            onChange={handleChange("cropId")}
            disabled={!formData.farmId}
          >
            <option value="">Select a crop (optional)</option>
            {filteredCrops.map(crop => (
              <option key={crop.Id} value={crop.Id}>
                {crop.name} - {crop.variety}
              </option>
            ))}
          </FormField>

          <FormField
            label="Task Title"
            required
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="e.g., Water crops, Apply fertilizer, Check irrigation"
            error={errors.title}
          />

          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="Additional details about the task..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Due Date"
              type="date"
              required
              value={formData.dueDate}
              onChange={handleChange("dueDate")}
              error={errors.dueDate}
            />

            <FormField
              label="Priority"
              type="select"
              value={formData.priority}
              onChange={handleChange("priority")}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </FormField>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button type="submit" className="flex-1">
            <ApperIcon name="Save" size={16} className="mr-2" />
            {isEdit ? "Update Task" : "Add Task"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskForm;