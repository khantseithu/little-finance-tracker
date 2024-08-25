import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "@/store/userStore";
import pb from "@/api/pbservice";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Nunito_400Regular,
  Lato_400Regular,
  Inter_900Black,
} from "@expo-google-fonts/dev";

const queryClient = new QueryClient();

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const lightTheme = {
  ...DefaultTheme,
  dark: false,
};

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const user = useAuthStore((state: any) => state.user);
  const setUser = useAuthStore((state: any) => state.setUser);
  let [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    const isAuth = pb.authStore.isValid;
    console.log("Is auth", isAuth);
    if (isAuth && !user) {
      setUser(pb.authStore.model);
    }

    const inAuthGroup = segments[0] === "auth";

    if (!isAuth && !user && !inAuthGroup) {
      router.replace("/auth/login");
    } else if (isAuth && inAuthGroup) {
      router.replace("/");
    }

    console.log("User", user);
  }, [user, segments, pb?.authStore]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={lightTheme}>
      <QueryClientProvider
        client={queryClient}
        // persistOptions={{
        //   persister: asyncPersist,
        // }}
        // onSuccess={() => queryClient.resumePausedMutations()}
      >
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </QueryClientProvider>
    </PaperProvider>
  );
}
