import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HORIZONTAL = 20;

type ScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  /** Extra top padding for screens outside the role header (login / setup). */
  safeTop?: boolean;
};

export function Screen({
  children,
  footer,
  scroll = true,
  safeTop = false,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const paddingTop = safeTop ? insets.top + 16 : 16;
  const paddingBottom = footer ? 16 : 28;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const content = (
    <View
      style={{
        paddingHorizontal: HORIZONTAL,
        paddingTop,
        paddingBottom,
        flexGrow: 1,
      }}
    >
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#7434fc"
                colors={["#7434fc"]}
              />
            }
          >
            {content}
          </ScrollView>
        ) : (
          <View className="flex-1">{content}</View>
        )}
        {footer ? (
          <View
            className="border-t border-border bg-background px-5 pt-3"
            style={{ paddingBottom: insets.bottom + 12 }}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}
