import { useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Web3 from "web3";
import Toast from "react-native-toast-message";

import { Text, TextInput } from "@components";
import { useSettingsContext, useTxContext, useUserContext } from "@hooks";
import { ResultNode, contractErrorMessage, formatCallResult, parseArgument } from "@utils";

import { AbiFunction, ContractEntry } from "../../../contracts/registry";

interface Props {
  entry: ContractEntry;
  fn: AbiFunction;
  mode: "read" | "write";
}

function ResultTree({ nodes, depth = 0 }: { nodes: ResultNode[]; depth?: number }) {
  return (
    <View className="gap-1.5" style={{ paddingLeft: depth ? 10 : 0 }}>
      {nodes.map((node, index) => (
        <View key={`${node.label}-${index}`} className="gap-1">
          <Text className="text-gray-400 text-xs">
            {node.label ? `${node.label} · ` : ""}{node.type}
          </Text>
          {node.value !== undefined && (
            <Text className="text-white text-sm" selectable>{node.value === "" ? "\"\"" : node.value}</Text>
          )}
          {!!node.children?.length && (
            <View className="border-l border-card-secondary">
              <ResultTree nodes={node.children} depth={depth + 1} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

/** One contract function: its NatSpec, one field per argument, and the call or the transaction. */
export function FunctionCard({ entry, fn, mode }: Props) {
  const { t } = useTranslation();
  const { rpc } = useSettingsContext();
  const { address, isConnected, handleConnect } = useUserContext();
  const { sendTransaction, registerContinueAction } = useTxContext();
  const doc = entry.docs[fn.name] ?? {};

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>(() => fn.inputs.map(() => ""));
  const [asTokenAmount, setAsTokenAmount] = useState<boolean[]>(() => fn.inputs.map(() => false));
  const [errors, setErrors] = useState<(string | null)[]>(() => fn.inputs.map(() => null));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultNode[] | null>(null);
  const [callError, setCallError] = useState<string | null>(null);

  function collectArguments(): unknown[] | null {
    const parsed = fn.inputs.map((input, index) => parseArgument(input, values[index], asTokenAmount[index]));
    setErrors(parsed.map(item => (item.ok ? null : t(`contracts.argError.${item.error}`))));
    if (parsed.some(item => !item.ok)) return null;
    return parsed.map(item => (item.ok ? item.value : null));
  }

  async function handleRead() {
    const args = collectArguments();
    if (!args) return;
    setLoading(true);
    setResult(null);
    setCallError(null);
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
      const contract = new web3.eth.Contract(entry.abi, entry.address);
      const response = await (contract.methods as any)[fn.name](...args).call(address ? { from: address } : {});
      setResult(formatCallResult(fn.outputs, response));
    } catch (error) {
      setCallError(contractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function handleWrite() {
    if (!isConnected) {
      handleConnect();
      return;
    }
    const args = collectArguments();
    if (!args) return;
    Alert.alert(
      t("contracts.confirmTitle"),
      t("contracts.confirmMessage", { fn: fn.name, contract: entry.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("contracts.send"),
          onPress: () => {
            registerContinueAction(() => Toast.show({ type: "success", text1: t("contracts.txDone", { fn: fn.name }) }));
            sendTransaction({
              interactWithContract: true,
              contractAbi: entry.abi,
              contractAddress: entry.address,
              methodName: fn.name,
              params: args,
            });
          },
        },
      ]
    );
  }

  const signature = `${fn.name}(${fn.inputs.map(input => input.type).join(", ")})`;
  const returns = fn.outputs.map(output => output.type).join(", ");

  return (
    <View className="rounded-2xl bg-card-primary overflow-hidden">
      <TouchableOpacity className="flex-row items-center gap-3 p-4" onPress={() => setOpen(value => !value)} activeOpacity={0.8}>
        <View className="flex-1 gap-1">
          <Text className="text-white font-semibold">{fn.name}</Text>
          {!!(doc.notice || doc.details) && (
            <Text className="text-gray-400 text-xs" numberOfLines={open ? undefined : 2}>{doc.notice || doc.details}</Text>
          )}
        </View>
        <Text className="text-green-primary text-xl font-bold w-5 text-center">{open ? "−" : "+"}</Text>
      </TouchableOpacity>

      {open && (
        <View className="px-4 pb-4 gap-3">
          {!!doc.notice && !!doc.details && <Text className="text-gray-400 text-xs">{doc.details}</Text>}
          <Text className="text-gray-500 text-[11px]" selectable>
            {signature}{returns ? ` → ${returns}` : ""}
          </Text>

          {fn.inputs.map((input, index) => {
            const isUint = input.type.startsWith("uint") && !input.type.endsWith("]");
            const canBeTokenAmount = input.type === "uint256";
            const label = `${input.name || `arg${index}`} (${input.type})`;
            return (
              <View key={`${input.name}-${index}`} className="gap-1">
                <TextInput
                  label={label}
                  placeholder={t(`contracts.placeholder.${placeholderKey(input.type)}`)}
                  value={values[index]}
                  onChangeText={text => setValues(current => current.map((value, i) => (i === index ? text : value)))}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={isUint ? "numbers-and-punctuation" : "default"}
                />
                {!!doc.params?.[input.name] && <Text className="text-gray-500 text-[11px]">{doc.params[input.name]}</Text>}
                {canBeTokenAmount && (
                  <TouchableOpacity
                    className="self-start flex-row items-center gap-2 mt-1"
                    onPress={() => setAsTokenAmount(current => current.map((value, i) => (i === index ? !value : value)))}
                    hitSlop={6}
                  >
                    <View className={`w-4 h-4 rounded border ${asTokenAmount[index] ? "bg-green-primary border-green-primary" : "border-gray-400"}`} />
                    <Text className="text-gray-300 text-xs">{t("contracts.asTokenAmount")}</Text>
                  </TouchableOpacity>
                )}
                {!!errors[index] && <Text className="text-red-300 text-xs">{errors[index]}</Text>}
              </View>
            );
          })}

          <TouchableOpacity
            className={`h-11 rounded-xl items-center justify-center ${mode === "read" ? "bg-green-primary" : "bg-amber-400"}`}
            onPress={mode === "read" ? handleRead : handleWrite}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#0b1a12" /> : (
              <Text className="text-green-secondary font-bold">
                {mode === "read" ? t("contracts.query") : isConnected ? t("contracts.sendTransaction") : t("common.connect")}
              </Text>
            )}
          </TouchableOpacity>

          {!!callError && (
            <View className="p-3 rounded-xl bg-red-400/10 border border-red-400/30">
              <Text className="text-red-300 text-sm" selectable>{callError}</Text>
            </View>
          )}
          {result && (
            <View className="p-3 rounded-xl bg-card-secondary gap-2">
              <Text className="text-green-primary text-xs font-semibold">{t("contracts.result")}</Text>
              <ResultTree nodes={result} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function placeholderKey(type: string) {
  if (type.endsWith("]") || type === "tuple") return "json";
  if (type.startsWith("uint") || type.startsWith("int")) return "integer";
  if (type === "address") return "address";
  if (type === "bool") return "bool";
  if (type.startsWith("bytes")) return "hex";
  return "text";
}
