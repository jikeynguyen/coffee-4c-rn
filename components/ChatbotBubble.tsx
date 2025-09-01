// components/ChatbotBubble.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadPlanSnapshot } from "@/utils/planSnapshot";
import { hasVoice, Voice } from "@/helpers/voice";

type Role = "user" | "bot";
type Msg = { id: string; role: Role; text: string };

const API_URL = "https://inspired-bear-emerging.ngrok-free.app/chat";
const HIST_KEY = "sf_chat_history_v2";
const { width: W, height: H } = Dimensions.get("window");
const MARGIN = 8;
const FAB = { w: 56, h: 56 };

async function askApi(message: string, ctx?: any) {
  let full = message;
  if (ctx) {
    full += "\n\n--- Thông tin bối cảnh ---\n";
    if (ctx.landInfo)
      full += `Vị trí: ${ctx.landInfo.province || ""} ${ctx.landInfo.district || ""} ${ctx.landInfo.ward || ""}\n`;
    if (ctx.planData) {
      const p = ctx.planData;
      if (p.areaHa != null) full += `Diện tích: ${p.areaHa} ha\n`;
      if (p.densityPerHa != null) full += `Mật độ: ${p.densityPerHa} cây/ha\n`;
      if (p.totalTrees != null) full += `Tổng số cây: ${p.totalTrees}\n`;
      if (p.y1Cost != null) full += `Chi phí năm 1: ${p.y1Cost}\n`;
      if (p.y3Revenue != null)
        full += `Doanh thu dự kiến năm 3: ${p.y3Revenue}\n`;
    }
  }
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: full,
      conversation_id: "coffee_farm_chat",
      use_rag: true,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.response as string) || "Không nhận được câu trả lời.";
}

export default function ChatbotBubble() {
  // UI state
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "greet", role: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);

  // draggable FAB
  const fabPos = useRef(
    new Animated.ValueXY({ x: W - FAB.w - MARGIN, y: H * 0.7 })
  ).current;
  const dockRight = useRef(true);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => fabPos.stopAnimation(),
      onPanResponderMove: Animated.event(
        [null, { dx: fabPos.x, dy: fabPos.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_e, g) => {
        // snapshot current absolute pos
        fabPos.extractOffset();
        fabPos.setOffset({ x: 0, y: 0 });
        fabPos.flattenOffset();
        fabPos.getLayout(); // noop, ensures internal state

        let toX = g.moveX - FAB.w / 2;
        let toY = g.moveY - FAB.h / 2;
        toY = clamp(toY, MARGIN, H - FAB.h - MARGIN);
        const snapRight = toX > W / 2;
        dockRight.current = snapRight;
        toX = snapRight ? W - FAB.w - MARGIN : MARGIN;

        Animated.spring(fabPos, {
          toValue: { x: toX, y: toY },
          useNativeDriver: false,
          bounciness: 6,
        }).start();
      },
    })
  ).current;

  // history
  useEffect(() => {
    AsyncStorage.getItem(HIST_KEY).then((s) => s && setMsgs(JSON.parse(s)));
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(HIST_KEY, JSON.stringify(msgs));
  }, [msgs]);

  // STT setup
  useEffect(() => {
    if (!hasVoice) return; // không đăng ký listener khi thiếu module
    Voice.onSpeechResults = (e: any) => {
      const t = e.value?.[0];
      if (t) setInput((prev) => (prev ? prev + " " + t : t));
    };
    Voice.onSpeechError = () => setRecording(false);
    return () => {
      Voice?.destroy?.().catch(() => {});
      Voice?.removeAllListeners?.();
    };
  }, []);

  const startSTT = async () => {
    if (!hasVoice || recording) return;
    setRecording(true);
    try {
      await Voice.start("vi-VN");
    } catch {
      setRecording(false);
    }
  };
  const stopSTT = async () => {
    if (!hasVoice || !recording) return;
    try {
      await Voice.stop();
    } finally {
      setRecording(false);
    }
  };

  const toggleOpen = () => setOpen((p) => !p);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const userMsg: Msg = { id: String(Date.now()), role: "user", text };
    setMsgs((m) => [...m, userMsg]);

    // load snapshot cho context
    setSending(true);
    const typingId = `typing-${Date.now()}`;
    setMsgs((m) => [...m, { id: typingId, role: "bot", text: "..." }]);

    try {
      const snap = await loadPlanSnapshot(); // {areaHa,...,province,...}
      const ctx = snap
        ? {
            planData: {
              areaHa: snap.areaHa,
              densityPerHa: snap.densityPerHa,
              totalTrees: snap.totalTrees,
              y1Cost: snap.y1Cost,
              y3Revenue: snap.y3Revenue,
            },
            landInfo: {
              province: snap.province,
              district: snap.district,
              ward: snap.ward,
            },
          }
        : undefined;

      const reply = await askApi(text, ctx);
      setMsgs((m) =>
        m
          .filter((x) => x.id !== typingId)
          .concat({ id: `bot-${Date.now()}`, role: "bot", text: reply })
      );
    } catch (e: any) {
      setMsgs((m) =>
        m
          .filter((x) => x.id !== typingId)
          .concat({
            id: `err-${Date.now()}`,
            role: "bot",
            text: `Lỗi kết nối: ${e?.message || "unknown"}`,
          })
      );
    } finally {
      setSending(false);
    }
  }, [input, sending]);

  const renderItem = ({ item }: { item: Msg }) => (
    <View
      className={`w-full my-1 px-3 ${item.role === "user" ? "items-end" : "items-start"}`}
    >
      <View
        className={`max-w-[80%] rounded-2xl px-3 py-2 ${item.role === "user" ? "bg-[#2F5233]" : "bg-gray-100"}`}
      >
        <Text
          className={`${item.role === "user" ? "text-white" : "text-gray-900"}`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  // compute chat window dock side
  const chatSideStyle = dockRight.current
    ? { right: MARGIN }
    : { left: MARGIN };

  return (
    <>
      {/* Draggable FAB */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: FAB.w,
            height: FAB.h,
            borderRadius: FAB.w / 2,
            backgroundColor: "#2F5233",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          },
          { transform: fabPos.getTranslateTransform() },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable
          onPress={toggleOpen}
          style={{
            width: FAB.w,
            height: FAB.h,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="text-white text-xl">{recording ? "●" : "🤖"}</Text>
        </Pressable>
      </Animated.View>

      {/* Chat window, dock theo cạnh */}
      {open ? (
        <View
          className="absolute bottom-20 w-[92%] max-w-[380px] h-[70%] bg-white rounded-2xl shadow-2xl z-40 overflow-hidden"
          style={chatSideStyle}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 bg-[#2F5233]">
            <Text className="text-white font-bold">Trợ lý Nông nghiệp</Text>
            <Pressable onPress={toggleOpen}>
              <Text className="text-white text-2xl">×</Text>
            </Pressable>
          </View>

          {/* Messages */}
          <FlatList
            data={msgs}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 8 }}
          />

          {/* Input row */}
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
          >
            <View className="flex-row items-center gap-2 px-2 py-2 border-t border-gray-200">
              <TextInput
                placeholder="Nhập câu hỏi..."
                value={input}
                onChangeText={setInput}
                className="flex-1 bg-gray-100 rounded-xl px-3 py-2"
                editable={!sending}
                multiline
              />
              {/* Mic */}
              <Pressable
                onPress={recording ? stopSTT : startSTT}
                className="px-2 py-2 rounded-xl"
              >
                <Text className={recording ? "text-red-500" : "text-gray-700"}>
                  🎤
                </Text>
              </Pressable>
              <Pressable
                onPress={send}
                disabled={sending || !input.trim()}
                className={`px-3 py-2 rounded-xl ${sending || !input.trim() ? "bg-gray-300" : "bg-[#6A8A6D]"}`}
              >
                <Text className="text-white font-semibold">Gửi</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      ) : null}
    </>
  );
}
