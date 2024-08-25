import pb from "./pbservice";

export const getExpenses = async () => {
  const expenses = await pb.collection("expenses").getFullList({
    sort: "-created",
  });

  console.log("Expenses:", expenses);
  return expenses;
};

export const getIncomes = async () => {
  const incomes = await pb.collection("incomes").getFullList({
    sort: "-created",
  });

  console.log("Incomes:", incomes);
  return incomes;
};
