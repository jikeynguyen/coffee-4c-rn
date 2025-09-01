import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      ? { backgroundColor: '#4A6A4F' }
      : variant === "outline"
      ? { borderWidth: 1, borderColor: '#4A6A4F' }
      : {};
  const text =
    variant === "solid"
      ? "text-white font-semibold"
      : variant === "outline"
      ? "text-[green] font-semibold"
      : "text-[green] font-semibold";
  return (
    <Pressable 
      style={styles}
      className={`${base} ${variant === 'ghost' ? '' : 'px-4 py-3'} ${variant === 'solid' ? 'bg-brand' : variant === 'outline' ? 'border border-gray-300' : ''}`} 
      onPress={onPress}
    >
      {leftIcon ? (
        <Ionicons name={leftIcon} size={18} style={{ marginRight: 8 }} />
      ) : null}
      <Text className={text}>{title}</Text>
    </Pressable>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      {children}
    </View>
  );
}

export default function HomePage() {
  const router = useRouter();
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Ionicons name="leaf-outline" size={22} />
            <Text className="ml-2 text-base font-semibold">
              Nông trại 4C
            </Text>
          </View>
          <TWButton
            title="Tạo tài khoản"
            variant="ghost"
            onPress={() => router.push("/(auth)/register" as Href)}
          />
          <TWButton
            title="Đăng nhập"
            variant="ghost"
            onPress={() => router.push("/(auth)/login" as Href)}
          />
        </View>

        {/* Hero */}
        <View className="space-y-3 mt-2">
          <Text className="text-2xl font-bold">
            Ứng dụng quản lý nông trại thông minh
          </Text>
          <Text className="text-gray-700">
            Lập kế hoạch trồng trọt, quản lý vật tư, ghi nhật ký, phân tích tài
            chính và truy xuất nguồn gốc.
          </Text>
        </View>

        {/* Preview */}
        <Card>
          <View className="aspect-[16/9] bg-gray-100 rounded-xl items-center justify-center">
            <View className="flex-row items-center">
              <Ionicons name="phone-portrait-outline" size={18} />
              <Text className="ml-2 text-gray-600">PDA App preview</Text>
            </View>
          </View>
        </Card>

        {/* Highlights */}
        <View className="mt-8 space-y-3">
          <Text className="text-lg font-semibold">Tính năng nổi bật</Text>
          <View className="flex-row gap-4">
            <View className="flex-1 items-center space-y-2">
              <Ionicons name="analytics-outline" size={22} />
              <Text className="text-center text-sm text-gray-700">
                Phân tích dòng tiền & báo cáo
              </Text>
            </View>
            <View className="flex-1 items-center space-y-2">
              <Ionicons name="qr-code-outline" size={22} />
              <Text className="text-center text-sm text-gray-700">
                Truy xuất nguồn gốc
              </Text>
            </View>
            <View className="flex-1 items-center space-y-2">
              <Ionicons name="chatbubble-ellipses-outline" size={22} />
              <Text className="text-center text-sm text-gray-700">
                Tư vấn kỹ thuật AI
              </Text>
            </View>
          </View>
        </View>

        {/* CTA cuối */}
        <View className="mt-10 items-center space-y-3">
          <Text className="text-sm text-gray-600">
            Sẵn sàng bắt đầu canh tác thông minh?
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
