import { apiUrl } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PocketBase, { AsyncAuthStore } from "pocketbase";

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem("pb_auth", serialized),
});

const initializeStore = async () => {
  const value = await AsyncStorage.getItem("pb_auth");
  if (value) {
    store.save(value);
  }
};

const pb = new PocketBase("http://165.232.169.234:8090", store);

initializeStore();

export default pb;
