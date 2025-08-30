import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { AuthForm, type FormField } from '../../components/AuthForm';
import { api } from '../../lib/api';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập họ'),
  lastName: z.string().min(1, 'Vui lòng nhập tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .regex(/^\+?[0-9\s-]+$/, 'Số điện thoại không hợp lệ'),
  gender: z.string().min(1, 'Vui lòng chọn giới tính'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không khớp'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

export type RegisterForm = z.infer<typeof registerSchema>;

const registerFields: FormField<RegisterForm>[] = [
  {
    name: 'firstName',
    label: 'Họ',
    placeholder: 'Nhập họ của bạn',
    type: 'text',
    autoCapitalize: 'words',
  },
  {
    name: 'lastName',
    label: 'Tên',
    placeholder: 'Nhập tên của bạn',
    type: 'text',
    autoCapitalize: 'words',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Nhập email của bạn',
    type: 'email',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
  },
  {
    name: 'phone',
    label: 'Số điện thoại',
    placeholder: 'Nhập số điện thoại',
    type: 'tel',
    keyboardType: 'phone-pad',
  },
  {
    name: 'gender',
    label: 'Giới tính',
    type: 'select',
    placeholder: 'Chọn giới tính',
    options: [
      { label: 'nam', value: 'male' },
      { label: 'nữ', value: 'female' },
      { label: 'khác', value: 'other' }
    ]
  },
  {
    name: 'password',
    label: 'Mật khẩu',
    placeholder: 'Nhập mật khẩu',
    type: 'password',
    secureTextEntry: true,
  },
  {
    name: 'confirmPassword',
    label: 'Xác nhận mật khẩu',
    placeholder: 'Nhập lại mật khẩu',
    type: 'password',
    secureTextEntry: true,
  },
];

const RegisterScreen = () => {
  const router = useRouter();

  const handleRegister = async (data: RegisterForm) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        username: data.email,
        age: 18, 
        gender: data.gender,
      };
      console.log('Sending payload:', payload);
      
      const response = await api.post('/users/signUp', payload);
      console.log('Registration response:', response.data);
      
      Alert.alert(
        'Đăng ký thành công',
        'Tài khoản của bạn đã được tạo. Vui lòng kiểm tra email để xác thực tài khoản.',
        [
          {
            text: 'Đăng nhập',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert(
        'Lỗi đăng ký',
        error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  const Footer = () => (
    <View className="flex-row justify-center mt-4">
      <Text className="text-gray-600">Đã có tài khoản? </Text>
      <TouchableOpacity onPress={() => router.replace('/login')}>
      <Text style={{ color: '#4A6A4F' }} className="text-lg font-bold text-center mb-2">Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center p-4">
        <View className="mb-6">
          <Text style={{ color: '#4A6A4F' }} className="text-2xl font-bold text-center mb-2">Tạo tài khoản</Text>
          <Text className="text-center text-gray-600">
            Điền thông tin để tạo tài khoản mới
          </Text>
        </View>

        <AuthForm
          schema={registerSchema}
          fields={registerFields}
          onSubmit={handleRegister}
          submitButtonText="Đăng ký"
          footerComponent={<Footer />}
        />
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;