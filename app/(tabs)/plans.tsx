import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import PlanFormView from "@/components/PlanForm";
import type { SubmitHandler } from "react-hook-form";
import { calcPlan } from "@/calculators/plan";
import { PlanForm } from "@/schemas/plan";
import { planStore } from "@/state/planStore";
import ProjectOverview from "@/components/ProjectOverview";
import Cashflow from "@/components/Cashflow";

export default function PlansTab() {
  const [summary, setSummary] = useState<ReturnType<typeof calcPlan> | null>(
    null
  );

  const onSubmit: SubmitHandler<PlanForm> = (v) => {
    const result = calcPlan({ areaHa: v.area, densityPerHa: v.density });
    planStore.set(result);
    setSummary(result);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <PlanFormView onSubmit={onSubmit} />
        {summary ? (
          <View className="mt-4 space-y-4">
            <ProjectOverview data={summary} />
            <Cashflow data={summary} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
