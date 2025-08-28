import { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import type { PlanResult } from "@/calculators/plan";

const money = (n: number) => n.toLocaleString("vi-VN");

export default function SuppliesPager({ data }: { data: PlanResult }) {
  const { width } = useWindowDimensions();
  const ref = useRef<ScrollView>(null);
  const [idx, setIdx] = useState(0);

  const jump = (i: number) => {
    setIdx(i);
    ref.current?.scrollTo({ x: i * width, animated: true });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header năm */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row bg-gray-100 rounded-2xl p-1">
          {["Năm 1", "Năm 2", "Năm 3"].map((t, i) => (
            <Pressable
              key={t}
              onPress={() => jump(i)}
              className={`flex-1 py-2 rounded-2xl items-center ${
                idx === i ? "bg-green-600" : ""
              }`}
            >
              <Text
                className={`${
                  idx === i ? "text-white" : "text-gray-800"
                } font-semibold`}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Pager ngang */}
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIdx(i);
        }}
      >
        {data.suppliesByYear.map((yearBlock) => (
          <View key={yearBlock.year} style={{ width }}>
            {/* Cuộn dọc trong từng năm */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 32,
              }}
              showsVerticalScrollIndicator
            >
              <View className="bg-white border border-gray-200 rounded-2xl p-4 mt-3">
                <Text className="text-lg font-semibold mb-2">
                  Chi phí vật tư · Năm {yearBlock.year}
                </Text>

                {yearBlock.items.map((s, i) => (
                  <View key={i} className="py-3 border-b border-gray-200">
                    <View className="flex-row justify-between">
                      <Text className="font-medium">{s.name}</Text>
                      <Text className="font-semibold">{money(s.amount)} đ</Text>
                    </View>
                    <Text className="text-xs text-gray-600">
                      SL: {money(s.qty)} {s.unit} · Đơn giá: {money(s.price)} đ/
                      {s.unit}
                    </Text>
                    {s.note ? (
                      <Text className="text-xs text-gray-500 mt-1">
                        {s.note}
                      </Text>
                    ) : null}
                  </View>
                ))}

                <View className="mt-4 pt-3 border-t border-gray-300">
                  <View className="flex-row justify-between">
                    <Text className="text-base font-semibold">
                      Tổng năm {yearBlock.year}
                    </Text>
                    <Text className="text-base font-extrabold">
                      {money(yearBlock.total)} đ
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
