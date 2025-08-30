import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { TextInput as Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z, type ZodType } from 'zod';

type FieldType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'select';

export interface FormField<T> {
  name: keyof T;
  label: string;
  placeholder: string;
  type: FieldType;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  options?: { label: string; value: string }[];
}

interface AuthFormProps<T> {
  schema: ZodType<T>;
  fields: FormField<T>[];
  onSubmit: (data: T) => Promise<void>;
  submitButtonText: string;
  submitButtonLoadingText?: string;
  footerComponent?: React.ReactNode;
}

export function AuthForm<T>({
  schema,
  fields,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText = 'Đang xử lý...',
  footerComponent,
}: AuthFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = (): boolean => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path && typeof path === 'string') {
            newErrors[path] = issue.message;
          }
        });
        setErrors(newErrors as Partial<Record<keyof T, string>>);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData as T);
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle API errors here if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputProps = (field: FormField<T>) => ({
    value: formData[field.name] as string || '',
    onChangeText: (text: string) => handleChange(field.name, text),
    placeholder: field.placeholder,
    secureTextEntry: field.secureTextEntry,
    autoCapitalize: field.autoCapitalize,
    keyboardType: field.keyboardType,
    className: 'w-full p-3 border border-gray-300 rounded-lg mb-1',
  });

  return (
    <View className="w-full">
      {fields.map((field) => (
        <View key={field.name as string} className="w-full max-w-[400px] self-center mb-4">
          <Text className="text-gray-700 mb-1">{field.label}</Text>
          {field.type === 'select' ? (
            <View className="border border-gray-300 rounded-lg mb-1">
              <Picker
                selectedValue={formData[field.name] as string || ''}
                onValueChange={(value) => handleChange(field.name, value)}
                style={{ height: 50, padding: 0, margin: 0 }}
              >
                <Picker.Item label={field.placeholder || 'Chọn một lựa chọn'} value="" />
                {field.options?.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          ) : (
            <TextInput {...getInputProps(field)} />
          )}
          {errors[field.name] && (
            <Text className="text-red-500 text-xs mt-1">
              {errors[field.name] as string}
            </Text>
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={{ backgroundColor: '#4A6A4F' }}
        className="p-3 rounded-lg items-center mt-4"
      >
        <Text className="text-white font-medium">
          {isSubmitting ? submitButtonLoadingText : submitButtonText}
        </Text>
      </TouchableOpacity>

      {footerComponent && (
        <View className="mt-4">
          {footerComponent}
        </View>
      )}
    </View>
  );
}
