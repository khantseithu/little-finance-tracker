import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import {
  Text,
  Button,
  Switch,
  TextInput,
  Avatar,
  Card,
  Divider,
  IconButton,
} from "react-native-paper";
import { Svg, Circle } from "react-native-svg";

// Mock user data
const initialUser = {
  username: "JohnDoe",
  email: "john.doe@example.com",
  profilePicture: "https://example.com/profile.jpg", // Replace with actual URL or use a local image
};

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleEdit = () => {
    setEditing(!editing);
    // In a real app, you would save the changes to the backend here
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logging out...");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Svg
          height="300"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.headerSvg}
        >
          <Circle cx="1420" cy="60" r="200" fill="rgba(255,255,255,0.3)" />
          <Circle cx="1420" cy="60" r="150" fill="rgba(255,255,255,0.2)" />
          <Circle cx="20" cy="260" r="200" fill="rgba(255,255,255,0.2)" />
          <Circle cx="20" cy="260" r="150" fill="rgba(255,255,255,0.1)" />
        </Svg>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={120}
            source={{ uri: user.profilePicture }}
            style={styles.avatar}
          />
          <IconButton
            icon="camera"
            size={24}
            onPress={() => console.log("Change profile picture")}
            style={styles.editAvatarButton}
          />
        </View>
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.nameText}>{user.username}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
          <Button
            mode="contained"
            onPress={handleEdit}
            style={styles.editButton}
          >
            {editing ? "Save Profile" : "Edit Profile"}
          </Button>
        </Card.Content>
      </Card>

      {editing && (
        <Card style={styles.editCard}>
          <Card.Content>
            <TextInput
              label="Username"
              value={user.username}
              onChangeText={(text) => setUser({ ...user, username: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={user.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
              style={styles.input}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.settingsTitle}>App Settings</Text>
          <View style={styles.settingItem}>
            <Text>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingItem}>
            <Text>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
            />
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => console.log("Change password")}
        style={styles.changePasswordButton}
      >
        Change Password
      </Button>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        color="#FF6B6B"
      >
        Logout
      </Button>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 200,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  headerSvg: {
    position: "absolute",
    top: 0,
  },
  avatarContainer: {
    position: "absolute",
    bottom: -60,
  },
  avatar: {
    borderWidth: 5,
    borderColor: "white",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6200EE",
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  emailText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  editButton: {
    marginTop: 16,
  },
  editCard: {
    margin: 16,
    marginTop: 0,
  },
  input: {
    marginBottom: 16,
  },
  settingsCard: {
    margin: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  changePasswordButton: {
    margin: 16,
  },
  logoutButton: {
    margin: 16,
  },
  versionText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
});

export default ProfileScreen;
