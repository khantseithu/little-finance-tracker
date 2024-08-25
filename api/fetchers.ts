import pb from "./pbservice";

export const getExpenses = async () => {
  const expenses = await pb.collection("expenses").getFullList({
    sort: "-created",
  });

  console.log("Expenses:", expenses);
  return expenses;
};
