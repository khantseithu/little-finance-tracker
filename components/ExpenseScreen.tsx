import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Platform } from "react-native";
import {
  Text,
  Card,
  Button,
  TextInput,
  List,
  FAB,
  Portal,
  Modal,
  IconButton,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { format } from "date-fns";

type Expense = {
  id: string;
  date: Date;
  category: string;
  amount: number;
  description: string;
};

type Category = {
  label: string;
  value: string;
};

const initialExpenses: Expense[] = [
  {
    id: "1",
    date: new Date(2023, 7, 1),
    category: "Food",
    amount: 50,
    description: "Groceries",
  },
  {
    id: "2",
    date: new Date(2023, 7, 2),
    category: "Transport",
    amount: 30,
    description: "Bus fare",
  },
  {
    id: "3",
    date: new Date(2023, 7, 3),
    category: "Entertainment",
    amount: 100,
    description: "Movie night",
  },
  {
    id: "4",
    date: new Date(2023, 7, 4),
    category: "Bills",
    amount: 200,
    description: "Electricity bill",
  },
  {
    id: "5",
    date: new Date(2023, 7, 5),
    category: "Shopping",
    amount: 150,
    description: "New shirt",
  },
];

const categories: Category[] = [
  { label: "Food", value: "Food" },
  { label: "Transport", value: "Transport" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Bills", value: "Bills" },
  { label: "Shopping", value: "Shopping" },
];

const ExpensesScreen: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setEditingExpense(null);
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date());
    setCategory("");
    setAmount("");
    setDescription("");
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleSave = () => {
    const newExpense: Expense = {
      id: editingExpense ? editingExpense.id : Date.now().toString(),
      date,
      category,
      amount: parseFloat(amount),
      description,
    };

    if (editingExpense) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingExpense.id ? newExpense : expense
        )
      );
    } else {
      setExpenses([...expenses, newExpense]);
    }

    hideModal();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDate(expense.date);
    setCategory(expense.category);
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    showModal();
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <Text style={styles.totalTitle}>Total Expenses</Text>
          <Text style={styles.totalAmount}>{totalExpenses.toFixed(2)} Ks</Text>
        </Card.Content>
      </Card>

      <ScrollView>
        {expenses.map((expense) => (
          <List.Item
            key={expense.id}
            title={() => (
              <Text style={styles.itemTitle}>{expense.category}</Text>
            )}
            description={() => (
              <Text style={styles.itemDescription}>
                {`${format(expense.date, "MMM dd, yyyy")} - ${
                  expense.description
                }`}
              </Text>
            )}
            right={() => (
              <View style={styles.rightContent}>
                <Text style={styles.itemDescription}>
                  {expense.amount.toFixed(2)} Ks
                </Text>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEdit(expense)}
                  iconColor="#6200EE"
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleDelete(expense.id)}
                  iconColor="red"
                />
              </View>
            )}
          />
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingExpense ? "Edit Expense" : "Add Expense"}
          </Text>
          <Button
            onPress={() => setShowDatePicker(true)}
            mode="outlined"
            style={styles.input}
          >
            {format(date, "MMM dd, yyyy")}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <DropDownPicker
            open={openCategory}
            value={category}
            items={categories}
            setOpen={setOpenCategory}
            setValue={setCategory}
            style={styles.input}
          />
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
            labelStyle={{ color: "white" }}
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
    backgroundColor: "#ffffff",
  },
  totalCard: {
    margin: 16,
    backgroundColor: "#6200EE",
  },
  totalTitle: {
    color: "white",
    fontSize: 16,
  },
  totalAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
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
    color: "#333",
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#6200EE",
  },
});

export default ExpensesScreen;
