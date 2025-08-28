import { SafeAreaView } from "react-native-safe-area-context";
import PlanFormView from "../../components/PlanForm";
import type { SubmitHandler } from "react-hook-form";
import { PlanForm } from "@/schemas/plan";

export default function PlansTab() {
  const onSubmit: SubmitHandler<PlanForm> = (v) => {
    console.log("Plan payload:", v);
    // TODO: gọi API tạo kế hoạch
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PlanFormView onSubmit={onSubmit} />
    </SafeAreaView>
  );
}
