import { View, Text } from "react-native";
import type { PlanResult } from "@/calculators/plan";

const money = (n: number) => n.toLocaleString("vi-VN");

export default function ProjectOverview({ data }: { data: PlanResult }) {
  const o = data.overview;
  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4">
      <Text className="text-lg font-semibold mb-2">Tổng quan dự án</Text>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Diện tích</Text>
        <Text className="font-semibold">{o.areaHa} ha</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Mật độ</Text>
        <Text className="font-semibold">{o.densityPerHa} cây/ha</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Tổng cây</Text>
        <Text className="font-semibold">{money(o.totalTrees)}</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-600">Dự phòng cây giống</Text>
        <Text className="font-semibold">{money(o.seedlingReserve)}</Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-gray-600">Tổng cây mua</Text>
        <Text className="font-semibold">{money(o.totalSeedlings)}</Text>
      </View>
    </View>
  );
}
