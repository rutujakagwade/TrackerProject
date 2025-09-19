import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { getUserProfile, updateUserProfile } from "../../../lib/api";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

const UserProfile: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("identicon");
  const [seed, setSeed] = useState("user123");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const data = await getUserProfile(token);

        setName(data.name || "");
        setEmail(data.email || "");
        setSelectedStyle(data.style || "identicon");
        setSeed(data.seed || "user123");
        setAvatar(
          data.avatar ||
            `https://api.dicebear.com/7.x/${data.style || "identicon"}/svg?seed=${data.seed || "user123"}`
        );
      } catch (err: unknown) {
        console.error(err);
        Alert.alert("Error", err instanceof Error ? err.message : "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Update avatar dynamically
  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`);
  }, [selectedStyle, seed]);

  // Save profile changes
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      await updateUserProfile({ name, avatar, style: selectedStyle, seed }, token);
      Alert.alert("Success", "Profile updated successfully!");
      setShowModal(false);
    } catch (err: unknown) {
      console.error(err);
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Profile Info */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: avatar }}
          className="w-32 h-32 rounded-full bg-gray-300 border-2 border-gray-400"
        />
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold mr-2">{name}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Ionicons name="create-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-600">{email}</Text>
      </View>

      {/* Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-11/12 rounded-lg p-5">
            <Text className="font-bold text-lg mb-4">Edit Profile</Text>

            <Text className="font-semibold mb-1">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <Text className="font-semibold mb-1">Avatar Style</Text>
            <Picker
              selectedValue={selectedStyle}
              onValueChange={setSelectedStyle}
              className="mb-3"
            >
              {AVATAR_STYLES.map((style) => (
                <Picker.Item key={style} label={style} value={style} />
              ))}
            </Picker>

            <Text className="font-semibold mb-1">Avatar Seed</Text>
            <TextInput
              value={seed}
              onChangeText={setSeed}
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            />

            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="mr-3 px-4 py-2 border rounded"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded bg-black ${saving ? "opacity-50" : ""}`}
              >
                <Text className="text-white">{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default UserProfile;
