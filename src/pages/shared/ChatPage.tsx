import { MessageCircle } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useMe } from "@/hooks/auth/useMe";
import { useChatConversations, useChatMessages, useSendChatMessage } from "@/hooks/chat/useChat";
import { useChatSocket } from "@/hooks/chat/useChatSocket";
import { toastApiError } from "@/lib/apiError";
import { formatRelative, fullName } from "@/lib/format";

export function ChatPage() {
  const me = useMe();
  const conversations = useChatConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const messages = useChatMessages(activeId);
  const send = useSendChatMessage(activeId ?? "");
  const [body, setBody] = useState("");
  useChatSocket(activeId);

  const active = conversations.items.find((item) => item.id === activeId);
  const title =
    active?.title ||
    fullName(active?.participants?.find((p) => p.userId !== me.data?.id)?.user) ||
    "Messages";

  return (
    <Screen>
      <TopBar
        title={activeId ? title : "Messages"}
        back={!!activeId}
        onBack={() => setActiveId(null)}
      />

      {!activeId ? (
        conversations.items.length === 0 && !conversations.isLoading ? (
          <EmptyState
            icon={MessageCircle}
            title="No conversations"
            body="When IT Support messages you, the thread will appear here."
          />
        ) : (
          <View className="gap-3">
            {conversations.items.map((conversation) => (
              <Pressable key={conversation.id} onPress={() => setActiveId(conversation.id)}>
                <Card className="p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-base font-semibold" numberOfLines={1}>
                      {conversation.title ||
                        fullName(
                          conversation.participants?.find((p) => p.userId !== me.data?.id)?.user,
                        ) ||
                        "Conversation"}
                    </Text>
                    {conversation.lastMessage?.createdAt ? (
                      <Text className="ml-2 text-xs text-muted-foreground">
                        {formatRelative(conversation.lastMessage.createdAt)}
                      </Text>
                    ) : null}
                  </View>
                  {conversation.lastMessage ? (
                    <Text className="mt-1 text-sm text-muted-foreground" numberOfLines={2}>
                      {conversation.lastMessage.body}
                    </Text>
                  ) : (
                    <Text className="mt-1 text-sm text-muted-foreground">No messages yet</Text>
                  )}
                </Card>
              </Pressable>
            ))}
          </View>
        )
      ) : (
        <View>
          <View className="mb-4 gap-3">
            {messages.items.map((message) => {
              const isMine = message.senderId === me.data?.id;
              return (
                <View key={message.id} className={`flex-row ${isMine ? "justify-end" : "justify-start"}`}>
                  <View
                    className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                      isMine ? "bg-primary" : "border border-border bg-secondary"
                    }`}
                  >
                    <Text className={`text-base leading-5 ${isMine ? "text-primary-foreground" : "text-foreground"}`}>
                      {message.body}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="flex-row items-end gap-2">
            <Input
              className="flex-1"
              value={body}
              onChangeText={setBody}
              placeholder="Type a message"
            />
            <Button
              className="min-h-12 px-5"
              disabled={!body.trim() || send.isPending}
              onPress={() =>
                send.mutate(
                  { body: body.trim() },
                  {
                    onSuccess: () => setBody(""),
                    onError: (error) => toastApiError(error),
                  },
                )
              }
            >
              Send
            </Button>
          </View>
        </View>
      )}
    </Screen>
  );
}
