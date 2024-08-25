import ExpensesScreen from "@/components/ExpenseScreen";
import React from "react";
import { SafeAreaView } from "react-native";

export default function Expenses() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ExpensesScreen />
    </SafeAreaView>
  );
}
