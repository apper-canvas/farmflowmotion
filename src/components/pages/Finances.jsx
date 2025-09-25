import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import FinancialSummary from "@/components/organisms/FinancialSummary";
import TransactionTable from "@/components/organisms/TransactionTable";
import TransactionForm from "@/components/organisms/TransactionForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transactionService from "@/services/api/transactionService";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";
import { useModal } from "@/hooks/useModal";

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const addModal = useModal();
  const editModal = useModal();

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);
      setTransactions(transactionsData);
      setFarms(farmsData);
      setFilteredTransactions(transactionsData);
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
    const filtered = transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      addModal.closeModal();
      toast.success("Transaction added successfully!");
    } catch (err) {
      toast.error("Failed to add transaction. Please try again.");
    }
  };

  const handleEditTransaction = async (transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(editModal.data.Id, transactionData);
      setTransactions(prev => prev.map(transaction => 
        transaction.Id === updatedTransaction.Id ? updatedTransaction : transaction
      ));
      editModal.closeModal();
      toast.success("Transaction updated successfully!");
    } catch (err) {
      toast.error("Failed to update transaction. Please try again.");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionService.delete(transactionId);
      setTransactions(prev => prev.filter(transaction => transaction.Id !== transactionId));
      toast.success("Transaction deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete transaction. Please try again.");
    }
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  // Show form modals
  if (addModal.isOpen) {
    return (
      <TransactionForm
        farms={farms}
        onSubmit={handleAddTransaction}
        onCancel={addModal.closeModal}
        isEdit={false}
      />
    );
  }

  if (editModal.isOpen) {
    return (
      <TransactionForm
        transaction={editModal.data}
        farms={farms}
        onSubmit={handleEditTransaction}
        onCancel={editModal.closeModal}
        isEdit={true}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Financial Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track income, expenses, and profitability across your farming operations
          </p>
        </div>
        <Button
          onClick={addModal.openModal}
          className="flex items-center gap-2"
          disabled={farms.length === 0}
        >
          <ApperIcon name="Plus" size={16} />
          Add Transaction
        </Button>
      </div>

      {farms.length === 0 ? (
        <Empty
          title="No farms available"
          description="You need to create at least one farm before tracking financial transactions. Add your first farm to get started."
          actionLabel="Add Farm"
          onAction={() => window.location.href = "/farms"}
          icon="MapPin"
        />
      ) : (
        <>
          {/* Financial Summary */}
          <FinancialSummary transactions={transactions} />

          {/* Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search transactions by description, category, farm, or type..."
              className="flex-1 max-w-md"
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Receipt" size={16} />
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Transactions Table */}
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={editModal.openModal}
            onDelete={handleDeleteTransaction}
            onAdd={addModal.openModal}
          />
        </>
      )}
    </div>
  );
};

export default Finances;