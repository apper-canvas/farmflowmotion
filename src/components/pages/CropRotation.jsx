import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import rotationService from "@/services/api/rotationService";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/useModal";
import { format, addMonths, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";

const CropRotation = () => {
  const [rotations, setRotations] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("calendar"); // calendar or list

  const addModal = useModal();
  const editModal = useModal();
  const [editingRotation, setEditingRotation] = useState(null);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [rotationsData, farmsData, cropsData] = await Promise.all([
        rotationService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);

      setRotations(rotationsData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError(`Failed to load rotation data: ${err.message}`);
      toast.error("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRotation = async (rotationData) => {
    try {
      const newRotation = await rotationService.create(rotationData);
      setRotations(prev => [...prev, newRotation]);
      addModal.closeModal();
      toast.success("Rotation plan added successfully!");
    } catch (err) {
      toast.error(`Failed to add rotation: ${err.message}`);
    }
  };

  const handleEditRotation = async (rotationData) => {
    try {
      const updatedRotation = await rotationService.update(editingRotation.Id, rotationData);
      setRotations(prev => prev.map(r => r.Id === editingRotation.Id ? updatedRotation : r));
      editModal.closeModal();
      setEditingRotation(null);
      toast.success("Rotation plan updated successfully!");
    } catch (err) {
      toast.error(`Failed to update rotation: ${err.message}`);
    }
  };

  const handleDeleteRotation = async (rotationId) => {
    if (!confirm("Are you sure you want to delete this rotation plan?")) {
      return;
    }

    try {
      await rotationService.delete(rotationId);
      setRotations(prev => prev.filter(r => r.Id !== rotationId));
      toast.success("Rotation plan deleted successfully!");
    } catch (err) {
      toast.error(`Failed to delete rotation: ${err.message}`);
    }
  };

  const openEditModal = (rotation) => {
    setEditingRotation(rotation);
    editModal.openModal();
  };

  const getFilteredRotations = () => {
    let filtered = rotations;

    if (selectedFarm) {
      filtered = filtered.filter(r => r.farmId === selectedFarm);
    }

    // Filter by year for calendar view
    if (viewMode === "calendar") {
      filtered = filtered.filter(r => {
        const rotationYear = new Date(r.plannedDate).getFullYear();
        return rotationYear === selectedYear;
      });
    }

    return filtered;
  };

  const getMonthlyRotations = () => {
    const yearStart = startOfYear(new Date(selectedYear, 0, 1));
    const yearEnd = endOfYear(new Date(selectedYear, 11, 31));
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
    
    const filtered = getFilteredRotations();
    
    return months.map(month => {
      const monthRotations = filtered.filter(rotation => {
        const rotationDate = new Date(rotation.plannedDate);
        return rotationDate.getMonth() === month.getMonth() && 
               rotationDate.getFullYear() === month.getFullYear();
      });
      
      return {
        month,
        rotations: monthRotations
      };
    });
  };

  const getCropColor = (cropName) => {
    const colors = {
      'Corn': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Soybeans': 'bg-green-100 text-green-800 border-green-200', 
      'Wheat': 'bg-amber-100 text-amber-800 border-amber-200',
      'Sunflower': 'bg-orange-100 text-orange-800 border-orange-200',
      'Barley': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[cropName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const filteredRotations = getFilteredRotations();
  const monthlyData = getMonthlyRotations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Crop Rotation Planning
          </h1>
          <p className="text-gray-600 mt-1">
            Plan and track crop rotations across your farms and growing seasons
          </p>
        </div>
        <Button
          onClick={addModal.openModal}
          className="flex items-center gap-2"
          disabled={farms.length === 0}
        >
          <ApperIcon name="Plus" size={16} />
          Add Rotation Plan
        </Button>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Farm">
                <Select 
                  value={selectedFarm} 
                  onChange={(e) => setSelectedFarm(e.target.value)}
                >
                  <option value="">All Farms</option>
                  {farms.map(farm => (
                    <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Year">
                <Select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </Select>
              </FormField>

              <FormField label="View Mode">
                <Select 
                  value={viewMode} 
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option value="calendar">Calendar View</option>
                  <option value="list">List View</option>
                </Select>
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={20} className="text-primary-600" />
              Rotation Calendar - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {monthlyData.map(({ month, rotations }) => (
                <div key={month.getTime()} className="border rounded-lg p-4 min-h-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {format(month, "MMMM")}
                  </h3>
                  <div className="space-y-2">
                    {rotations.length === 0 ? (
                      <div className="text-sm text-gray-500 italic">
                        No rotations planned
                      </div>
                    ) : (
                      rotations.map(rotation => (
                        <div 
                          key={rotation.Id}
                          className={`p-2 rounded-md border text-xs ${getCropColor(rotation.cropName)}`}
                        >
                          <div className="font-medium">{rotation.cropName}</div>
                          <div className="text-xs mt-1">{rotation.farmName}</div>
                          <div className="text-xs mt-1">
                            {format(new Date(rotation.plannedDate), "MMM dd")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="List" size={20} className="text-primary-600" />
              Rotation Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRotations.length === 0 ? (
              <div className="p-8 text-center">
                <ApperIcon name="RotateCcw" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No rotation plans found</p>
                <Button
                  size="sm"
                  onClick={addModal.openModal}
                  className="mt-2"
                  disabled={farms.length === 0}
                >
                  Create First Plan
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farm
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crop
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Planned Date
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Previous Crop
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
                    {filteredRotations.map((rotation) => (
                      <tr key={rotation.Id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {rotation.farmName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {rotation.cropName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {rotation.variety}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(rotation.plannedDate), "MMM dd, yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {rotation.previousCrop || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            rotation.status === "completed" ? "bg-green-100 text-green-700" :
                            rotation.status === "in-progress" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {rotation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditModal(rotation)}
                              className="h-8 w-8 p-0"
                            >
                              <ApperIcon name="Edit2" size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRotation(rotation.Id)}
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
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Rotation Modal */}
      {addModal.isOpen && (
        <RotationForm
          farms={farms}
          crops={crops}
          onSubmit={handleAddRotation}
          onCancel={addModal.closeModal}
        />
      )}

      {/* Edit Rotation Modal */}
      {editModal.isOpen && editingRotation && (
        <RotationForm
          rotation={editingRotation}
          farms={farms}
          crops={crops}
          onSubmit={handleEditRotation}
          onCancel={() => {
            editModal.closeModal();
            setEditingRotation(null);
          }}
          isEdit={true}
        />
      )}
    </div>
  );
};

// Rotation Form Component
const RotationForm = ({ rotation, farms, crops, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    plannedDate: "",
    previousCrop: "",
    notes: "",
    status: "planned"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rotation && isEdit) {
      setFormData({
        farmId: rotation.farmId || "",
        cropId: rotation.cropId || "",
        plannedDate: rotation.plannedDate ? format(new Date(rotation.plannedDate), "yyyy-MM-dd") : "",
        previousCrop: rotation.previousCrop || "",
        notes: rotation.notes || "",
        status: rotation.status || "planned"
      });
    }
  }, [rotation, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmId) {
      newErrors.farmId = "Farm selection is required";
    }
    if (!formData.cropId) {
      newErrors.cropId = "Crop selection is required";
    }
    if (!formData.plannedDate) {
      newErrors.plannedDate = "Planned date is required";
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

    const rotationData = {
      ...formData,
      plannedDate: new Date(formData.plannedDate).toISOString(),
      ...(isEdit ? { Id: rotation.Id } : {})
    };

    onSubmit(rotationData);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="RotateCcw" size={20} className="text-primary-600" />
            {isEdit ? "Edit Rotation Plan" : "Add Rotation Plan"}
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                label="Crop"
                type="select"
                required
                value={formData.cropId}
                onChange={handleChange("cropId")}
                error={errors.cropId}
              >
                <option value="">Select a crop</option>
                {crops.map(crop => (
                  <option key={crop.Id} value={crop.Id}>{crop.name} - {crop.variety}</option>
                ))}
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Planned Date"
                type="date"
                required
                value={formData.plannedDate}
                onChange={handleChange("plannedDate")}
                error={errors.plannedDate}
              />

              <FormField
                label="Previous Crop"
                value={formData.previousCrop}
                onChange={handleChange("previousCrop")}
                placeholder="e.g., Corn, Soybeans"
              />
            </div>

            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={handleChange("status")}
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </FormField>

            <FormField
              label="Notes"
              type="textarea"
              value={formData.notes}
              onChange={handleChange("notes")}
              placeholder="Additional notes about this rotation plan..."
              rows={3}
            />
          </CardContent>

          <div className="flex gap-3 p-6 border-t">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Save" size={16} className="mr-2" />
              {isEdit ? "Update Plan" : "Add Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CropRotation;