import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Card,
  Button,
  TextInput,
  List,
  FAB,
  Portal,
  Modal,
  ProgressBar,
  IconButton,
} from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";

// Define types
type Budget = {
  id: string;
  category: string;
  allocated: number;
  spent: number;
};

type Category = {
  label: string;
  value: string;
};

// Mock data
const initialBudgets: Budget[] = [
  { id: "1", category: "Food", allocated: 500, spent: 350 },
  { id: "2", category: "Transport", allocated: 200, spent: 150 },
  { id: "3", category: "Entertainment", allocated: 300, spent: 200 },
  { id: "4", category: "Bills", allocated: 1000, spent: 950 },
  { id: "5", category: "Shopping", allocated: 400, spent: 300 },
];

const categories: Category[] = [
  { label: "Food", value: "Food" },
  { label: "Transport", value: "Transport" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Bills", value: "Bills" },
  { label: "Shopping", value: "Shopping" },
];

const BudgetsScreen: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [allocated, setAllocated] = useState("");
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setEditingBudget(null);
    resetForm();
  };

  const resetForm = () => {
    setCategory("");
    setAllocated("");
  };

  const handleSave = () => {
    const newBudget: Budget = {
      id: editingBudget ? editingBudget.id : Date.now().toString(),
      category,
      allocated: parseFloat(allocated),
      spent: editingBudget ? editingBudget.spent : 0,
    };

    if (editingBudget) {
      setBudgets(
        budgets.map((budget) =>
          budget.id === editingBudget.id ? newBudget : budget
        )
      );
    } else {
      setBudgets([...budgets, newBudget]);
    }

    hideModal();
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setCategory(budget.category);
    setAllocated(budget.allocated.toString());
    showModal();
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
  };

  const totalBudget = budgets.reduce(
    (sum, budget) => sum + budget.allocated,
    0
  );
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Budget Summary</Text>
          <Text style={styles.summaryText}>
            Total Budget: ${totalBudget.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            Total Spent: ${totalSpent.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            Remaining: ${remainingBudget.toFixed(2)}
          </Text>
          <ProgressBar
            progress={totalSpent / totalBudget}
            color="#6200EE"
            style={styles.overallProgress}
          />
        </Card.Content>
      </Card>

      <ScrollView>
        {budgets.map((budget) => (
          <Card key={budget.id} style={styles.budgetCard}>
            <Card.Content>
              <View style={styles.budgetHeader}>
                <Text style={styles.categoryName}>{budget.category}</Text>
                <View style={styles.actions}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => handleEdit(budget)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDelete(budget.id)}
                  />
                </View>
              </View>
              <Text style={styles.budgetText}>
                Allocated: ${budget.allocated.toFixed(2)}
              </Text>
              <Text style={styles.budgetText}>
                Spent: ${budget.spent.toFixed(2)}
              </Text>
              <ProgressBar
                progress={budget.spent / budget.allocated}
                color="#6200EE"
                style={styles.progress}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingBudget ? "Edit Budget" : "Add Budget"}
          </Text>
          <DropDownPicker
            open={openCategory}
            value={category}
            items={categories}
            setOpen={setOpenCategory}
            setValue={setCategory}
            style={styles.input}
          />
          <TextInput
            label="Allocated Amount"
            value={allocated}
            mode="outlined"
            onChangeText={setAllocated}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save
          </Button>
        </Modal>
      </Portal>

      <FAB style={styles.fab} icon="plus" onPress={showModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  summaryCard: {
    margin: 16,
    backgroundColor: "#6200EE",
  },
  summaryTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summaryText: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  overallProgress: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginTop: 8,
  },
  budgetCard: {
    margin: 8,
    marginHorizontal: 16,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  budgetText: {
    fontSize: 14,
    marginBottom: 4,
  },
  progress: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});

export default BudgetsScreen;
