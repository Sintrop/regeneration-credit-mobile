import { ReactNode, useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Clipboard from "@react-native-clipboard/clipboard";
import Toast from "react-native-toast-message";

import { Icon, Screen, Text } from "@components";
import { useUserContext } from "@hooks";
import { AppStackParamsList } from "@routes";

import {
  CONTRACT_ROWS,
  FAQ_KEYS,
  HelpRow,
  METAMASK_DOWNLOAD_URL,
  METAMASK_MANUAL_URL,
  NETWORK_ROWS,
  STEP_KEYS,
  TOKEN_ROWS,
  websiteFaqUrl,
} from "./helpContent";

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <View className="p-4 rounded-2xl bg-card-primary gap-3">
      <Text className="text-white font-bold text-lg">{title}</Text>
      {!!description && <Text className="text-gray-300 text-sm">{description}</Text>}
      {children}
    </View>
  );
}

function LinkButton({ label, onPress, primary }: { label: string; onPress: () => void; primary?: boolean }) {
  return (
    <TouchableOpacity
      className={`h-10 px-4 rounded-xl items-center justify-center ${primary ? "bg-green-primary" : "border border-green-primary"}`}
      onPress={onPress}
    >
      <Text className={`text-sm font-semibold ${primary ? "text-green-secondary" : "text-green-primary"}`}>{label}</Text>
    </TouchableOpacity>
  );
}

function CopyRow({ row, translateLabel = true }: { row: HelpRow; translateLabel?: boolean }) {
  const { t } = useTranslation();

  function handleCopy() {
    Clipboard.setString(row.value);
    Toast.show({ type: "success", text1: t("common.copiedToClipboard") });
  }

  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 p-3 rounded-xl bg-card-secondary"
      onPress={handleCopy}
      accessibilityRole="button"
      accessibilityLabel={`${t("help.copy")} ${translateLabel ? t(row.label) : row.label}`}
    >
      <View className="flex-1">
        <Text className="text-gray-400 text-xs">{translateLabel ? t(row.label) : row.label}</Text>
        <Text className="text-white text-sm" selectable>{row.value}</Text>
      </View>
      <Icon name="copy" size={18} />
    </TouchableOpacity>
  );
}

function Step({ index, stepKey, children }: { index: number; stepKey: string; children?: ReactNode }) {
  const { t } = useTranslation();

  return (
    <View className="flex-row gap-3">
      <View className="w-7 h-7 rounded-full bg-green-primary items-center justify-center">
        <Text className="text-green-secondary font-bold text-sm">{index}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-white font-semibold">{t(`help.steps.${stepKey}.title`)}</Text>
        <Text className="text-gray-300 text-sm">{t(`help.steps.${stepKey}.text`)}</Text>
        {children && <View className="flex-row flex-wrap gap-2 mt-2">{children}</View>}
      </View>
    </View>
  );
}

function FaqItem({ faqKey }: { faqKey: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <View className="rounded-xl bg-card-secondary overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center gap-3 p-3"
        onPress={() => setOpen(value => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <Text className="flex-1 text-white font-semibold">{t(`help.faq.${faqKey}.q`)}</Text>
        <Text className="text-green-primary text-xl font-bold w-5 text-center">{open ? "−" : "+"}</Text>
      </TouchableOpacity>
      {open && (
        <Text className="text-gray-300 text-sm px-3 pb-3">{t(`help.faq.${faqKey}.a`)}</Text>
      )}
    </View>
  );
}

type ScreenProps = NativeStackScreenProps<AppStackParamsList, "HelpScreen">;
export function HelpScreen({ navigation }: ScreenProps) {
  const { t, i18n } = useTranslation();
  const { isConnected, handleConnect, switchToSintropChain } = useUserContext();
  const [showContracts, setShowContracts] = useState(false);

  return (
    <Screen title={t("help.title")} showBackButton scrollable>
      <View className="gap-4 pb-10">
        <View className="p-4 rounded-2xl bg-green-primary/10 border border-green-primary/40 gap-1">
          <Text className="text-white font-bold text-lg">{t("help.welcomeTitle")}</Text>
          <Text className="text-gray-200 text-sm">{t("help.welcomeText")}</Text>
        </View>

        <Card title={t("help.stepsTitle")}>
          <View className="gap-5">
            {STEP_KEYS.map((key, index) => (
              <Step key={key} index={index + 1} stepKey={key}>
                {key === "wallet" && (
                  <>
                    <LinkButton primary label={t("help.downloadMetamask")} onPress={() => Linking.openURL(METAMASK_DOWNLOAD_URL)} />
                    <LinkButton label={t("help.metamaskManual")} onPress={() => Linking.openURL(METAMASK_MANUAL_URL)} />
                  </>
                )}
                {key === "connect" && (
                  isConnected
                    ? <LinkButton label={t("help.addNetwork")} onPress={switchToSintropChain} />
                    : <LinkButton primary label={t("common.connect")} onPress={handleConnect} />
                )}
                {key === "gas" && isConnected && (
                  <LinkButton label={t("help.openMyTokens")} onPress={() => navigation.navigate("MyTokensScreen")} />
                )}
              </Step>
            ))}
          </View>
        </Card>

        <Card title={t("help.networkTitle")} description={t("help.networkText")}>
          {NETWORK_ROWS.map(row => <CopyRow key={row.label} row={row} />)}
        </Card>

        <Card title={t("help.tokenTitle")} description={t("help.tokenText")}>
          {TOKEN_ROWS.map(row => <CopyRow key={row.label} row={row} />)}
        </Card>

        <Card title={t("help.contractsTitle")} description={t("help.contractsText")}>
          {showContracts && CONTRACT_ROWS.map(row => <CopyRow key={row.label} row={row} translateLabel={false} />)}
          <TouchableOpacity onPress={() => setShowContracts(value => !value)} className="self-start" hitSlop={8}>
            <Text className="text-green-primary text-sm font-semibold">
              {showContracts ? t("help.hideContracts") : t("help.showContracts", { count: CONTRACT_ROWS.length })}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card title={t("help.faqTitle")}>
          {FAQ_KEYS.map(key => <FaqItem key={key} faqKey={key} />)}
        </Card>

        <View className="items-center gap-2">
          <Text className="text-gray-400 text-sm text-center">{t("help.moreInfo")}</Text>
          <LinkButton label="regenerationcredit.org" onPress={() => Linking.openURL(websiteFaqUrl(i18n.language))} />
        </View>
      </View>
    </Screen>
  );
}
