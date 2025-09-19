import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAdminProfile, getAdminProfile } from "../../../lib/api";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

const AdminProfile: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("identicon");
  const [seed, setSeed] = useState("admin123");
  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // fetch profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Unauthorized", "Please login again.");
          setLoading(false);
          return;
        }

        const data = await getAdminProfile(token);
        const profile = (data as any).admin || data;

        setName(profile.name || "");
        setEmail(profile.email || "");
        setSeed(profile.seed || "admin123");
        setSelectedStyle(profile.style || "identicon");

        // generate avatar url
        setAvatar(
          profile.avatar ||
            `https://api.dicebear.com/7.x/${profile.style || "identicon"}/svg?seed=${profile.seed || "admin123"}`
        );
      } catch (error: unknown) {
        console.error("Failed to load profile:", error);
        let message = "Failed to fetch profile";
        if (error instanceof Error) message = error.message;
        Alert.alert("Error", message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // update avatar when style/seed changes
  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`);
  }, [selectedStyle, seed]);

 const handleSaveProfile = async () => {
  try {
    setSaving(true);
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Unauthorized", "Please login again.");
      return;
    }

    // Update backend
    await updateAdminProfile({ name, avatar, seed, style: selectedStyle }, token);

    // Fetch updated profile from backend
    const updatedData = await getAdminProfile(token);
    const profile = (updatedData as any).admin || updatedData;

    setName(profile.name || "");
    setEmail(profile.email || "");
    setSeed(profile.seed || "admin123");
    setSelectedStyle(profile.style || "identicon");
    setAvatar(
      profile.avatar ||
        `https://api.dicebear.com/7.x/${profile.style || "identicon"}/svg?seed=${profile.seed || "admin123"}`
    );

    Alert.alert("Success", "Profile updated successfully!");
    setShowModal(false);
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    let message = "Failed to update profile";
    if (error instanceof Error) message = error.message;
    Alert.alert("Error", message);
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-yellow-200">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Admin Profile</Text>
      </View>

      <View className="p-4 items-center">
        {/* Avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full bg-gray-400" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-400 justify-center items-center">
            <Text className="text-white text-2xl">👤</Text>
          </View>
        )}

        {/* Name + Edit */}
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold mr-2">{name}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Ionicons name="create-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text className="text-sm text-gray-600">{email}</Text>
      </View>

      {/* Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            {/* Avatar Preview */}
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full self-center mb-4" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-400 self-center justify-center items-center mb-4">
                <Text className="text-white text-2xl">👤</Text>
              </View>
            )}

            {/* Style Picker */}
            <Text className="mt-2 font-semibold text-gray-700">Select Avatar Style</Text>
            <View className="border border-gray-300 rounded-lg mt-2 mb-4 overflow-hidden">
              <Picker selectedValue={selectedStyle} onValueChange={(item) => setSelectedStyle(item)}>
                {AVATAR_STYLES.map((style) => (
                  <Picker.Item key={style} label={style} value={style} />
                ))}
              </Picker>
            </View>

            {/* Seed */}
            <Text className="font-semibold text-gray-700">Avatar Seed</Text>
            <TextInput
              value={seed}
              onChangeText={setSeed}
              placeholder="Enter seed"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-4"
            />

            {/* Name */}
            <Text className="font-semibold text-gray-700">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-6"
            />

            {/* Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg"
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveProfile}
                className={`px-6 py-2 rounded-lg ${saving ? "bg-gray-400" : "bg-black"}`}
                disabled={saving}
              >
                <Text className="text-white font-bold">{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AdminProfile;
