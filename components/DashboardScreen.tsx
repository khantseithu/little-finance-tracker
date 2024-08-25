import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Card, Button, ProgressBar, List, FAB } from "react-native-paper";
import { PieChart } from "react-native-svg-charts";
import { format } from "date-fns";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getExpenses, getIncomes } from "@/api/fetchers";
import { G, Text as SvgText } from "react-native-svg";

// Mock data
const userData = {
  balance: 5000,
  monthlyIncome: 3000,
  monthlyExpenses: 2000,
  budgetProgress: 0.7,
  recentTransactions: [
    {
      id: "1",
      type: "expense",
      amount: 50,
      category: "Food",
      date: new Date(),
    },
    {
      id: "2",
      type: "income",
      amount: 1000,
      category: "Salary",
      date: new Date(Date.now() - 86400000),
    },
    {
      id: "3",
      type: "expense",
      amount: 30,
      category: "Transport",
      date: new Date(Date.now() - 172800000),
    },
    {
      id: "4",
      type: "expense",
      amount: 100,
      category: "Shopping",
      date: new Date(Date.now() - 259200000),
    },
    {
      id: "5",
      type: "income",
      amount: 200,
      category: "Freelance",
      date: new Date(Date.now() - 345600000),
    },
  ],
};

const DashboardScreen: React.FC = () => {
  const [userData, setUserData] = useState({
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    budgetProgress: 0,
    recentTransactions: [],
  });
  const {
    data: incomesData,
    isLoading: incomesLoading,
    isError: incomesError,
  } = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
    staleTime: 0,
  });

  const pieData = [
    {
      key: 1,
      value: userData?.monthlyIncome - userData?.monthlyExpenses,
      svg: { fill: "#600080" },
      label: "Income",
    },
    {
      key: 2,
      value: userData?.monthlyExpenses,
      svg: { fill: "#9900cc" },
      label: "Expenses",
    },
  ];

  const {
    data: expensesData,
    isLoading: expensesLoading,
    isError: expensesError,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
    staleTime: 0,
  });

  useEffect(() => {
    if (incomesData && expensesData) {
      console.log("Incomes data", incomesData);
      console.log("Expenses data", expensesData);

      // Calculate user data
      const monthlyIncome = incomesData.reduce(
        (total, income) => total + income.amount,
        0
      );

      const monthlyExpenses = expensesData.reduce(
        (total, expense) => total + expense.amount,
        0
      );

      const balance = monthlyIncome - monthlyExpenses;
      const budgetProgress = monthlyExpenses / monthlyIncome;

      const recentTransactions = [
        ...incomesData.map((income) => ({
          ...income,
          type: "income",
        })),
        ...expensesData.map((expense) => ({
          ...expense,
          type: "expense",
        })),
      ].sort((a, b) => b.date - a.date);

      setUserData({
        balance,
        monthlyIncome,
        monthlyExpenses,
        budgetProgress,
        recentTransactions,
      });
    }
  }, [incomesData, expensesData]);

  if (incomesLoading || expensesLoading) {
    return <Text>Loading...</Text>;
  }

  if (incomesError || expensesError) {
    return <Text>Error fetching data</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <Text style={styles.balanceAmount}>
              ${userData.balance.toFixed(0)}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryTitle}>Monthly Income</Text>
              <Text style={styles.summaryAmount}>
                ${userData.monthlyIncome.toFixed(0)}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryTitle}>Monthly Expenses</Text>
              <Text style={styles.summaryAmount}>
                ${userData.monthlyExpenses.toFixed(0)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.chartCard}>
          <Card.Content>
            <Text style={styles.chartTitle}>Income vs Expenses</Text>
            <PieChart
              style={styles.chart}
              data={pieData}
              innerRadius="70%"
              padAngle={0.02}
            >
              <Labels />
            </PieChart>
          </Card.Content>
        </Card>

        <Card style={styles.budgetCard}>
          <Card.Content>
            <Text style={styles.budgetTitle}>Budget Progress</Text>
            <ProgressBar
              progress={userData.budgetProgress}
              color="#6200EE"
              style={styles.budgetProgress}
            />
            <Text style={styles.budgetText}>
              {(userData?.budgetProgress * 100).toFixed(0)}% of budget used
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.transactionsCard}>
          <Card.Content>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            {userData?.recentTransactions.map((transaction) => (
              <List.Item
                key={transaction.id}
                title={transaction.category || transaction.source}
                description={format(transaction.date, "MMM dd, yyyy")}
                right={() => (
                  <Text
                    style={
                      transaction.type === "expense"
                        ? styles.expenseText
                        : styles.incomeText
                    }
                  >
                    {transaction.type === "expense" ? "-" : "+"}$
                    {transaction.amount.toFixed(0)}
                  </Text>
                )}
              />
            ))}
          </Card.Content>
        </Card>

        {/* <View style={styles.navigationButtons}>
          <Link href="/expenses" asChild>
            <Button mode="outlined" style={styles.navButton}>
              Expenses
            </Button>
          </Link>
          <Link href="/incomes" asChild>
            <Button mode="outlined" style={styles.navButton}>
              Incomes
            </Button>
          </Link>
          <Link href="/budgets" asChild>
            <Button mode="outlined" style={styles.navButton}>
              Budgets
            </Button>
          </Link>
          <Link href="/savingGoals" asChild>
            <Button mode="outlined" style={styles.navButton}>
              Savings Goals
            </Button>
          </Link>
        </View> */}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log("Add transaction")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  balanceCard: {
    margin: 16,
    backgroundColor: "#6200EE",
  },
  balanceTitle: {
    color: "white",
    fontSize: 16,
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryTitle: {
    fontSize: 14,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chartCard: {
    margin: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chart: {
    height: 200,
  },
  budgetCard: {
    margin: 16,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  budgetProgress: {
    height: 10,
    borderRadius: 5,
  },
  budgetText: {
    marginTop: 8,
    textAlign: "center",
  },
  transactionsCard: {
    margin: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  expenseText: {
    color: "#FF6B6B",
  },
  incomeText: {
    color: "#4ECDC4",
  },
  navigationButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    margin: 16,
  },
  navButton: {
    marginBottom: 8,
    width: "48%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
});

export default DashboardScreen;

const Labels = ({ slices }) => {
  return slices.map((slice, index) => {
    const { labelCentroid, data } = slice;
    return (
      <G key={index}>
        <SvgText
          x={labelCentroid[0]}
          y={labelCentroid[1]}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={14}
          stroke={"black"}
          strokeWidth={0.2}
        >
          {data.label}
        </SvgText>
      </G>
    );
  });
};
