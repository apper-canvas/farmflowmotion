import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const FarmForm = ({ farm, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    soilType: "loam"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farm && isEdit) {
      setFormData({
        name: farm.name || "",
        location: farm.location || "",
        size: farm.size?.toString() || "",
        soilType: farm.soilType || "loam"
      });
    }
  }, [farm, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Farm name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.size || formData.size <= 0) {
      newErrors.size = "Size must be greater than 0";
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

    const farmData = {
      ...formData,
      size: parseFloat(formData.size),
      ...(isEdit ? { Id: farm.Id } : {})
    };

    onSubmit(farmData);
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
          <ApperIcon name="MapPin" size={20} className="text-primary-600" />
          {isEdit ? "Edit Farm" : "Add New Farm"}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <FormField
            label="Farm Name"
            required
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter farm name"
            error={errors.name}
          />

          <FormField
            label="Location"
            required
            value={formData.location}
            onChange={handleChange("location")}
            placeholder="City, State or Address"
            error={errors.location}
          />

          <FormField
            label="Size (acres)"
            type="number"
            required
            value={formData.size}
            onChange={handleChange("size")}
            placeholder="0"
            min="0.1"
            step="0.1"
            error={errors.size}
          />

          <FormField
            label="Soil Type"
            type="select"
            value={formData.soilType}
            onChange={handleChange("soilType")}
          >
            <option value="clay">Clay</option>
            <option value="loam">Loam</option>
            <option value="sandy">Sandy</option>
            <option value="silt">Silt</option>
            <option value="rocky">Rocky</option>
            <option value="peat">Peat</option>
          </FormField>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button type="submit" className="flex-1">
            <ApperIcon name="Save" size={16} className="mr-2" />
            {isEdit ? "Update Farm" : "Create Farm"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FarmForm;