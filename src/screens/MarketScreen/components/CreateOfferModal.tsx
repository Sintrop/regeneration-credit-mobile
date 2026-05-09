import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, Keyboard, ScrollView, Platform } from "react-native";
import { useKeyboardStatus, useAppSafeArea } from "@hooks";
import { useCreateOffer } from "@domain/RCMarket";
import { useUserContext } from "@hooks";

interface CreateOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOfferModal({ isVisible, onClose, onSuccess }: CreateOfferModalProps) {
  const { createOffer, isLoading } = useCreateOffer();
  const { address } = useUserContext();
  const { bottom } = useAppSafeArea();
  const { keyboardHeight, keyboardOpen } = useKeyboardStatus();
  
  const paddingBottom = keyboardOpen ? keyboardHeight + bottom + 20 : bottom + 20;
  
  const [amountRC, setAmountRC] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (!amountRC || !unitPrice || !paymentMethod || !description) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    createOffer({
      amountRC,
      unitPrice,
      paymentMethod,
      description,
    });

    // Reset form
    setAmountRC("");
    setUnitPrice("");
    setPaymentMethod("");
    setDescription("");
    
    onSuccess();
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-900 p-4" style={{ paddingBottom }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-xl font-bold">
            Publicar Oferta
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text className="text-gray-400">🔼</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-400">X</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Amount RC */}
          <Text className="text-gray-300 mb-2">Quantidade de RC *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4"
            placeholder="Ex: 1000"
            placeholderTextColor="#666"
            value={amountRC}
            onChangeText={setAmountRC}
            keyboardType="numeric"
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {/* Unit Price */}
          <Text className="text-gray-300 mb-2">Preço Unitário *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4"
            placeholder="Ex: R$0,10"
            placeholderTextColor="#666"
            value={unitPrice}
            onChangeText={setUnitPrice}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {/* Payment Method */}
          <Text className="text-gray-300 mb-2">Método de Pagamento *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4"
            placeholder="Ex: pix:12345678901@nubank"
            placeholderTextColor="#666"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {/* Description */}
          <Text className="text-gray-300 mb-2">Descrição *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4 h-24"
            placeholder="Ex: Vendo X tokens a Y BRL cada. Contato: meucontato@exemplo.com"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {/* Submit Button */}
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-emerald-600 h-12 rounded-xl items-center justify-center"
          >
            <Text className="text-white font-bold">
              {isLoading ? "Publicando..." : "Publicar Oferta"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}