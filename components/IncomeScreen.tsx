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
import { useCreateIncome } from "@/hooks/useIncomeMutations";
import { useQuery } from "@tanstack/react-query";
import { getIncomes } from "@/api/fetchers";

type Income = {
  id: string;
  date: Date;
  source: string;
  amount: number;
  description: string;
};

type Category = {
  label: string;
  value: string;
};

const initialIncomes: Income[] = [
  {
    id: "1",
    date: new Date(2023, 7, 1),
    source: "Full-time job",
    amount: 50,
    description: "Got salary",
  },
  {
    id: "2",
    date: new Date(2023, 7, 2),
    source: "Part-time job",
    amount: 30,
    description: "Got salary",
  },
  {
    id: "3",
    date: new Date(2023, 7, 3),
    source: "Freelance",
    amount: 100,
    description: "Got payment",
  },
  {
    id: "4",
    date: new Date(2023, 7, 4),
    source: "Investment",
    amount: 200,
    description: "Electricity bill",
  },
  {
    id: "5",
    date: new Date(2023, 7, 5),
    source: "Selling",
    amount: 150,
    description: "New shirt",
  },
];

const categories: Category[] = [
  { label: "Salary", value: "Salary" },
  { label: "Freelance", value: "Freelance" },
  { label: "Investment", value: "Investment" },
  { label: "Business", value: "Business" },
  { label: "Other", value: "Other" },
];

const IncomeScreen: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [visible, setVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [source, setSource] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editedIncome, setEditedIncome] = useState<Income | null>(null);
  const { mutate: createIncome, isPending, error } = useCreateIncome();
  const {
    data: incomesData,
    isLoading,
    isError,
    error: incomesError,
  } = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
    staleTime: 0,
  });

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setEditedIncome(null);
    resetForm();
  };

  const resetForm = () => {
    setDate(new Date());
    setSource("");
    setAmount("");
    setDescription("");
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleSave = () => {
    const newIncome: Income = {
      id: editedIncome ? editedIncome.id : Date.now().toString(),
      date,
      source,
      amount: parseFloat(amount),
      description,
    };

    createIncome(newIncome);
    if (editedIncome) {
      setIncomes(
        incomes.map((income) =>
          income.id === editedIncome.id ? newIncome : income
        )
      );
    } else {
      setIncomes([...incomes, newIncome]);
    }

    hideModal();
  };

  const handleEdit = (income: Income) => {
    setEditedIncome(income);
    setDate(income.date);
    setSource(income.source);
    setAmount(income.amount.toString());
    setDescription(income.description);
    showModal();
  };

  const handleDelete = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  const totalIncome = incomesData?.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <Text style={styles.totalTitle}>Total Income</Text>
          <Text style={styles.totalAmount}>
            {totalIncome?.toFixed(0) || 0} Ks
          </Text>
        </Card.Content>
      </Card>

      <ScrollView>
        {incomesData?.map((income) => (
          <List.Item
            key={income.id}
            title={() => <Text style={styles.itemTitle}>{income.source}</Text>}
            description={() => (
              <Text style={styles.itemDescription}>
                {`${format(income.date, "MMM dd, yyyy")} - ${
                  income.description
                }`}
              </Text>
            )}
            right={() => (
              <View style={styles.rightContent}>
                <Text style={styles.itemDescription}>
                  {income.amount.toFixed(2)} Ks
                </Text>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEdit(income)}
                  iconColor="#6200EE"
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleDelete(income.id)}
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
            {editedIncome ? "Edit Income" : "Add Income"}
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
            value={source}
            items={categories}
            setOpen={setOpenCategory}
            setValue={setSource}
            style={styles.input}
          />
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
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
    marginTop: 8,
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

export default IncomeScreen;
