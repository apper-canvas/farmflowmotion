import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CropForm = ({ crop, farms, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    name: "",
    variety: "",
    plantingDate: "",
    expectedHarvest: "",
    area: "",
    status: "planted"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (crop && isEdit) {
      setFormData({
        farmId: crop.farmId || "",
        name: crop.name || "",
        variety: crop.variety || "",
        plantingDate: crop.plantingDate ? format(new Date(crop.plantingDate), "yyyy-MM-dd") : "",
        expectedHarvest: crop.expectedHarvest ? format(new Date(crop.expectedHarvest), "yyyy-MM-dd") : "",
        area: crop.area?.toString() || "",
        status: crop.status || "planted"
      });
    }
  }, [crop, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmId) {
      newErrors.farmId = "Farm selection is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Crop name is required";
    }

    if (!formData.variety.trim()) {
      newErrors.variety = "Variety is required";
    }

    if (!formData.plantingDate) {
      newErrors.plantingDate = "Planting date is required";
    }

    if (!formData.expectedHarvest) {
      newErrors.expectedHarvest = "Expected harvest date is required";
    }

    if (formData.plantingDate && formData.expectedHarvest) {
      if (new Date(formData.expectedHarvest) <= new Date(formData.plantingDate)) {
        newErrors.expectedHarvest = "Harvest date must be after planting date";
      }
    }

    if (!formData.area || formData.area <= 0) {
      newErrors.area = "Area must be greater than 0";
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

    const cropData = {
      ...formData,
      area: parseFloat(formData.area),
      plantingDate: new Date(formData.plantingDate).toISOString(),
      expectedHarvest: new Date(formData.expectedHarvest).toISOString(),
      ...(isEdit ? { Id: crop.Id } : {})
    };

    onSubmit(cropData);
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
          <ApperIcon name="Wheat" size={20} className="text-primary-600" />
          {isEdit ? "Edit Crop" : "Add New Crop"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Crop Name"
              required
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="e.g., Corn, Wheat, Soybeans"
              error={errors.name}
            />

            <FormField
              label="Variety"
              required
              value={formData.variety}
              onChange={handleChange("variety")}
              placeholder="e.g., Sweet Corn, Winter Wheat"
              error={errors.variety}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Planting Date"
              type="date"
              required
              value={formData.plantingDate}
              onChange={handleChange("plantingDate")}
              error={errors.plantingDate}
            />

            <FormField
              label="Expected Harvest"
              type="date"
              required
              value={formData.expectedHarvest}
              onChange={handleChange("expectedHarvest")}
              error={errors.expectedHarvest}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Area (acres)"
              type="number"
              required
              value={formData.area}
              onChange={handleChange("area")}
              placeholder="0"
              min="0.1"
              step="0.1"
              error={errors.area}
            />

            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={handleChange("status")}
            >
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready for Harvest</option>
              <option value="harvested">Harvested</option>
            </FormField>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button type="submit" className="flex-1">
            <ApperIcon name="Save" size={16} className="mr-2" />
            {isEdit ? "Update Crop" : "Add Crop"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CropForm;