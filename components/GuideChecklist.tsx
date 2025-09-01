// components/GuideChecklist.tsx
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GUIDE_YEARS_DEFAULT, type GuideYear } from "@/constants/guide";

type CheckedMap = Record<string, boolean>;

export default function GuideChecklist({
  years,
  storageKey = "guide_checked_v2",
}: {
  years?: GuideYear[];
  storageKey?: string;
}) {
  const data = years ?? GUIDE_YEARS_DEFAULT;
  const { width } = useWindowDimensions();
  const ref = useRef<ScrollView>(null);
  const [idx, setIdx] = useState(0);
  const [checked, setChecked] = useState<CheckedMap>({});

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((s) =>
      setChecked(s ? JSON.parse(s) : {})
    );
  }, [storageKey]);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const jump = (i: number) => {
    setIdx(i);
    ref.current?.scrollTo({ x: i * width, animated: true });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tabs header */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row bg-gray-100 rounded-2xl p-1">
          {["Năm 1", "Năm 2", "Năm 3"].map((t, i) => (
            <Pressable
              key={t}
              onPress={() => jump(i)}
              className={`flex-1 py-2 rounded-2xl items-center ${
                idx === i ? "bg-green-600" : ""
              }`}
            >
              <Text
                className={`${
                  idx === i ? "text-white" : "text-gray-800"
                } font-semibold`}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Horizontal pager */}
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIdx(Math.round(e.nativeEvent.contentOffset.x / width))
        }
      >
        {data.map((block) => (
          <View key={block.year} style={{ width }}>
            {/* mỗi năm bọc thêm vertical scroll */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              showsVerticalScrollIndicator
            >
              <View className="bg-white border border-gray-200 rounded-2xl p-4">
                <Text className="text-lg font-semibold mb-1">
                  Lộ trình Năm {block.year}
                </Text>

                {block.sections.map((sec) => (
                  <View key={sec.name} className="mb-4">
                    <Text className="font-semibold mb-2">{sec.name}</Text>
                    {sec.items.map((item) => {
                      const done = !!checked[item.id];
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => toggle(item.id)}
                          className={`rounded-xl border px-3 py-2 mb-2 ${
                            done
                              ? "bg-green-50 border-green-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <View className="flex-row justify-between">
                            <Text
                              className={`font-medium ${
                                done ? "text-green-700" : "text-gray-900"
                              }`}
                            >
                              {item.title}
                            </Text>
                            <Text className="text-xs text-gray-600">
                              {item.window}
                            </Text>
                          </View>
                          {item.desc ? (
                            <Text className="text-xs text-gray-700 mt-1">
                              {item.desc}
                            </Text>
                          ) : null}
                          <Text
                            className={`mt-2 text-xs ${
                              done ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {done ? "✓ Đã xong" : "□ Chưa xong"}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
