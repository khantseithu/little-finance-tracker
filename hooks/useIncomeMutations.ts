import { useMutation, useQueryClient } from "@tanstack/react-query";
import pb from "@/api/pbservice";

interface Income {
  id?: string;
  user?: string;
  date: Date;
  source: string;
  amount: number;
  description: string;
}

const addUserToIncome = (income: Omit<Income, "user">): Income => {
  return { ...income, user: pb?.authStore?.model?.id ?? null };
};

const createIncome = async (income: Omit<Income, "user">): Promise<Income> => {
  const incomeWithUser = addUserToIncome(income);
  delete incomeWithUser?.id;
  const record = await pb.collection("incomes").create(incomeWithUser);
  return { ...incomeWithUser, id: record.id };
};

const updateIncome = async (income: Income): Promise<Income> => {
  const incomeWithUser = addUserToIncome(income);
  await pb.collection("incomes").update(income.id, incomeWithUser);
  return incomeWithUser;
};

const deleteIncome = async (id: string): Promise<void> => {
  await pb.collection("incomes").delete(id);
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
};
