import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import pb from "@/api/pbservice";
import useAuthStore from "@/store/userStore";

interface AuthScreenProps {
  mode: "login" | "signup";
}

interface AuthData {
  email: string;
  password: string;
  username?: string; // Optional for login
  passwordConfirm?: string;
}

export default function AuthScreen({ mode }: AuthScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const setUser = useAuthStore((state: any) => state.setUser);

  const authMutation = useMutation({
    mutationFn: async (data: AuthData) => {
      if (mode === "signup") {
        const createdUser = await pb.collection("users").create(data);
        await pb
          .collection("users")
          .authWithPassword(data.email, data.password);
        return createdUser;
      } else {
        return await pb
          .collection("users")
          .authWithPassword(data.email, data.password);
      }
    },
    onSuccess: (data) => {
      setUser(data.record);
      router.replace("/");
    },
    onError: (error) => {
      console.error("Authentication error:", error);
      // Handle error (e.g., show error message to user)
    },
  });

  const handleSubmit = () => {
    const data: AuthData = { email, password };
    if (mode === "signup") {
      data.username = username;
      data.passwordConfirm = password;
    }
    authMutation.mutate(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "login" ? "Login" : "Sign Up"}</Text>
      {mode === "signup" && (
        <TextInput
          label="Username"
          value={username}
          mode="outlined"
          onChangeText={setUsername}
          style={styles.input}
        />
      )}
      <TextInput
        label="Email"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      {mode === "signup" && (
        <TextInput
          label="Confirm Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
      )}
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        {mode === "login" ? "Login" : "Sign Up"}
      </Button>
      {/* @ts-ignore */}
      <Link href={mode === "login" ? "/auth/signup" : "/auth/login"}>
        <Text style={styles.link}>
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 12,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "blue",
  },
});
