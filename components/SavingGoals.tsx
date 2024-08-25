import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { format } from "date-fns";
import { ProgressCircle, LineChart } from "react-native-svg-charts";

const SavingGoalsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [categories, setCategories] = useState([
    { label: "Vacation", value: "vacation" },
    { label: "New Car", value: "car" },
    { label: "Emergency Fund", value: "emergency" },
    { label: "Home Down Payment", value: "home" },
  ]);

  // Dummy data for the chart
  const data = [50, 100, 150, 200, 250, 300, 350];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const progress = 0.65; // Example progress (65%)

  const CreateGoalModal = () => (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modalContent}
      >
        <Text style={styles.modalTitle}>Create New Goal</Text>

        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Goal Name"
          value={goalName}
          onChangeText={setGoalName}
        />

        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder="Target Amount"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{format(deadline, "MMMM d, yyyy")}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={deadline}
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
          placeholder="Select Category"
          style={styles.dropDown}
          dropDownContainerStyle={styles.dropDownContainer}
        />

        <Button
          mode="contained"
          onPress={() => setModalVisible(false)}
          style={styles.submitButton}
        >
          Create Goal
        </Button>

        <Button
          mode="outlined"
          onPress={() => setModalVisible(false)}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Saving Goals</Text>

          <View style={styles.goalProgress}>
            <ProgressCircle
              style={{ height: 200 }}
              progress={progress}
              progressColor={"#6200EE"}
              strokeWidth={20}
            />
            <Text style={styles.progressText}>{`${Math.round(
              progress * 100
            )}%`}</Text>
            <Text style={styles.progressSubtext}>$3,250 / $5,000</Text>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Savings Over Time</Text>
            <LineChart
              style={{ height: 200 }}
              data={data}
              svg={{ stroke: "#6200EE" }}
              contentInset={{ top: 20, bottom: 20 }}
            />
          </View>
        </ScrollView>

        <CreateGoalModal />

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  goalProgress: {
    alignItems: "center",
    marginBottom: 30,
  },
  progressText: {
    position: "absolute",
    fontSize: 36,
    fontWeight: "bold",
    color: "#6200EE",
    top: "45%",
  },
  progressSubtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    // padding: 10,
    marginBottom: 15,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dropDown: {
    borderColor: "#ddd",
    marginBottom: 15,
  },
  dropDownContainer: {
    borderColor: "#ddd",
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 10,
  },
});

export default SavingGoalsScreen;
