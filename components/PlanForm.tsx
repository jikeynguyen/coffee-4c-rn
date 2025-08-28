// components/PlanForm.tsx
import { ScrollView, View, Text, TextInput, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dropdown } from "react-native-element-dropdown";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
  District,
  Ward,
} from "sub-vn";
import {
  CertKey,
  CERTS,
  COFFEE_VARIETIES,
  MONTHS,
  SOIL_TYPES,
} from "@/constants/plans";
import { PlanForm, planSchema } from "@/schemas/plan";

function CertChips({
  value,
  onChange,
}: {
  value: CertKey[];
  onChange: (arr: CertKey[]) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {CERTS.map((c) => {
        const active = value.includes(c.key);
        return (
          <Pressable
            key={c.key}
            onPress={() => {
              const next = active
                ? (value.filter((k) => k !== c.key) as CertKey[])
                : ([...value, c.key] as CertKey[]);
              onChange(next);
            }}
            className={`px-3 py-2 rounded-xl border ${
              active
                ? "bg-green-600 border-green-700"
                : "bg-white border-gray-300"
            }`}
          >
            <Text
              className={`${active ? "text-white" : "text-gray-800"} text-sm`}
            >
              {c.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const parseNumber = (t: string) => {
  const n = Number(String(t).replace(/,/g, "."));
  return Number.isFinite(n) ? n : 0;
};

export default function PlanFormView({
  onSubmit,
}: {
  onSubmit: SubmitHandler<PlanForm>;
}) {
  const provinces = useMemo(() => getProvinces(), []);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      area: 1,
      density: 1666,
      province: "",
      district: "",
      ward: "",
      soilType: SOIL_TYPES[0],
      plantingMonth: 8,
      certifications: [],
      coffeeVariety: COFFEE_VARIETIES[0],
    },
  });

  const provinceCode = watch("province");
  const districtCode = watch("district");

  const onChangeProvince = (code: string) => {
    setValue("province", code);
    setValue("district", "");
    setValue("ward", "");
    setDistricts(getDistrictsByProvinceCode(code));
    setWards([]);
  };
  const onChangeDistrict = (code: string) => {
    setValue("district", code);
    setValue("ward", "");
    setWards(getWardsByDistrictCode(code));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-xl font-bold text-center mb-4">Kế hoạch</Text>

      <View className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">Khởi tạo Kế hoạch</Text>

        {/* Diện tích */}
        <Text className="text-sm text-gray-700 mb-1">Diện tích (ha)</Text>
        <Controller
          control={control}
          name="area"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <TextInput
                className="border border-gray-300 rounded-xl px-3 py-3 mb-1"
                keyboardType="decimal-pad"
                value={String(value ?? "")}
                onChangeText={(t) => onChange(parseNumber(t))}
                placeholder="Ví dụ: 6"
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Mật độ */}
        <Text className="text-sm text-gray-700 mb-1">Mật độ (cây/ha)</Text>
        <Controller
          control={control}
          name="density"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <TextInput
                className="border border-gray-300 rounded-xl px-3 py-3 mb-1"
                keyboardType="number-pad"
                value={String(value ?? "")}
                onChangeText={(t) => onChange(parseNumber(t))}
                placeholder="Ví dụ: 1666"
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        <Text className="text-sm text-gray-700 mt-2 mb-1">
          Khu vực canh tác
        </Text>

        {/* Tỉnh */}
        <Controller
          control={control}
          name="province"
          render={({ field: { value }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 6,
                }}
                data={provinces.map((p) => ({ label: p.name, value: p.code }))}
                labelField="label"
                valueField="value"
                placeholder="Tỉnh/Thành phố"
                value={value}
                search
                onChange={(item: any) => onChangeProvince(item.value)}
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Huyện */}
        <Controller
          control={control}
          name="district"
          render={({ field: { value }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 6,
                }}
                data={districts.map((d) => ({ label: d.name, value: d.code }))}
                labelField="label"
                valueField="value"
                placeholder="Quận/Huyện"
                value={value}
                search
                disable={!provinceCode}
                onChange={(item: any) => onChangeDistrict(item.value)}
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Xã */}
        <Controller
          control={control}
          name="ward"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 6,
                }}
                data={wards.map((w) => ({ label: w.name, value: w.code }))}
                labelField="label"
                valueField="value"
                placeholder="Xã/Phường"
                value={value}
                search
                disable={!districtCode}
                onChange={(item: any) => onChange(item.value)}
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Loại đất */}
        <Text className="text-sm text-gray-700 mt-2 mb-1">Loại đất</Text>
        <Controller
          control={control}
          name="soilType"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 6,
                }}
                data={SOIL_TYPES.map((s) => ({ label: s, value: s }))}
                labelField="label"
                valueField="value"
                placeholder="Chọn loại đất"
                value={value}
                search
                onChange={(item: any) => onChange(item.value)}
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Thời gian trồng */}
        <Text className="text-sm text-gray-700 mt-2 mb-1">Thời gian trồng</Text>
        <Controller
          control={control}
          name="plantingMonth"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 6,
                }}
                data={MONTHS}
                labelField="label"
                valueField="value"
                placeholder="Chọn tháng (gợi ý Tháng 8)"
                value={value}
                onChange={(item: any) => onChange(item.value)}
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Độ chuẩn */}
        <Text className="text-sm text-gray-700 mt-2 mb-1">
          Độ chuẩn (chứng nhận)
        </Text>
        <Controller
          control={control}
          name="certifications"
          render={({ field: { value, onChange } }) => (
            <CertChips
              value={value as CertKey[]}
              onChange={onChange as (v: CertKey[]) => void}
            />
          )}
        />

        {/* Giống cà phê */}
        <Text className="text-sm text-gray-700 mt-3 mb-1">Giống cà phê</Text>
        <Controller
          control={control}
          name="coffeeVariety"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 6,
                }}
                data={COFFEE_VARIETIES.map((v) => ({ label: v, value: v }))}
                labelField="label"
                valueField="value"
                placeholder="Chọn giống"
                value={value}
                search
                onChange={(item: any) => onChange(item.value)}
              />
              {error && (
                <Text className="text-red-600 text-xs mb-2">
                  {error.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Submit */}
        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          className="mt-2 bg-green-800 rounded-2xl py-3 items-center"
        >
          <Text className="text-white font-semibold">
            {isSubmitting ? "Đang tạo..." : "Tạo Báo Cáo"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
