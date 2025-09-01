import { View, Text } from "react-native";
import type { PlanResult } from "@/calculators/plan";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryLegend,
  VictoryGroup,
  VictoryTheme,
} from "victory-native";

const money = (n: number) => n.toLocaleString("vi-VN");

export default function Cashflow({ data }: { data: PlanResult }) {
  const rows = data.cashflow.map((y) => ({
    year: `Năm ${y.year}`,
    cost: y.cost,
    revenue: y.revenue,
    net: y.net,
  }));

  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4">
      <Text className="text-lg font-semibold mb-2">Dòng tiền (3 năm)</Text>

      {/* Biểu đồ cột */}
      <View className="items-center">
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{ x: 30, y: 20 }}
          width={360}
          height={260}
        >
          <VictoryLegend
            x={60}
            y={0}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Chi phí" },
              { name: "Doanh thu" },
              { name: "Kết quả" },
            ]}
          />
          <VictoryAxis tickValues={rows.map((r) => r.year)} />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${Math.round(t / 1e6)}tr`}
          />
          <VictoryGroup offset={16}>
            <VictoryBar data={rows} x="year" y="cost" />
            <VictoryBar data={rows} x="year" y="revenue" />
            <VictoryBar data={rows} x="year" y="net" />
          </VictoryGroup>
        </VictoryChart>
      </View>

      {/* Bảng tóm tắt */}
      <View className="mt-2">
        {data.cashflow.map((y) => (
          <View key={y.year} className="py-3 border-b border-gray-200">
            <View className="flex-row justify-between">
              <Text className="font-semibold">Năm {y.year}</Text>
              <Text className="font-semibold">{money(y.net)} đ</Text>
            </View>
            <Text className="text-xs text-gray-600">
              Chi phí: {money(y.cost)} đ
            </Text>
            <Text className="text-xs text-gray-600">
              Doanh thu: {money(y.revenue)} đ
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
