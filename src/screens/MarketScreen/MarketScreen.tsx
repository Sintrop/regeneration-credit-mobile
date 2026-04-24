import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Platform, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamsList } from '@routes/AppStack';
import { getRCMarketContract, useCreateOffer, useCancelOffer, useConfirmSale } from '@domain/RCMarket';
import { useUserContext } from '@hooks';

type NavigationProp = NativeStackNavigationProp<AppStackParamsList>;

interface Offer {
  id: number;
  seller: string;
  amount: number;
  pricePerUnit: any;
  paymentMethod: string;
  description: string;
  status: number;
  active?: boolean;
  completedAt?: number;
  buyer?: string;
}

export function MarketScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { address, isConnected, handleConnect } = useUserContext();
  const { createOffer, isLoading: isCreatingOffer } = useCreateOffer();
  const { cancelOffer } = useCancelOffer();
  const { confirmSale } = useConfirmSale();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ amount: '', price: '', method: 'PIX', description: '' });

  const loadOffers = async () => {
    try {
      const contract = getRCMarketContract();
      
      // Try to get offers count - if function doesn't exist, set to 0
      let count = 0;
      try {
        const countResult = await contract.methods.getOffersCount().call();
        count = Number(countResult);
      } catch (e) {
        console.log('getOffersCount not available, trying alternative method');
      }
      
      if (count === 0) {
        setOffers([]);
        setLoading(false);
        return;
      }
      
      const offersData: Offer[] = [];
      
      for (let i = 1; i <= count; i++) {
        try {
          const offer = await contract.methods.getOffer(i).call();
          offersData.push({
            id: i,
            seller: offer.seller,
            amount: Number(offer.amountRC),
            pricePerUnit: offer.unitPrice, // It's a string, not a number
            paymentMethod: offer.paymentMethod,
            description: offer.description,
            status: offer.active ? 0 : 1, // 0 = active, 1 = inactive
            active: offer.active,
            completedAt: Number(offer.completedAt),
            buyer: offer.buyer,
          });
        } catch (e) {
          console.log('Erro ao carregar oferta', i, e);
        }
      }
      
      setOffers(offersData.reverse());
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Ativa';
      case 1: return 'Vendida';
      case 2: return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return '#00D9C0';
      case 1: return '#F59E0B';
      case 2: return '#EF4444';
      default: return '#6B7280';
    }
  };

  function handleGoToUser(address: string) {
    navigation.navigate("UserDetailsScreen", { address });
  }

  const handleBuy = () => {
    Alert.alert('Comprar', 'O mercado é apenas informativo, entre em contato com o vendedor através das informações descritas na oferta e compre diretamente com ele.');
  };

  const handleCancel = (offerId: number) => {
    Alert.alert(
      'Cancelar Oferta',
      'Tem certeza que deseja cancelar esta oferta?',
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim', 
          onPress: () => {
            cancelOffer({ offerId });
            loadOffers(); // Recarrega lista após cancelar
          }
        }
      ]
    );
  };

  const handleConfirm = (offerId: number) => {
    // Need buyer address
    Alert.prompt(
      'Confirmar Venda',
      'Digite o endereço da carteira do comprador:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar',
          onPress: (buyerAddress?: string) => {
            if (buyerAddress && buyerAddress.startsWith('0x')) {
              confirmSale({ offerId, buyer: buyerAddress });
              loadOffers(); // Recarrega lista após confirmar
            } else {
              Alert.alert('Erro', 'Endereço inválido');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const handleCreateOffer = async () => {
    if (!address) {
      Alert.alert('Erro', 'Conecte a carteira primeiro!');
      return;
    }
    
    if (!newOffer.amount || !newOffer.price || !newOffer.description) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    
    if (newOffer.description.length > 500) {
      Alert.alert('Erro', 'A descrição deve ter no máximo 500 caracteres!');
      return;
    }

    // Sanitize amount: replace comma with dot
    const sanitizedAmount = newOffer.amount.replace(',', '.');
    const unitPrice = newOffer.price; // unitPrice is a string, no conversion needed
    
    // Send raw values - useCreateOffer will handle conversion
    createOffer({
      amountRC: sanitizedAmount,
      unitPrice: unitPrice,
      paymentMethod: newOffer.method,
      description: newOffer.description,
    });
    
    setShowModal(false);
    setNewOffer({ amount: '', price: '', method: 'PIX', description: '' });
    
    // Reload offers after creating
    loadOffers();
  };

  const shortenAddress = (addr: string) => {
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mercado RC</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Carregando ofertas...</Text>
        ) : offers.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma oferta disponível</Text>
        ) : (
          offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerHeader}>
                <Text style={styles.offerId}>Oferta #{offer.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(offer.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(offer.status)}</Text>
                </View>
              </View>
              
              <View style={styles.offerDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantidade:</Text>
                  <Text style={styles.detailValue}>{offer.amount} RC</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Preço unitário:</Text>
                  <Text style={styles.detailValue}>{offer.pricePerUnit}</Text>
                </View>
                <View style={styles.detailRow}>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pagamento:</Text>
                  <Text style={styles.detailValue}>{offer.paymentMethod}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vendedor:</Text>
                  <TouchableOpacity onPress={() => handleGoToUser(offer.seller)}>
                    <Text style={[styles.detailValue, { color: '#00D9C0' }]}>{shortenAddress(offer.seller)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {offer.description ? (
                <Text style={styles.description}>{offer.description}</Text>
              ) : null}
              
              <View style={styles.offerActions}>
                <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                  <Text style={styles.buyButtonText}>Comprar</Text>
                </TouchableOpacity>
                
                {address && offer.seller.toLowerCase() === address.toLowerCase() && offer.status === 0 && (
                  <>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(offer.id)}>
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirm(offer.id)}>
                      <Text style={styles.confirmButtonText}>Concluir</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+ Publicar Oferta</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Oferta</Text>
            
            <Text style={styles.inputLabel}>Quantidade de RC:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 100"
              keyboardType="numeric"
              value={newOffer.amount}
              onChangeText={(text) => setNewOffer({ ...newOffer, amount: text })}
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            
            <Text style={styles.inputLabel}>Preço por RC (R$):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5.00"
              keyboardType="numeric"
              value={newOffer.price}
              onChangeText={(text) => setNewOffer({ ...newOffer, price: text })}
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            
            <Text style={styles.inputLabel}>Método de Pagamento:</Text>
            <View style={styles.methodSelector}>
              {['PIX', 'TED', 'Dinheiro'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[styles.methodButton, newOffer.method === method && styles.methodButtonActive]}
                  onPress={() => setNewOffer({ ...newOffer, method })}
                >
                  <Text style={[styles.methodText, newOffer.method === method && styles.methodTextActive]}>{method}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.inputLabel}>Descrição (opcional):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Vendo X Créditos por Y BRL cada. Contato: meucontato@contato.com"
              multiline
              numberOfLines={3}
              value={newOffer.description}
              onChangeText={(text) => setNewOffer({ ...newOffer, description: text })}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={handleCreateOffer}>
                <Text style={styles.modalSubmitText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#1B263B',
  },
  backButton: {
    color: '#00D9C0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    color: '#778DA9',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#778DA9',
    textAlign: 'center',
    marginTop: 40,
  },
  offerCard: {
    backgroundColor: '#1B263B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3A4F',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerId: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#0D1B2A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#778DA9',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#778DA9',
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#0D1B2A',
    borderRadius: 8,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#1E3A5F', // Fundo azul
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D9C0', // Borda verde água
  },
  buyButtonText: {
    color: '#00D9C0', // Texto verde água
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#1E3A5F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#1E3A5F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  confirmButtonText: {
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#00D9C0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  fabText: {
    color: '#0D1B2A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1B263B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0D1B2A',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputLabel: {
    color: '#778DA9',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4,
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0D1B2A',
    borderWidth: 1,
    borderColor: '#2D3A4F',
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#00D9C0',
    borderColor: '#00D9C0',
  },
  methodText: {
    color: '#778DA9',
    fontWeight: '600',
  },
  methodTextActive: {
    color: '#0D1B2A',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalSubmit: {
    flex: 1,
    backgroundColor: '#00D9C0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#0D1B2A',
    fontWeight: 'bold',
  },
});