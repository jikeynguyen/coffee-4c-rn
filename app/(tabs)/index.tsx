// app/index.tsx
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const HERO_BG =
  "https://images.unsplash.com/photo-1671413945540-eaca7f4257f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwbGFudGF0aW9uJTIwbW91bnRhaW5zJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1NjcxMTkyM3ww&ixlib=rb-4.1.0&q=80&w=1080";
const heroImg = require("/Users/jikeynguyen/Working/coffee-4c/coffee-4c-rn/assets/images/hero.png");

function TWButton({
  title,
  onPress,
  variant = "solid",
  leftIcon,
}: {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline" | "ghost";
  leftIcon?: keyof typeof Ionicons.glyphMap;
}) {
  const base = "flex-row items-center justify-center rounded-2xl";
  const styles =
    variant === "solid"
      ? { backgroundColor: "#4A6A4F" }
      : variant === "outline"
        ? { borderWidth: 1, borderColor: "#ffffff" }
        : {};
  const textCls =
    variant === "solid"
      ? "text-white font-semibold"
      : "text-white font-semibold";
  return (
    <Pressable
      style={styles}
      className={`${base} px-4 py-3`}
      onPress={onPress}
      android_ripple={{ color: "#ffffff33" }}
    >
      {leftIcon ? (
        <Ionicons
          name={leftIcon}
          size={18}
          color={variant === "solid" ? "#fff" : "#fff"}
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text className={textCls}>{title}</Text>
    </Pressable>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: HERO_BG }}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      />
      <SafeAreaView edges={["top", "left", "right"]} className="flex-1">
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Ionicons name="leaf-outline" size={22} color="#fff" />
              <Text className="ml-2 text-base font-extrabold text-white">
                Nông trại 4C
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TWButton
                title="Đăng ký"
                variant="outline"
                onPress={() => router.push("/(auth)/register" as Href)}
              />
              <TWButton
                title="Đăng nhập"
                variant="outline"
                onPress={() => router.push("/(auth)/login" as Href)}
              />
            </View>
          </View>

          {/* Hero copy + CTA */}
          <View className="mt-2">
            <Text className="text-white text-3xl font-bold">
              Ứng dụng quản lý nông trại thông minh
            </Text>
            <Text className="text-white/90 mt-2">
              Lập kế hoạch trồng trọt, quản lý vật tư, nhật ký và truy xuất.
            </Text>
            <ImageBackground
              source={heroImg}
              className="w-full h-full"
              resizeMode="contain"
              accessibilityLabel="PDA App preview"
            >
              <View className="flex-row gap-3 mt-4 items-center">
                <TWButton
                  title="Bắt đầu lập kế hoạch"
                  onPress={() => router.push("/plans" as Href)}
                />
                <TWButton
                  title="Xem báo cáo"
                  variant="outline"
                  onPress={() => router.push("/report" as Href)}
                />
              </View>
            </ImageBackground>
          </View>

          {/* Highlights */}
          <View className="mt-6">
            <Text className="text-white text-lg font-semibold mb-3">
              Tính năng nổi bật
            </Text>
            <View className="flex-row gap-4">
              <View className="flex-1 items-center space-y-2">
                <Ionicons name="analytics-outline" size={22} color="#fff" />
                <Text className="text-center text-sm text-white">
                  Lập kế hoạch canh tác
                </Text>
              </View>
              <View className="flex-1 items-center space-y-2">
                <Ionicons name="rocket-outline" size={22} color="#fff" />
                <Text className="text-center text-sm text-white">
                  Đầu ra đạt chuẩn
                </Text>
              </View>
              <View className="flex-1 items-center space-y-2">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="#fff"
                />
                <Text className="text-center text-sm text-white">
                  Tư vấn kỹ thuật AI
                </Text>
              </View>
            </View>
          </View>

          {/* CTA cuối */}
          <View className="mt-8 mb-2 items-center space-y-3">
            <Text className="text-white/90 text-sm">
              Sẵn sàng canh tác thông minh?
            </Text>
            <View className="flex-row gap-3 mt-6">
              <TWButton
                title="Đăng ký"
                variant="outline"
                onPress={() => router.push("/(auth)/register" as Href)}
              />
              <TWButton
                title="Đăng nhập"
                variant="solid"
                onPress={() => router.push("/(auth)/login" as Href)}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
