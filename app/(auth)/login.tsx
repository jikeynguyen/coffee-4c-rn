import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { AuthForm, type FormField } from '../../components/AuthForm';
import { api } from '../../lib/api';
import { saveTokens } from '../../lib/session';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Vui lòng nhập email hoặc số điện thoại")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
      }
    ),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginForm = z.infer<typeof loginSchema>;

const loginFields: FormField<LoginForm>[] = [
  {
    name: 'username',
    label: 'Email hoặc số điện thoại',
    placeholder: 'Nhập email hoặc số điện thoại',
    type: 'text',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu',
    type: 'password',
    secureTextEntry: true,
  },
];

const LoginScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginForm) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', data);
      await saveTokens(
        response.data.access_token,
        response.data.refresh_token,
      );
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Lỗi đăng nhập',
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.'
      );
    } finally {
      setLoading(false);
    }
  };

  const Footer = () => (
    <View className="flex-row justify-center mt-4">
      <Text className="text-gray-600">Chưa có tài khoản? </Text>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text className="text-blue-500 font-medium">Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-center mb-2">Đăng nhập</Text>
        <Text className="text-center text-gray-600">
          Vui lòng đăng nhập để tiếp tục
        </Text>
      </View>

      <AuthForm
        schema={loginSchema}
        fields={loginFields}
        onSubmit={handleLogin}
        submitButtonText="Đăng nhập"
        footerComponent={<Footer />}
      />
    </View>
  );
};

export default LoginScreen;
