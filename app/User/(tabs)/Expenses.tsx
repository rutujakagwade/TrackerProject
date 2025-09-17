import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyExpenses } from "../../../lib/api";

const MyExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const data = await getMyExpenses(token); // optional: can pass "pending"
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#FFD700"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  // Filter expenses based on selected filterStatus
  const filteredExpenses =
    filterStatus === "all" ? expenses : expenses.filter((exp) => exp.status === filterStatus);

  return (
    <ScrollView className="p-4 bg-gray-100">
      {/* Filter Buttons */}
      <View className="flex-row justify-around mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilterStatus(status as any)}
            style={{
              backgroundColor: filterStatus === status ? "#FFD700" : "#ccc",
              padding: 8,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: filterStatus === status ? "black" : "white", fontWeight: "bold" }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredExpenses.length === 0 && (
        <Text className="text-center mt-8 text-gray-500">No expenses found</Text>
      )}

      {filteredExpenses.map((exp) => (
        <View key={exp._id} className="bg-white p-4 mb-2 rounded">
          <Text className="font-bold">{exp.type}</Text>
          <Text>Amount: ₹{exp.amount}</Text>
          <Text>Description: {exp.description || "-"}</Text>
          <Text>Status: {exp.status}</Text>
          <Text>Submitted on: {new Date(exp.createdAt).toLocaleDateString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default MyExpenses;
