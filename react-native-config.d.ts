declare module 'react-native-config' {
  export interface NativeConfig {
    REGENERATION_CREDIT_ADDRESS: string;
    MAPBOX_ACCESS_TOKEN: string;
    ACCEPT_INSPECTION_DELAY_BLOCKS: string;
    BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION: string;
  }
  const Config: NativeConfig;
  export default Config;
}
