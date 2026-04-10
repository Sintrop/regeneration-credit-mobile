import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { useCreateOffer } from "@domain";
import { Button } from "@components";

interface CreateOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOfferModal({ isVisible, onClose, onSuccess }: CreateOfferModalProps) {
  const { createOffer, isLoading } = useCreateOffer();
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
      <View className="flex-1 bg-gray-900 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-xl font-bold">
            Publicar Oferta
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-400">X</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Amount RC */}
          <Text className="text-gray-300 mb-2">Quantidade de RC *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4"
            placeholder="Ex: 1000"
            placeholderTextColor="#666"
            value={amountRC}
            onChangeText={setAmountRC}
            keyboardType="numeric"
          />

          {/* Unit Price */}
          <Text className="text-gray-300 mb-2">Preço Unitário *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4"
            placeholder="Ex: R$0,10"
            placeholderTextColor="#666"
            value={unitPrice}
            onChangeText={setUnitPrice}
          />

          {/* Payment Method */}
          <Text className="text-gray-300 mb-2">Método de Pagamento *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4"
            placeholder="Ex: pix:12345678901@nubank"
            placeholderTextColor="#666"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />

          {/* Description */}
          <Text className="text-gray-300 mb-2">Descrição *</Text>
          <TextInput
            className="bg-gray-800 text-white p-3 rounded-lg mb-4 h-24"
            placeholder="Descrição da oferta..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Submit Button */}
          <Button 
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-emerald-600"
          >
            {isLoading ? "Publicando..." : "Publicar Oferta"}
          </Button>
        </ScrollView>
      </View>
    </Modal>
  );
}