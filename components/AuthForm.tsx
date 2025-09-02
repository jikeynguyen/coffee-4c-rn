import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z, type ZodType } from "zod";

type FieldType = "text" | "email" | "password" | "tel" | "number" | "select";

type BaseField<T> = {
  name: keyof T;
  label: string;
  placeholder: string;
  type: FieldType;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  options?: { label: string; value: string }[];
};

type FieldRow<T> = {
  type: "row";
  key: string;
  fields: BaseField<T>[];
};

export type FormField<T> = BaseField<T> | FieldRow<T>;

interface AuthFormProps<T> {
  schema: ZodType<T>;
  fields: FormField<T>[];
  onSubmit: (data: T) => Promise<void>;
  submitButtonText: string;
  submitButtonLoadingText?: string;
  footerComponent?: React.ReactNode;
  submitColor?: string; // default green
}

export function AuthForm<T>({
  schema,
  fields,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText = "Đang xử lý...",
  footerComponent,
  submitColor = "green",
}: AuthFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRow = (f: FormField<T>): f is FieldRow<T> =>
    (f as any).type === "row";

  const handleChange = (field: keyof T, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as keyof T | undefined;
          if (key) newErrors[key] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      await onSubmit(formData as T);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (field: BaseField<T>) => {
    const baseClass = "w-full px-3 py-3 rounded-xl mb-1  border-2 text-white";
    if (field.type === "select") {
      return (
        <View className="rounded-xl mb-1  border-2 border-white/70">
          <Picker
            selectedValue={(formData[field.name] as string) || ""}
            onValueChange={(value) => handleChange(field.name, value)}
            style={{ height: 50, padding: 0, margin: 0, color: "white" }}
            dropdownIconColor="white"
          >
            <Picker.Item
              label={field.placeholder || "Chọn một lựa chọn"}
              value=""
              color="#d1d5db" // text-gray-300
            />
            {field.options?.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </Picker>
        </View>
      );
    }
    return (
      <TextInput
        value={(formData[field.name] as string) || ""}
        onChangeText={(text) => handleChange(field.name, text)}
        placeholder={field.placeholder}
        placeholderTextColor="#d1d5db" // gray-300
        secureTextEntry={field.secureTextEntry}
        autoCapitalize={field.autoCapitalize}
        keyboardType={field.keyboardType}
        className={`${baseClass} border-white/70`}
      />
    );
  };

  const renderBaseField = (field: BaseField<T>) => (
    <View
      key={field.name as string}
      className="w-full max-w-[400px] self-center mb-4"
    >
      <Text className="mb-1 text-white">{field.label}</Text>
      {renderInput(field)}
      {errors[field.name] && (
        <Text className="text-red-400 text-xs mt-1">
          {errors[field.name] as string}
        </Text>
      )}
    </View>
  );

  const renderRow = (row: FieldRow<T>, idx: number) => (
    <View
      key={row.key || idx}
      className="flex-row w-full max-w-[400px] self-center mb-4"
    >
      {row.fields.map((child, i) => (
        <View
          key={(child.name as string) + i}
          className={`flex-1 ${i === 0 ? "mr-3" : ""}`}
        >
          <Text className="mb-1 text-white">{child.label}</Text>
          {renderInput(child)}
          {errors[child.name] && (
            <Text className="text-red-400 text-xs mt-1">
              {errors[child.name] as string}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View className="w-full">
      {fields.map((f, idx) =>
        "type" in f && (f as any).type === "row"
          ? renderRow(f as FieldRow<T>, idx)
          : renderBaseField(f as BaseField<T>)
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={{ backgroundColor: submitColor }}
        className="p-3 rounded-xl items-center mt-4"
      >
        <Text className="text-white font-medium">
          {isSubmitting ? submitButtonLoadingText : submitButtonText}
        </Text>
      </TouchableOpacity>

      {footerComponent && <View className="mt-4">{footerComponent}</View>}
    </View>
  );
}
