import { SafeAreaView } from "react-native-safe-area-context";
import GuideChecklist from "../../components/GuideChecklist";

export default function GuideTab() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <GuideChecklist />
    </SafeAreaView>
  );
}
