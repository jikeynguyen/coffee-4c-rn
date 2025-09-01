import { Slot } from "expo-router";
import "./global.css";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChatbotBubble from "@/components/ChatbotBubble";

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <Slot />
        <ChatbotBubble />
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
