import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FarmGrid from "@/components/organisms/FarmGrid";
import FarmForm from "@/components/organisms/FarmForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import farmService from "@/services/api/farmService";
import weatherService from "@/services/api/weatherService";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/useModal";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const addModal = useModal();
  const editModal = useModal();

const loadFarms = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await farmService.getAll();
      
      // Fetch weather data for each farm
      const farmsWithWeather = await Promise.all(
        data.map(async (farm) => {
          try {
            const weatherSummary = await weatherService.getWeatherSummary(farm.location);
            return { ...farm, weatherSummary };
          } catch (error) {
            return { ...farm, weatherSummary: null };
          }
        })
      );
      
      setFarms(farmsWithWeather);
      setFilteredFarms(farmsWithWeather);
    } catch (err) {
      setError("Failed to load farms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    const filtered = farms.filter(farm =>
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.soilType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFarms(filtered);
  }, [searchTerm, farms]);

  const handleAddFarm = async (farmData) => {
    try {
      const newFarm = await farmService.create(farmData);
      setFarms(prev => [...prev, newFarm]);
      addModal.closeModal();
      toast.success("Farm added successfully!");
    } catch (err) {
      toast.error("Failed to add farm. Please try again.");
    }
  };

  const handleEditFarm = async (farmData) => {
    try {
      const updatedFarm = await farmService.update(editModal.data.Id, farmData);
      setFarms(prev => prev.map(farm => 
        farm.Id === updatedFarm.Id ? updatedFarm : farm
      ));
      editModal.closeModal();
      toast.success("Farm updated successfully!");
    } catch (err) {
      toast.error("Failed to update farm. Please try again.");
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) {
      return;
    }

    try {
      await farmService.delete(farmId);
      setFarms(prev => prev.filter(farm => farm.Id !== farmId));
      toast.success("Farm deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete farm. Please try again.");
    }
  };

  const handleViewDetails = (farm) => {
    // Navigate to farm details or open modal
    toast.info(`Viewing details for ${farm.name}`);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadFarms} />;
  }

  // Show form modals
  if (addModal.isOpen) {
    return (
      <FarmForm
        onSubmit={handleAddFarm}
        onCancel={addModal.closeModal}
        isEdit={false}
      />
    );
  }

  if (editModal.isOpen) {
    return (
      <FarmForm
        farm={editModal.data}
        onSubmit={handleEditFarm}
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
            Farm Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your farm properties and basic information
          </p>
        </div>
        <Button
          onClick={addModal.openModal}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Farm
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search farms by name, location, or soil type..."
          className="flex-1 max-w-md"
        />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="MapPin" size={16} />
          {filteredFarms.length} farm{filteredFarms.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <Empty
          title={searchTerm ? "No farms found" : "No farms added yet"}
          description={
            searchTerm 
              ? "Try adjusting your search terms or clear the search to see all farms."
              : "Get started by adding your first farm property to track your agricultural operations."
          }
          actionLabel="Add First Farm"
          onAction={addModal.openModal}
          icon="MapPin"
        />
      ) : (
        <FarmGrid
          farms={filteredFarms}
          onEdit={editModal.openModal}
          onDelete={handleDeleteFarm}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default Farms;