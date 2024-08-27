import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, StyleSheet, Platform, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

interface TabIconProps {
  name: string;
  color: string;
  size: number;
  focused: boolean;
}

const TabIcon = ({ name, color, size, focused }: TabIconProps) => (
  <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
    <FontAwesome name={name as any} color={color} size={size} />
  </View>
);

export default function TabsLayout() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "bottom", "left"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#6200EE",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: isKeyboardVisible ? { display: "none" } : styles.tabBar,
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            />
          ),
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="home"
                color={color}
                size={size - 2}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            tabBarLabel: "Expenses",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="money"
                color={color}
                size={size - 2}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="incomes"
          options={{
            tabBarLabel: "Incomes",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="line-chart"
                color={color}
                size={size - 2}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            tabBarLabel: "Budgets",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="pie-chart"
                color={color}
                size={size - 2}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="user"
                color={color}
                size={size - 2}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="savingGoals"
          options={{
            tabBarLabel: "Savings",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                name="bank"
                color={color}
                size={size - 2}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tabBar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: Platform.OS === "ios" ? 20 : 20, // Adjust for Android
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderTopWidth: 0,
    elevation: 0,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconContainer: {
    // shadowColor: "#6200EE",
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 8,
    // elevation: 5,
  },
});
