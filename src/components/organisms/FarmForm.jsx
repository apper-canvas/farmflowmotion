import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

// Initialize Apper SDK safely
let apperClient = null;

// Safe SDK initialization
const initializeApperSDK = () => {
  try {
    if (window.ApperSDK?.ApperClient) {
      apperClient = new window.ApperSDK.ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      return true;
    }
  } catch (error) {
    console.error('Failed to initialize Apper SDK:', error);
  }
  return false;
};
const FarmForm = ({ farm, onSubmit, onCancel, isEdit = false }) => {
const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    soilType: "loam",
    weatherSummary: ""
  });
  const [isGeneratingWeather, setIsGeneratingWeather] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farm && isEdit) {
      setFormData({
        name: farm.name || "",
        location: farm.location || "",
        size: farm.size?.toString() || "",
soilType: farm.soilType || "loam",
        weatherSummary: farm.weatherSummary || ""
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
      weatherSummary: formData.weatherSummary.trim(),
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
const handleGenerateWeather = async () => {
    if (!formData.location.trim()) {
      toast.error('Please enter a location first');
      return;
    }

    // Initialize SDK if not already done
    if (!apperClient && !initializeApperSDK()) {
      toast.error('AI features are currently unavailable. Please try again later.');
      return;
    }

    setIsGeneratingWeather(true);
    try {
      const result = await apperClient.functions.invoke(import.meta.env.VITE_WEATHER_AI_GENERATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: formData.location })
      });

      const response = await result.json();
      
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          weatherSummary: response.data.weatherSummary
        }));
        toast.success('Weather summary generated successfully!');
      } else {
        toast.error(response.error || 'Failed to generate weather summary');
      }
    } catch (error) {
      toast.error('Failed to generate weather summary');
      console.error('Weather generation error:', error);
    } finally {
      setIsGeneratingWeather(false);
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

<FormField
            label="Weather Summary"
            error={errors.weatherSummary}
            icon="CloudRain"
            optional
          >
            <div className="space-y-3">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                rows={3}
                placeholder="Add weather information or conditions..."
                value={formData.weatherSummary}
                onChange={handleChange('weatherSummary')}
              />
<Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateWeather}
                disabled={isGeneratingWeather || !formData.location.trim()}
                className="flex items-center gap-2"
                title={!window.ApperSDK ? 'AI features loading...' : ''}
              >
                <ApperIcon name={isGeneratingWeather ? "Loader2" : "Sparkles"} size={16} className={isGeneratingWeather ? "animate-spin" : ""} />
                {isGeneratingWeather ? 'Generating...' : 'Generate AI'}
              </Button>
            </div>
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