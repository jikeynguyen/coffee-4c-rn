import LessonCard from "@/components/LessonCard";
import { HERO_BG, HERO_LOCAL } from "@/constants/heroImage";
import { Flashcard, flashcards } from "@/constants/lessons";
import { getRandomFlashcard } from "@/utils/flashcardUtils";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcardDeck, setFlashcardDeck] = useState<Flashcard[]>([]);

  // Khởi tạo ngẫu nhiên 5 flashcard theo bộ chứng nhận đã chọn
  const initializeDeck = useCallback(() => {
    const deck: Flashcard[] = [];
    for (let i = 0; i < 5; i++) {
      const card = getRandomFlashcard(flashcards);
      if (!deck.some(c => c.id === card.id)) {
        deck.push(card);
      } else {
        i--;
      }
    }
    setFlashcardDeck(deck);
    setCurrentCardIndex(0);
  }, []);

  // Khởi tạo deck
  useEffect(() => {
    initializeDeck();
  }, []);

  const handleNextCard = useCallback(() => {
    if (currentCardIndex < flashcardDeck.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      initializeDeck();
    }
  }, [currentCardIndex, flashcardDeck.length, initializeDeck]);

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
            <Text className="text-white text-4xl font-bold">
              Ứng dụng quản lý nông trại thông minh
            </Text>
            <Text className="text-white/90 mt-4 text-lg">
              Lập kế hoạch trồng trọt, quản lý vật tư, cẩm nang canh tác và xuất
              lô.
            </Text>
            <View className="p-4 mt-4">
              <Image
                source={HERO_LOCAL}
                className="w-full h-60 rounded-lg"
                resizeMode="cover"
              />
            </View>

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

          {/* Flashcard Section */}
          <View className="mb-6">
            {flashcardDeck.length > 0 && (
              <View className="w-full">
                <View className="flex-row justify-between items-center mb-4">
                </View>
                <View className="bg-white rounded-2xl">
                  <LessonCard 
                    flashcard={flashcardDeck[currentCardIndex]} 
                    onNext={handleNextCard} 
                  />
                </View>
              </View>
            )}
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
