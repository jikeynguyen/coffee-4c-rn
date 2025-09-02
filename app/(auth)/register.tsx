import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import { AuthForm, type FormField } from "../../components/AuthForm";
import { api } from "../../lib/api";
import { HERO_BG } from "@/constants/heroImage";
import { RegisterForm, registerSchema } from "@/schemas/register";

const registerFields: FormField<RegisterForm>[] = [
  {
    type: "row",
    key: "name-row",
    fields: [
      {
        name: "firstName",
        label: "Họ",
        placeholder: "Nhập họ của bạn",
        type: "text",
        autoCapitalize: "words",
      },
      {
        name: "lastName",
        label: "Tên",
        placeholder: "Nhập tên của bạn",
        type: "text",
        autoCapitalize: "words",
      },
    ],
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email của bạn",
    type: "email",
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  {
    name: "phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    type: "tel",
    keyboardType: "phone-pad",
  },

  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    type: "password",
    secureTextEntry: true,
  },
  {
    name: "confirmPassword",
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    type: "password",
    secureTextEntry: true,
  },
];

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = async (data: RegisterForm) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        username: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        age: 18,
      };

      const res = await api.post("/users/signUp", payload);

      if (res.data) {
        Alert.alert(
          "Đăng ký thành công",
          "Vui lòng kiểm tra email để xác thực tài khoản.",
          [{ text: "Đăng nhập", onPress: () => router.replace("/login") }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi đăng ký",
        error?.response?.data?.message ||
          "Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại."
      );
    }
  };

  const Header = () => (
    <View className="absolute left-0 top-10 z-10 p-4">
      <TouchableOpacity onPress={() => router.back()} className="p-2">
        <Text className="font-bold text-green-600">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  const Footer = () => (
    <View className="mt-4 flex-row justify-center">
      <Text className="text-gray-100">Đã có tài khoản? </Text>
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text className="font-bold text-lime-400">Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={{ uri: HERO_BG }} className="flex-1">
      <View className="flex-1 bg-black/45">
        <Header />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center p-4">
            <View className="mb-8">
              <Text className="mb-2 text-center text-3xl font-bold text-white">
                Tạo tài khoản
              </Text>
              <Text className="text-center text-gray-200">
                Điền thông tin để tạo tài khoản mới
              </Text>
            </View>

            <View className="rounded-2xl p-4">
              <AuthForm
                schema={registerSchema}
                fields={registerFields}
                onSubmit={handleRegister}
                submitButtonText="Đăng ký"
                footerComponent={<Footer />}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
