import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import TaskItem from "@/components/molecules/TaskItem";
import Empty from "@/components/ui/Empty";

const TaskList = ({ tasks, onComplete, onEdit, onDelete, onAdd }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "overdue") {
      return !task.completed && new Date(task.dueDate) < new Date();
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="CheckSquare" size={20} className="text-primary-600" />
            Task Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </Select>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </Select>
            <Button onClick={onAdd} className="flex items-center gap-2">
              <ApperIcon name="Plus" size={16} />
              Add Task
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            description="No tasks match your current filter. Try adjusting your filters or create a new task."
            actionLabel="Add First Task"
            onAction={onAdd}
            icon="CheckSquare"
          />
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                onComplete={onComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;