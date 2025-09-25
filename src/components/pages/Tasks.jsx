import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/useModal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const addModal = useModal();
  const editModal = useModal();

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
      setFilteredTasks(tasksData);
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
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.cropName && task.cropName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTasks(filtered);
  }, [searchTerm, tasks]);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      addModal.closeModal();
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task. Please try again.");
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editModal.data.Id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ));
      editModal.closeModal();
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.complete(taskId);
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ));
      toast.success(updatedTask.completed ? "Task marked as completed!" : "Task marked as pending!");
    } catch (err) {
      toast.error("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task. Please try again.");
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
      <TaskForm
        farms={farms}
        crops={crops}
        onSubmit={handleAddTask}
        onCancel={addModal.closeModal}
        isEdit={false}
      />
    );
  }

  if (editModal.isOpen) {
    return (
      <TaskForm
        task={editModal.data}
        farms={farms}
        crops={crops}
        onSubmit={handleEditTask}
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
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule and track your farm activities and maintenance tasks
          </p>
        </div>
        <Button
          onClick={addModal.openModal}
          className="flex items-center gap-2"
          disabled={farms.length === 0}
        >
          <ApperIcon name="Plus" size={16} />
          Add Task
        </Button>
      </div>

      {farms.length === 0 ? (
        <Empty
          title="No farms available"
          description="You need to create at least one farm before adding tasks. Add your first farm to get started."
          actionLabel="Add Farm"
          onAction={() => window.location.href = "/farms"}
          icon="MapPin"
        />
      ) : (
        <>
          {/* Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search tasks by title, description, farm, or crop..."
              className="flex-1 max-w-md"
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="CheckSquare" size={16} />
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Tasks List */}
          <TaskList
            tasks={filteredTasks}
            onComplete={handleCompleteTask}
            onEdit={editModal.openModal}
            onDelete={handleDeleteTask}
            onAdd={addModal.openModal}
          />
        </>
      )}
    </div>
  );
};

export default Tasks;