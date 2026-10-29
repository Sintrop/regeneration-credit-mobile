import { ReactNode, useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";
import { utils } from "web3";

import { Icon, Screen, Text, TextInput } from "@components";
import { useBlockNumber } from "@domain";
import { useUserContext } from "@hooks";
import { AppStackParamsList } from "@routes";
import {
  GO_SINTROP_RELEASES_URL,
  MINING_GUIDE_CONTRIBUTION_ID,
  NodeOs,
  ReleaseAsset,
  SINTROP_TUTORIALS_URL,
  extractCommands,
  nodeCommand,
  pickReleaseAsset,
} from "@utils";

const OS_LIST: NodeOs[] = ["windows", "ubuntu", "macos"];

/** Latest go-sintrop release, so the download link follows new versions without an app update. */
function useLatestRelease() {
  const { data } = useQuery({
    queryKey: ["GoSintropLatestRelease"],
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<{ tag: string; assets: ReleaseAsset[] }> => {
      const response = await fetch("https://api.github.com/repos/Sintrop/go-sintrop/releases/latest");
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const json = await response.json();
      return { tag: json.tag_name, assets: json.assets ?? [] };
    },
  });
  return data;
}

function CommandBlock({ command }: { command: string }) {
  const { t } = useTranslation();

  function handleCopy() {
    Clipboard.setString(command);
    Toast.show({ type: "success", text1: t("mining.commandCopied") });
  }

  return (
    <TouchableOpacity className="flex-row items-start gap-3 p-3 rounded-xl bg-black/40" onPress={handleCopy} activeOpacity={0.8}>
      <Text className="flex-1 text-green-primary text-xs" style={{ fontFamily: "Menlo" }} selectable>{command}</Text>
      <Icon name="copy" size={16} />
    </TouchableOpacity>
  );
}

function Step({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <View className="flex-row gap-3">
      <View className="w-7 h-7 rounded-full bg-green-primary items-center justify-center">
        <Text className="text-green-secondary font-bold text-sm">{index}</Text>
      </View>
      <View className="flex-1 gap-2">
        <Text className="text-white font-semibold">{title}</Text>
        {children}
      </View>
    </View>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <Text className="text-gray-300 text-sm">{children}</Text>;
}

function LinkButton({ label, onPress, primary }: { label: string; onPress: () => void; primary?: boolean }) {
  return (
    <TouchableOpacity
      className={`self-start h-10 px-4 rounded-xl items-center justify-center ${primary ? "bg-green-primary" : "border border-green-primary"}`}
      onPress={onPress}
    >
      <Text className={`text-sm font-semibold ${primary ? "text-green-secondary" : "text-green-primary"}`}>{label}</Text>
    </TouchableOpacity>
  );
}

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "MiningScreen">;
export function MiningScreen({ navigation }: ScreenProps) {
  const { t, i18n } = useTranslation();
  const { address, isConnected, userType } = useUserContext();
  const { blockNumber } = useBlockNumber();
  const release = useLatestRelease();
  const [os, setOs] = useState<NodeOs>("windows");
  const [typedAddress, setTypedAddress] = useState("");

  const rewardAddress = isConnected ? address : typedAddress.trim();
  const validAddress = utils.isAddress(rewardAddress) ? utils.toChecksumAddress(rewardAddress) : "";
  const asset = release ? pickReleaseAsset(release.assets, os) : undefined;
  const assetName = asset?.name ?? `go-sintrop-${os === "windows" ? "win64" : os === "macos" ? "osx" : "linux"}-${release?.tag ?? "vX.Y.Z"}.zip`;
  const format = (value: number) => Intl.NumberFormat(i18n.language).format(value);

  return (
    <Screen title={t("mining.title")} showBackButton scrollable>
      <View className="gap-4 pb-10">
        <View className="p-5 rounded-2xl bg-green-primary/10 border border-green-primary/40 gap-2">
          <Text className="text-white font-bold text-lg">{t("mining.introTitle")}</Text>
          <Paragraph>{t("mining.introText")}</Paragraph>
          <Paragraph>{t("mining.introSmallNetwork")}</Paragraph>
        </View>

        <View className="p-4 rounded-2xl bg-card-primary gap-3">
          <Text className="text-white font-bold text-lg">{t("mining.addressTitle")}</Text>
          {isConnected ? (
            <>
              <Paragraph>{t("mining.addressConnected")}</Paragraph>
              <Text className="text-white text-sm" selectable>{address}</Text>
            </>
          ) : (
            <>
              <Paragraph>{t("mining.addressPaste")}</Paragraph>
              <TextInput
                placeholder="0x..."
                value={typedAddress}
                onChangeText={setTypedAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {!!typedAddress && !validAddress && <Text className="text-red-300 text-xs">{t("common.invalidAddress")}</Text>}
            </>
          )}
        </View>

        <View className="flex-row p-1 rounded-2xl bg-card-primary">
          {OS_LIST.map(item => {
            const selected = item === os;
            return (
              <TouchableOpacity
                key={item}
                className={`flex-1 h-10 rounded-xl items-center justify-center ${selected ? "bg-green-primary" : ""}`}
                onPress={() => setOs(item)}
              >
                <Text className={`font-semibold ${selected ? "text-green-secondary" : "text-white"}`}>{t(`mining.os.${item}`)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="p-4 rounded-2xl bg-card-primary gap-5">
          <Step index={1} title={t("mining.downloadTitle")}>
            <Paragraph>{t(`mining.download.${os}`, { file: assetName })}</Paragraph>
            {os === "macos" && <Paragraph>{t("mining.macAppleSilicon")}</Paragraph>}
            <LinkButton
              primary
              label={release ? t("mining.downloadButton", { version: release.tag }) : t("mining.openReleases")}
              onPress={() => Linking.openURL(asset?.browser_download_url ?? GO_SINTROP_RELEASES_URL)}
            />
          </Step>

          <Step index={2} title={t("mining.extractTitle")}>
            <Paragraph>{t(`mining.extract.${os}`)}</Paragraph>
            {extractCommands(os, assetName).map(command => <CommandBlock key={command} command={command} />)}
          </Step>

          <Step index={3} title={t("mining.runTitle")}>
            <Paragraph>{t(`mining.run.${os}`)}</Paragraph>
            <CommandBlock command={nodeCommand(os, validAddress)} />
            <Paragraph>{validAddress ? t("mining.runAddressFilled") : t("mining.runAddressMissing")}</Paragraph>
          </Step>

          <Step index={4} title={t("mining.syncTitle")}>
            <Paragraph>{t("mining.syncText")}</Paragraph>
            {blockNumber > 0 && (
              <Text className="text-white text-sm">{t("mining.currentBlock", { block: format(blockNumber) })}</Text>
            )}
          </Step>

          <Step index={5} title={t("mining.mineTitle")}>
            <Paragraph>{t("mining.mineText")}</Paragraph>
            <CommandBlock command="miner.start()" />
            <Paragraph>{t("mining.stopText")}</Paragraph>
            <CommandBlock command="miner.stop()" />
            <Paragraph>{t("mining.exitText")}</Paragraph>
          </Step>

          <Step index={6} title={t("mining.rewardTitle")}>
            <Paragraph>{t("mining.rewardText")}</Paragraph>
            <View className="flex-row flex-wrap gap-2">
              {isConnected && <LinkButton label={t("mining.openMyTokens")} onPress={() => navigation.navigate("MyTokensScreen")} />}
              {isConnected && userType === 0 && (
                <LinkButton primary label={t("mining.registerSupporter")} onPress={() => navigation.navigate("RegisterScreen")} />
              )}
            </View>
          </Step>
        </View>

        <View className="p-4 rounded-2xl bg-card-primary gap-2">
          <Text className="text-white font-bold">{t("mining.tipsTitle")}</Text>
          <Paragraph>{t("mining.tipComputerOn")}</Paragraph>
          <Paragraph>{t("mining.tipRenewable")}</Paragraph>
        </View>

        <View className="p-5 rounded-2xl bg-card-primary border border-green-primary/40 gap-3">
          <Text className="text-white font-bold text-lg">{t("mining.guideTitle")}</Text>
          <Paragraph>{t("mining.guideText")}</Paragraph>
          <LinkButton
            primary
            label={t("mining.openGuide")}
            onPress={() => navigation.navigate("ResourceScreen", { id: MINING_GUIDE_CONTRIBUTION_ID, resourceType: "contribution" })}
          />
          <LinkButton label={t("mining.openTutorials")} onPress={() => Linking.openURL(SINTROP_TUTORIALS_URL)} />
        </View>
      </View>
    </Screen>
  );
}
