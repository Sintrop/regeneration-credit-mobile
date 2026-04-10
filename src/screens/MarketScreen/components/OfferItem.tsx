import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Offer, useCancelOffer, useConfirmSale } from "@domain";

interface OfferItemProps {
  offer: Offer;
  currentUserAddress?: string;
  onRefresh: () => void;
}

export function OfferItem({ offer, currentUserAddress, onRefresh }: OfferItemProps) {
  const { cancelOffer } = useCancelOffer();
  const { confirmSale } = useConfirmSale();

  const isOwner = currentUserAddress?.toLowerCase() === offer.seller.toLowerCase();
  const isCompleted = !offer.active && offer.completedAt > 0;

  function handleBuy() {
    Alert.alert(
      "Comprar",
      "O mercado é apenas informativo, você deverá entrar em contato com o vendedor pessoalmente. Veja na descrição da oferta as instruções do vendedor.",
      [{ text: "OK" }]
    );
  }

  function handleCancel() {
    Alert.alert(
      "Cancelar Oferta",
      "Tem certeza que deseja cancelar esta oferta?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim", 
          onPress: () => {
            cancelOffer({ offerId: offer.id });
            onRefresh();
          }
        }
      ]
    );
  }

  function handleConfirm() {
    // Need buyer address - in real app would have a way to input
    Alert.prompt(
      "Confirmar Venda",
      "Digite o endereço da carteira do comprador:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar",
          onPress: (buyerAddress?: string) => {
            if (buyerAddress && buyerAddress.startsWith("0x")) {
              confirmSale({ offerId: offer.id, buyer: buyerAddress });
              onRefresh();
            } else {
              Alert.alert("Erro", "Endereço inválido");
            }
          }
        }
      ],
      "plain-text"
    );
  }

  // Status text
  let statusText = "Ativa";
  let statusColor = "text-green-400";
  
  if (isCompleted) {
    statusText = "Concluída";
    statusColor = "text-blue-400";
  } else if (!offer.active) {
    statusText = "Cancelada";
    statusColor = "text-red-400";
  }

  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      {/* Status */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`font-bold ${statusColor}`}>
          {statusText}
        </Text>
        <Text className="text-gray-400 text-sm">
          #{offer.id}
        </Text>
      </View>

      {/* Amount & Price */}
      <View className="flex-row justify-between mb-2">
        <Text className="text-white font-bold text-lg">
          {offer.amountRC} RC
        </Text>
        <Text className="text-emerald-400 font-bold">
          {offer.unitPrice}
        </Text>
      </View>

      {/* Seller */}
      <Text className="text-gray-400 text-sm mb-2">
        Vendedor: {offer.seller.slice(0, 6)}...{offer.seller.slice(-4)}
      </Text>

      {/* Payment Method */}
      <Text className="text-gray-300 text-sm mb-2">
        Pagamento: {offer.paymentMethod}
      </Text>

      {/* Description */}
      <Text className="text-gray-300 text-sm mb-4">
        {offer.description}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row gap-2">
        {!isCompleted && offer.active && (
          <>
            {/* Botão Comprar - para todos */}
            <TouchableOpacity 
              className="flex-1 bg-emerald-600 py-2 rounded-lg"
              onPress={handleBuy}
            >
              <Text className="text-white text-center font-bold">
                Comprar
              </Text>
            </TouchableOpacity>

            {/* Botão Cancelar - só para o dono */}
            {isOwner && (
              <TouchableOpacity 
                className="bg-red-600 px-4 py-2 rounded-lg"
                onPress={handleCancel}
              >
                <Text className="text-white text-center">
                  Cancelar
                </Text>
              </TouchableOpacity>
            )}

            {/* Botão Concluir - só para o dono */}
            {isOwner && (
              <TouchableOpacity 
                className="bg-blue-600 px-4 py-2 rounded-lg"
                onPress={handleConfirm}
              >
                <Text className="text-white text-center">
                  Concluir
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {isCompleted && (
          <Text className="text-blue-400 text-center">
            Venda concluída para: {offer.buyer.slice(0, 6)}...{offer.buyer.slice(-4)}
          </Text>
        )}
      </View>
    </View>
  );
}