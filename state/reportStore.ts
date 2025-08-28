import AsyncStorage from "@react-native-async-storage/async-storage";
import { Evidence, HarvestLot } from "../schemas/report";

const KEY_EVI = "report_evidences_v1";
const KEY_LOT = "report_harvest_lots_v1";

export const reportStore = {
  async getAll() {
    const [a, b] = await Promise.all([
      AsyncStorage.getItem(KEY_EVI),
      AsyncStorage.getItem(KEY_LOT),
    ]);
    const evidences: Evidence[] = a ? JSON.parse(a) : [];
    const lots: HarvestLot[] = b ? JSON.parse(b) : [];
    return { evidences, lots };
  },
  async addEvidence(e: Evidence) {
    const { evidences } = await this.getAll();
    const next = [e, ...evidences];
    await AsyncStorage.setItem(KEY_EVI, JSON.stringify(next));
    return next;
  },
  async addLot(l: HarvestLot) {
    const { lots } = await this.getAll();
    const next = [l, ...lots];
    await AsyncStorage.setItem(KEY_LOT, JSON.stringify(next));
    return next;
  },
  async clearAll() {
    await Promise.all([
      AsyncStorage.removeItem(KEY_EVI),
      AsyncStorage.removeItem(KEY_LOT),
    ]);
  },
};
