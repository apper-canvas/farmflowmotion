import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const TransactionForm = ({ transaction, farms, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd")
  });

  const [errors, setErrors] = useState({});

  const expenseCategories = [
    "seeds", "fertilizer", "pesticides", "equipment", "fuel", "labor", 
    "maintenance", "insurance", "utilities", "storage", "transportation", "other"
  ];

  const incomeCategories = [
    "crop_sales", "livestock", "subsidies", "grants", "equipment_rental", "other"
  ];

  useEffect(() => {
    if (transaction && isEdit) {
      setFormData({
        farmId: transaction.farmId || "",
        type: transaction.type || "expense",
        category: transaction.category || "",
        amount: transaction.amount?.toString() || "",
        description: transaction.description || "",
        date: transaction.date ? format(new Date(transaction.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
      });
    }
  }, [transaction, isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmId) {
      newErrors.farmId = "Farm selection is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
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

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      ...(isEdit ? { Id: transaction.Id } : {})
    };

    onSubmit(transactionData);
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      ...(field === "type" ? { category: "" } : {})
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getCurrentCategories = () => {
    return formData.type === "income" ? incomeCategories : expenseCategories;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Receipt" size={20} className="text-primary-600" />
          {isEdit ? "Edit Transaction" : "Add New Transaction"}
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
              label="Transaction Type"
              type="select"
              required
              value={formData.type}
              onChange={handleChange("type")}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </FormField>

            <FormField
              label="Category"
              type="select"
              required
              value={formData.category}
              onChange={handleChange("category")}
              error={errors.category}
            >
              <option value="">Select a category</option>
              {getCurrentCategories().map(category => (
                <option key={category} value={category}>
                  {category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </FormField>
          </div>

          <FormField
            label="Description"
            required
            value={formData.description}
            onChange={handleChange("description")}
            placeholder="e.g., Purchased corn seeds, Sold wheat harvest"
            error={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Amount ($)"
              type="number"
              required
              value={formData.amount}
              onChange={handleChange("amount")}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              error={errors.amount}
            />

            <FormField
              label="Date"
              type="date"
              required
              value={formData.date}
              onChange={handleChange("date")}
              error={errors.date}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button type="submit" className="flex-1">
            <ApperIcon name="Save" size={16} className="mr-2" />
            {isEdit ? "Update Transaction" : "Add Transaction"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TransactionForm;