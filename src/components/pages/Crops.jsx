import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import CropTable from "@/components/organisms/CropTable";
import CropForm from "@/components/organisms/CropForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/useModal";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const addModal = useModal();
  const editModal = useModal();

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
      setFilteredCrops(cropsData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = crops;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(crop => crop.status === statusFilter);
    }

    setFilteredCrops(filtered);
  }, [searchTerm, statusFilter, crops]);

  const handleAddCrop = async (cropData) => {
    try {
      const newCrop = await cropService.create(cropData);
      setCrops(prev => [...prev, newCrop]);
      addModal.closeModal();
      toast.success("Crop added successfully!");
    } catch (err) {
      toast.error("Failed to add crop. Please try again.");
    }
  };

  const handleEditCrop = async (cropData) => {
    try {
      const updatedCrop = await cropService.update(editModal.data.Id, cropData);
      setCrops(prev => prev.map(crop => 
        crop.Id === updatedCrop.Id ? updatedCrop : crop
      ));
      editModal.closeModal();
      toast.success("Crop updated successfully!");
    } catch (err) {
      toast.error("Failed to update crop. Please try again.");
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) {
      return;
    }

    try {
      await cropService.delete(cropId);
      setCrops(prev => prev.filter(crop => crop.Id !== cropId));
      toast.success("Crop deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete crop. Please try again.");
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  // Show form modals
  if (addModal.isOpen) {
    return (
      <CropForm
        farms={farms}
        onSubmit={handleAddCrop}
        onCancel={addModal.closeModal}
        isEdit={false}
      />
    );
  }

  if (editModal.isOpen) {
    return (
      <CropForm
        crop={editModal.data}
        farms={farms}
        onSubmit={handleEditCrop}
        onCancel={editModal.closeModal}
        isEdit={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Crop Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track your crop plantings, varieties, and growth status
          </p>
        </div>
        <Button
          onClick={addModal.openModal}
          className="flex items-center gap-2"
          disabled={farms.length === 0}
        >
          <ApperIcon name="Plus" size={16} />
          Add Crop
        </Button>
      </div>

      {farms.length === 0 ? (
        <Empty
          title="No farms available"
          description="You need to create at least one farm before adding crops. Add your first farm to get started."
          actionLabel="Add Farm"
          onAction={() => window.location.href = "/farms"}
          icon="MapPin"
        />
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search crops by name, variety, or farm..."
              className="flex-1 max-w-md"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Status</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </Select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Wheat" size={16} />
              {filteredCrops.length} crop{filteredCrops.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Crops Table */}
          {filteredCrops.length === 0 ? (
            <Empty
              title={searchTerm || statusFilter !== "all" ? "No crops found" : "No crops planted yet"}
              description={
                searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters to see more crops."
                  : "Start by adding your first crop planting to track growth and harvest schedules."
              }
              actionLabel="Add First Crop"
              onAction={addModal.openModal}
              icon="Wheat"
            />
          ) : (
            <CropTable
              crops={filteredCrops}
              onEdit={editModal.openModal}
              onDelete={handleDeleteCrop}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Crops;