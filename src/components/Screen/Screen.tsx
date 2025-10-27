import { ReactNode } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Header, HeaderProps, StatusBar } from "@components";
import { useAppSafeArea } from "@hooks";

interface Props extends HeaderProps {
  children: ReactNode;
  scrollable?: boolean;
  withoutPadding?: boolean;
  scrollEnabled?: boolean;
}
export function Screen({ children, scrollable, withoutPadding, scrollEnabled = true, ...headerProps }: Props) {
  const { bottom } = useAppSafeArea();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background">
        <StatusBar />
        <Header {...headerProps} />
        {scrollable ? (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            className={withoutPadding ? 'px-0 pt-0' : 'px-3 pt-5'}
            scrollEnabled={scrollEnabled}
          >
            {children}
            <View style={{ marginBottom: bottom }}/>
          </ScrollView>
        ) : (
          children
        )}
      </View>
    </KeyboardAvoidingView>
  )
}