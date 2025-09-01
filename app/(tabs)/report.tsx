import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ReportForms from "@/components/ReportForms";
import { reportStore } from "@/state/reportStore";
import { Evidence, HarvestLot } from "@/schemas/report";

const money = (n: number) => n.toLocaleString("vi-VN");
const dt = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { hour12: false });

export default function ReportTab() {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [lots, setLots] = useState<HarvestLot[]>([]);

  const reload = async () => {
    const { evidences, lots } = await reportStore.getAll();
    setEvidences(evidences);
    setLots(lots);
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Form */}
        <ReportForms onCreated={reload} />

        {/* Danh sách minh chứng */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mt-4">
          <Text className="text-lg font-semibold mb-2">Minh chứng gần đây</Text>
          {evidences.length === 0 ? (
            <Text className="text-gray-600">Chưa có minh chứng.</Text>
          ) : (
            evidences.map((e) => (
              <View key={e.id} className="py-3 border-b border-gray-200">
                <Text className="font-medium">{e.activity}</Text>
                <Text className="text-xs text-gray-600">{dt(e.date)}</Text>
                {e.note ? <Text className="text-sm mt-1">{e.note}</Text> : null}
              </View>
            ))
          )}
        </View>

        {/* Danh sách lô thu hoạch */}
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mt-4">
          <Text className="text-lg font-semibold mb-2">Lô thu hoạch</Text>
          {lots.length === 0 ? (
            <Text className="text-gray-600">Chưa có lô nào.</Text>
          ) : (
            lots.map((l) => (
              <View key={l.id} className="py-3 border-b border-gray-200">
                <View className="flex-row justify-between">
                  <Text className="font-medium">{l.lotCode}</Text>
                  <Text className="text-gray-800">{money(l.weightKg)} kg</Text>
                </View>
                <Text className="text-xs text-gray-600">{dt(l.date)}</Text>
                {l.note ? <Text className="text-sm mt-1">{l.note}</Text> : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
