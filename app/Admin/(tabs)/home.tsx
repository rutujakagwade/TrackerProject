import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();``

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="bg-yellow-400 p-5 rounded-b-3xl">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-black">Welcome Admin!</Text>
            <TouchableOpacity className="bg-gray-800 px-3 py-1 rounded-md">
              <Text className="text-white text-xs">This Month ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {[
            { value: "2500", label: "Total Expenses", icon: "checkmark-circle", color: "green" },
            { value: "1226", label: "Total Distance", icon: "checkmark-circle", color: "green" },
            { value: "09", label: "Efficiency Rate", icon: "checkmark-circle", color: "green" },
            { value: "11", label: "Compliance Rate", icon: "close-circle", color: "red" },
          ].map((item, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-5 shadow-md mb-3 w-[48%]"
            >
              <Text className="text-2xl font-bold text-black">{item.value}</Text>
              <Text className="text-gray-500 text-xs mt-1">{item.label}</Text>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-3">
          <Text className="text-base font-bold mb-3">Quick Actions</Text>
          <View className="flex-col space-y-3">
            <Link href="/Admin/AddMember" asChild>
              <TouchableOpacity className="bg-yellow-400 flex-row items-center justify-center py-4 px-3 rounded-2xl shadow-md">
                <Ionicons name="person-add" size={20} color="black" />
                <Text className="ml-2 text-black font-semibold">Add A Member</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              className="bg-yellow-400 mt-2 flex-row items-center justify-center py-4 px-3 rounded-2xl shadow-md"
              onPress={() => router.push("/Admin/(tabs)/pendingApproval")}
            >
              <MaterialIcons name="done-all" size={20} color="black" />
              <Text className="ml-2 text-black font-semibold">Bulk Approval</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 mt-6 mb-16">
          <Text className="text-base font-bold mb-3">Recent Activity</Text>

          <View className="flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm mb-2">
            <Text className="text-black">4 Expenses Approved</Text>
            <Text className="text-gray-400 text-xs">1 hour ago</Text>
          </View>

          <View className="flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm">
            <Text className="text-black">10 New Expense Submissions</Text>
            <Text className="text-gray-400 text-xs">1 hour ago</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
