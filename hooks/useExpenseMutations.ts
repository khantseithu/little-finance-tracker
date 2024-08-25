import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/api/pbservice";
import { Expense } from "@/components/ExpenseScreen";

const addUserToExpense = (expense: Omit<Expense, "user">): Expense => {
  return { ...expense, user: pb?.authStore?.model?.id ?? null };
};

const createExpense = async (
  expense: Omit<Expense, "user">
): Promise<Expense> => {
  const expenseWithUser = addUserToExpense(expense);
  const record = await pb.collection("expenses").create(expenseWithUser);
  return { ...expenseWithUser, id: record.id };
};

const updateExpense = async (expense: Expense): Promise<Expense> => {
  const expenseWithUser = addUserToExpense(expense);
  await pb.collection("expenses").update(expense.id, expenseWithUser);
  return expenseWithUser;
};

const deleteExpense = async (id: string): Promise<void> => {
  await pb.collection("expenses").delete(id);
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
