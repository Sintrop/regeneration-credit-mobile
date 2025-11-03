import React from "react";
import { useWindowDimensions, View } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

export function InspectionLoading() {
  const { width } = useWindowDimensions();
  
  return (
    <View className="w-full bg-card-primary p-5 mb-5 rounded-2xl">
      <ContentLoader 
        speed={2}
        width={width - 60}
        height={150}
        viewBox={`0 0 ${width - 60} 150`}
        backgroundColor="#012939"
        foregroundColor="#ecebeb"
      >
        <Rect x="43" y="12" rx="3" ry="3" width="190" height="13" /> 
        <Rect x="44" y="30" rx="3" ry="3" width="164" height="9" /> 
        <Rect x="8" y="100" rx="3" ry="3" width={width - 60} height="47" /> 
        <Circle cx="20" cy="26" r="18" /> 
        <Circle cx="21" cy="74" r="18" /> 
        <Rect x="45" y="60" rx="3" ry="3" width="190" height="13" /> 
        <Rect x="45" y="78" rx="3" ry="3" width="164" height="9" />
      </ContentLoader>
    </View>
  )
}
