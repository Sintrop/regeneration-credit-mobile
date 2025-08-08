import { ReactNode } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Header, HeaderProps, StatusBar } from "@components";

interface Props extends HeaderProps {
  children: ReactNode
  scrollable?: boolean
}
export function Screen({ children, scrollable, ...headerProps }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background">
        <StatusBar />
        <Header {...headerProps} />
        {scrollable ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </KeyboardAvoidingView>
  )
}