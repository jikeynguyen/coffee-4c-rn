import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { planStore } from "@/state/planStore";
import SuppliesPager from "@/components/SuppliesPager";

export default function SuppliesTab() {
  const data = planStore.get();

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-center text-gray-600">
          Chưa có dữ liệu. Hãy tạo báo cáo ở tab Plans.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SuppliesPager data={data} />
    </SafeAreaView>
  );
}
