import { ReactNode } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { Header, HeaderProps, StatusBar, Text } from "@components";
import { useAppSafeArea } from "@hooks";

interface Props extends HeaderProps {
  children: ReactNode;
  scrollable?: boolean;
  withoutPadding?: boolean;
  scrollEnabled?: boolean;
  isLoading?: boolean;
}
export function Screen({ children, scrollable, withoutPadding, scrollEnabled = true, isLoading, ...headerProps }: Props) {
  const { bottom } = useAppSafeArea();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background">
        <StatusBar />
        <Header {...headerProps} />
        {isLoading ? (
          <View className="w-full h-full items-center justify-center gap-1">
            <ActivityIndicator size={30} color="white" className="mt-[-100]" />
            <Text className="text-white">Carregando dados...</Text>
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}