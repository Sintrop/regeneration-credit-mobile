declare module 'react-native-config' {
  export interface NativeConfig {
    REGENERATION_CREDIT_ADDRESS: string;
    MAPBOX_ACCESS_TOKEN: string;
    ACCEPT_INSPECTION_DELAY_BLOCKS: string;
    BLOCKS_TO_EXPIRE_ACCEPTED_INSPECTION: string;
    REGENERATOR_POOL_FUNDS: string;
    INSPECTOR_POOL_FUNDS: string;
    RESEARCHER_POOL_FUNDS: string;
    DEVELOPER_POOL_FUNDS: string;
    CONTRIBUTOR_POOL_FUNDS: string;
    ACTIVIST_POOL_FUNDS: string;
    VALIDATION_POOL_FUNDS: string;
  }
  const Config: NativeConfig;
  export default Config;
}
