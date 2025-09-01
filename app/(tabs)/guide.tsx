import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GuideChecklist from "@/components/GuideChecklist";
import {
  buildGuide,
  GUIDE_YEARS_DEFAULT,
  type GuideYear,
} from "@/constants/guide";
import { loadBuildParams, storageKeyForChecklist } from "@/utils/guideLink";

export default function GuideTab() {
  const [years, setYears] = useState<GuideYear[] | null>(null);
  const [storageKey, setStorageKey] = useState("guide_checked_v2_default");

  useEffect(() => {
    (async () => {
      const p = await loadBuildParams();
      if (p) {
        setYears(buildGuide(p));
        setStorageKey(storageKeyForChecklist(p));
      } else {
        setYears(GUIDE_YEARS_DEFAULT);
        setStorageKey(storageKeyForChecklist());
      }
    })();
  }, []);

  const data = useMemo(() => years ?? GUIDE_YEARS_DEFAULT, [years]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <GuideChecklist years={data} storageKey={storageKey} />
    </SafeAreaView>
  );
}
