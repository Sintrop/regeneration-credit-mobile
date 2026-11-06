import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEVMClient, type MetamaskConnectEVM } from '@metamask/connect-evm';
// MetaMask Connect loads these with dynamic import(). Importing them up front keeps
// them in the main bundle, so the dev server does not have to split them out.
import '@metamask/mobile-wallet-protocol-core';
import '@metamask/mobile-wallet-protocol-dapp-client';
import 'eciesjs';

import { SINTROP_CHAIN_ID, SINTROP_RPC_URL } from './sintropChain';

/**
 * Where the MetaMask that approves requests lives:
 * - device: MetaMask on this phone, opened by deeplink for every request;
 * - remote: MetaMask on another phone, paired by QR code, so nothing opens here.
 */
export type WalletLinkMode = 'device' | 'remote';


/** When the app was last in use with a connection approved on this phone. */
const LAST_USED_KEY = '@rc/walletLastUsed';

/**
 * A connection approved on this phone survives closing the app for this long.
 * Past it the app opens disconnected, so it never shows a session MetaMask may have ended.
 */
const SESSION_KEEP_MS = 5 * 60 * 1000;

/** What MetaMask Connect and its wallet protocol keep in app storage between launches. */
const LIBRARY_SESSION_KEYS = [
  'multichain-transport',
  'pending_session_request',
  'cache_wallet_getSession',
  'cache_eth_accounts',
  'cache_eth_chainId',
  'sessions:master-list',
  'session_request',
];

let linkMode: WalletLinkMode = 'device';
let walletAppMissingHandler: (() => void) | undefined;
let clientPromise: Promise<MetamaskConnectEVM> | undefined;

export function getLinkMode(): WalletLinkMode {
  return linkMode;
}

export function setLinkMode(mode: WalletLinkMode) {
  linkMode = mode;
}

/** Called when a deeplink to MetaMask cannot be opened because the app is not installed. */
export function onWalletAppMissing(handler: (() => void) | undefined) {
  walletAppMissingHandler = handler;
}

function openWalletLink(link: string) {
  if (linkMode === 'remote') return;
  Linking.openURL(link).catch(() => walletAppMissingHandler?.());
}

/**
 * Erases the sessions and pairings MetaMask Connect keeps in storage. On launch
 * the library resumes whatever it finds there before the app can use it: an
 * unfinished pairing holds every connection for up to two minutes, and a session
 * MetaMask has already dropped looks connected until a request fails.
 */
export async function forgetWalletSession(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stored = keys.filter(key => LIBRARY_SESSION_KEYS.includes(key) || key.startsWith('session:'));
    await AsyncStorage.multiRemove([...stored, LAST_USED_KEY]);
  } catch {
    // Nothing stored to clear.
  }
}

/** Records that the connection approved on this phone is in use, so a quick reopen keeps it. */
export async function markSessionUsed(): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_USED_KEY, String(Date.now()));
  } catch {
    // Without it the next launch starts disconnected.
  }
}

async function dropStaleSession(): Promise<void> {
  try {
    const lastUsed = Number(await AsyncStorage.getItem(LAST_USED_KEY));
    if (lastUsed && Date.now() - lastUsed < SESSION_KEEP_MS) return;
  } catch {
    // Unreadable storage counts as a stale session.
  }
  await forgetWalletSession();
}

/** The MetaMask Connect client is a singleton: created once and shared by the whole app. */
export function getWalletClient(): Promise<MetamaskConnectEVM> {
  if (!clientPromise) {
    clientPromise = dropStaleSession().then(() => createEVMClient({
      dapp: {
        name: 'Regeneration Credit',
        url: 'https://regenerationcredit.org',
        iconUrl: 'https://regenerationcredit.org/favicon.ico',
      },
      api: {
        supportedNetworks: { [SINTROP_CHAIN_ID]: SINTROP_RPC_URL },
      },
      mobile: {
        preferredOpenLink: openWalletLink,
      },
      analytics: {
        enabled: false,
      },
    })).catch(error => {
      clientPromise = undefined;
      throw error;
    });
  }
  return clientPromise;
}

/** MetaMask Connect error for a connection it still considers in progress. */
export function isPendingConnection(error: unknown): boolean {
  const err = error as { code?: number; message?: string };
  return err?.code === -32002 || /pending/i.test(err?.message ?? '');
}
