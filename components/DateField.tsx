import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const fmt = (d: Date) => {
  const y = d.getFullYear(),
    m = String(d.getMonth() + 1).padStart(2, "0"),
    day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Text className="text-sm text-gray-700 mb-1">{label} (YYYY-MM-DD)</Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="border border-gray-300 rounded-xl px-3 py-3 mb-2"
      >
        <Text>{value || "Chọn ngày"}</Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={open}
        mode="date"
        date={value ? new Date(value) : new Date()}
        onConfirm={(d) => {
          onChange(fmt(d));
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}
