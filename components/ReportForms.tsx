import { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";

import DateField from "@/components/DateField";
import { ACTIVITY_TYPES } from "@/constants/report";
import { reportStore } from "@/state/reportStore";
import {
  evidenceSchema,
  harvestSchema,
  type Evidence,
  type HarvestLot,
} from "@/schemas/report";
import { generateLotCode } from "@/constants/lot";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");

const evidenceFormSchema = z.object({
  date: dateSchema,
  activity: z.string(),
  note: z.string().optional(),
  photoUri: z.string().optional(),
});
type EvidenceForm = z.infer<typeof evidenceFormSchema>;

const harvestFormSchema = z.object({
  date: dateSchema,
  weightKg: z.string(),
  note: z.string().optional(),
});
type HarvestForm = z.infer<typeof harvestFormSchema>;

export default function ReportForms({ onCreated }: { onCreated: () => void }) {
  const [tab, setTab] = useState<"evi" | "lot">("evi");

  // ----- Form MINH CHỨNG -----
  const {
    control: cE,
    handleSubmit: hE,
    reset: rE,
    setValue: setE,
    watch: wE,
    formState: { isSubmitting: sE },
  } = useForm<EvidenceForm>({
    resolver: zodResolver(evidenceFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      activity: ACTIVITY_TYPES[0].key,
      note: "",
      photoUri: undefined,
    },
  });

  // ----- Form LÔ THU HOẠCH -----
  const {
    control: cH,
    handleSubmit: hH,
    reset: rH,
    formState: { isSubmitting: sH },
  } = useForm<HarvestForm>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      weightKg: "",
      note: "",
    },
  });

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets?.[0]?.uri)
      setE("photoUri", res.assets[0].uri);
  };
  const submitEvidence = async (v: EvidenceForm) => {
    const e: Evidence = evidenceSchema.parse({
      id: `evi_${Date.now()}`,
      ...v,
    });
    await reportStore.addEvidence(e);
    rE({
      date: new Date().toISOString().slice(0, 10),
      activity: ACTIVITY_TYPES[0].key,
      note: "",
      photoUri: undefined,
    });
    onCreated();
  };

  const submitHarvest = async (v: HarvestForm) => {
    const weight = Number(String(v.weightKg).replace(/,/g, "."));
    if (!Number.isFinite(weight) || weight <= 0)
      throw new Error("Khối lượng không hợp lệ");
    const lot: HarvestLot = harvestSchema.parse({
      id: `lot_${Date.now()}`,
      date: v.date,
      weightKg: weight,
      lotCode: generateLotCode(v.date, weight),
      note: v.note,
    });
    await reportStore.addLot(lot);
    rH({
      date: new Date().toISOString().slice(0, 10),
      weightKg: "",
      note: "",
    });
    onCreated();
  };

  const photoUri = wE("photoUri");

  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4" key={tab}>
      {/* Tabs */}
      <View className="flex-row bg-gray-100 rounded-2xl p-1 mb-3">
        {[
          { k: "evi", t: "Minh chứng" },
          { k: "lot", t: "Tạo lô thu hoạch" },
        ].map((x) => (
          <Pressable
            key={x.k}
            onPress={() => setTab(x.k as any)}
            className={`flex-1 py-2 rounded-2xl items-center ${
              tab === x.k ? "bg-green-600" : ""
            }`}
          >
            <Text
              className={`${
                tab === x.k ? "text-white" : "text-gray-800"
              } font-semibold`}
            >
              {x.t}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "evi" ? (
        <View>
          <Text className="text-lg font-semibold mb-3">Thêm minh chứng</Text>

          {/* Ngày */}
          <Controller
            control={cE}
            name="date"
            render={({ field: { value, onChange } }) => (
              <DateField label="Ngày" value={value} onChange={onChange} />
            )}
          />

          {/* Hạng mục */}
          <Text className="text-sm text-gray-700 mb-1">Hạng mục</Text>
          <Controller
            control={cE}
            name="activity"
            render={({ field: { value, onChange } }) => (
              <View className="flex-row flex-wrap gap-2 mb-2">
                {ACTIVITY_TYPES.map((a) => {
                  const active = value === a.key;
                  return (
                    <Pressable
                      key={a.key}
                      onPress={() => onChange(a.key)}
                      className={`px-3 py-2 rounded-xl border ${
                        active
                          ? "bg-green-600 border-green-700"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`${
                          active ? "text-white" : "text-gray-800"
                        } text-sm`}
                      >
                        {a.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />

          {/* Ghi chú */}
          <Text className="text-sm text-gray-700 mb-1">Ghi chú</Text>
          <Controller
            control={cE}
            name="note"
            render={({ field: { value, onChange } }) => (
              <TextInput
                className="border border-gray-300 rounded-xl px-3 py-3 mb-2"
                value={value}
                onChangeText={onChange}
                placeholder="Ví dụ: tưới khu A 30 phút"
              />
            )}
          />

          {/* Ảnh minh chứng */}
          <Pressable
            onPress={pickPhoto}
            className="bg-gray-100 rounded-xl py-3 items-center mb-2"
          >
            <Text>{photoUri ? "Đổi ảnh minh chứng" : "+ Ảnh minh chứng"}</Text>
          </Pressable>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={{
                width: "100%",
                height: 180,
                borderRadius: 12,
                marginBottom: 8,
              }}
            />
          ) : null}

          <Pressable
            onPress={hE(submitEvidence)}
            disabled={sE}
            className="mt-2 bg-green-800 rounded-2xl py-3 items-center"
          >
            <Text className="text-white font-semibold">
              {sE ? "Đang lưu..." : "Lưu minh chứng"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <Text className="text-lg font-semibold mb-3">Tạo lô thu hoạch</Text>

          {/* Ngày */}
          <Controller
            control={cH}
            name="date"
            render={({ field: { value, onChange } }) => (
              <DateField label="Ngày" value={value} onChange={onChange} />
            )}
          />

          {/* Khối lượng */}
          <Text className="text-sm text-gray-700 mb-1">Khối lượng (kg)</Text>
          <Controller
            control={cH}
            name="weightKg"
            render={({ field: { value, onChange } }) => (
              <TextInput
                className="border border-gray-300 rounded-xl px-3 py-3 mb-2"
                keyboardType="decimal-pad"
                inputMode="decimal"
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChange}
                placeholder="Ví dụ: 52800"
              />
            )}
          />

          {/* Ghi chú */}
          <Text className="text-sm text-gray-700 mb-1">Ghi chú</Text>
          <Controller
            control={cH}
            name="note"
            render={({ field: { value, onChange } }) => (
              <TextInput
                className="border border-gray-300 rounded-xl px-3 py-3 mb-2"
                value={value}
                onChangeText={onChange}
                placeholder="Đợt hái 1 khu B"
              />
            )}
          />

          <Pressable
            onPress={hH(submitHarvest)}
            disabled={sH}
            className="mt-2 bg-green-800 rounded-2xl py-3 items-center"
          >
            <Text className="text-white font-semibold">
              {sH ? "Đang tạo..." : "Tạo lô"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
