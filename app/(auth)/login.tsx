import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { AuthForm, type FormField } from "../../components/AuthForm";
import { api } from "../../lib/api";
import { saveTokens } from "../../lib/session";
import { LoginForm, loginSchema } from "@/schemas/login";
import { HERO_BG } from "@/constants/heroImage";

const loginFields: FormField<LoginForm>[] = [
  {
    name: "username",
    label: "Email ",
    placeholder: "Nhập email của bạn",
    type: "text",
    keyboardType: "email-address",
    autoCapitalize: "none",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    type: "password",
    secureTextEntry: true,
  },
];

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async (data: LoginForm) => {
    try {
      const res = await api.post("/auth/user", {
        username: data.username,
        password: data.password,
      });
      const { accessToken, refreshToken } = res.data?.data ?? {};
      if (!accessToken || !refreshToken) {
        Alert.alert("Lỗi đăng nhập", "Thông tin đăng nhập không hợp lệ.");
        return;
      }
      await saveTokens(accessToken, refreshToken);
      Alert.alert("Đăng nhập thành công");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Lỗi đăng nhập",
        error?.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại."
      );
    }
  };

  const Header = () => (
    <View className="absolute top-10 left-0 p-4 z-10">
      <TouchableOpacity onPress={() => router.back()} className="p-2">
        <Text className="font-bold text-green-600">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  const Footer = () => (
    <View className="mt-4 flex-row justify-center">
      <Text className="text-gray-100">Chưa có tài khoản? </Text>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text className="font-bold text-lime-400">Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={{ uri: HERO_BG }} className="flex-1">
      <View className="flex-1 bg-black/45">
        <Header />
        <View className="flex-1 justify-center p-4">
          <View className="mb-8">
            <Text className="mb-2 text-center text-3xl font-bold text-white">
              Đăng nhập
            </Text>
            <Text className="text-center text-gray-200">
              Vui lòng đăng nhập để tiếp tục
            </Text>
          </View>

          <View className="rounded-2xl p-4">
            <AuthForm
              schema={loginSchema}
              fields={loginFields}
              onSubmit={handleLogin}
              submitButtonText="Đăng nhập"
              footerComponent={<Footer />}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
