import BudgetsScreen from "@/components/BudgetScreen";
import React from "react";
import { SafeAreaView } from "react-native";

export default function Budgets() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BudgetsScreen />
    </SafeAreaView>
  );
}
