 
import { Image } from "expo-image";
import { useEffect, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEFAULT_IMAGES = [
  require("../../../assets/authpics/1.png"),
] as const;

const SLIDE_INTERVAL_MS = 3000;
const FADE_MS = 1000;
const ZOOM_SCALE = 1.12;
const PRIMARY_OVERLAY = "rgba(116, 52, 252, 0.6)";

type AuthBackgroundProps = {
  children: ReactNode;
};

/**
 * Full-screen wrapper with a cross-fading, slowly zooming image slideshow and
 * a brand-colored overlay — matches the desktop AuthBackground.
 */
export function AuthBackground({ children }: AuthBackgroundProps) {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [opacities] = useState(() =>
    DEFAULT_IMAGES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0)),
  );
  const [scales] = useState(() => DEFAULT_IMAGES.map(() => new Animated.Value(1)));

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (DEFAULT_IMAGES.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % DEFAULT_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const previous = (active - 1 + DEFAULT_IMAGES.length) % DEFAULT_IMAGES.length;

    DEFAULT_IMAGES.forEach((_, i) => {
      const isActive = i === active;
      const isPrevious = i === previous;

      Animated.timing(opacities[i], {
        toValue: isActive ? 1 : 0,
        duration: reduceMotion ? 0 : FADE_MS,
        useNativeDriver: true,
      }).start();

      if (reduceMotion) {
        scales[i].setValue(1);
        return;
      }

      if (isActive) {
        scales[i].setValue(1);
        Animated.timing(scales[i], {
          toValue: ZOOM_SCALE,
          duration: SLIDE_INTERVAL_MS + FADE_MS,
          useNativeDriver: true,
        }).start();
      } else if (!isPrevious) {
        scales[i].setValue(1);
      }
    });
  }, [active, opacities, reduceMotion, scales]);

  return (
    <View className="flex-1 bg-primary">
      {DEFAULT_IMAGES.map((source, i) => (
        <Animated.View
          key={i}
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: opacities[i],
              transform: [{ scale: scales[i] }],
            },
          ]}
        >
          <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
        </Animated.View>
      ))}

      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: PRIMARY_OVERLAY }]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
