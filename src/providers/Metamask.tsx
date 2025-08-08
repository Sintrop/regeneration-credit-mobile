import { Linking } from 'react-native';
import {
  MetaMaskProvider,
  SDKConfigProvider,
  useSDKConfig,
} from '@metamask/sdk-react';
import BackgroundTimer from 'react-native-background-timer';
import React from 'react';

const SdkConfig = ({ children }: { children: React.ReactNode }) => {
  const { useDeeplink, debug, checkInstallationImmediately } = useSDKConfig();

  return (
    <MetaMaskProvider
      debug={debug}
      sdkOptions={{
        readonlyRPCMap: {
          '0x640': 'https://sequoiarpc.sintrop.com',
        },
        logging: {
          developerMode: true,
          plaintext: true,
        },
        openDeeplink: (link: string) => {
          Linking.openURL(link);
        },
        timer: BackgroundTimer,
        useDeeplink,
        checkInstallationImmediately,
        storage: {
          enabled: true,
          // storageManager: new StoraManagerAS(),
        },
        dappMetadata: {
          name: 'Regeneration Credit',
          url: 'https://regenerationcredit.org',
        },
        i18nOptions: {
          enabled: true,
        },
      }}
    >
      {children}
    </MetaMaskProvider>
  );
};

interface Props {
  children: React.ReactNode;
}
export function MMProvider({ children }: Props) {
  return (
    <SDKConfigProvider>
      <SdkConfig>{children}</SdkConfig>
    </SDKConfigProvider>
  );
}
