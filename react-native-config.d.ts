declare module 'react-native-config' {
  export interface NativeConfig {
    REGENERATION_CREDIT_ADDRESS: string;
    MAPBOX_ACCESS_TOKEN: string;
  }
  const Config: NativeConfig;
  export default Config;
}
