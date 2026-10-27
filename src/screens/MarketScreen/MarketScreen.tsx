import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { utils } from 'web3';

import { Screen, Text, TextInput } from '@components';
import { AppStackParamsList } from '@routes';
import { getRCMarketContract, useCreateOffer, useCancelOffer, useConfirmSale } from '@domain/RCMarket';
import { useAppSafeArea, useTxContext, useUserContext } from '@hooks';

import { formatOfferPrice } from './formatOfferPrice';
import { SellerInfo } from './SellerInfo';

type NavigationProp = NativeStackNavigationProp<AppStackParamsList>;

const PAYMENT_METHODS = ['PIX', 'TED', 'Dinheiro'];
const EMPTY_OFFER = { amount: '', price: '', method: 'PIX', description: '' };

interface Offer {
  id: number;
  seller: string;
  amount: number;
  unitPrice: string;
  paymentMethod: string;
  description: string;
  active: boolean;
}

export function MarketScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { t, i18n } = useTranslation();
  const { bottom } = useAppSafeArea();
  const { address } = useUserContext();
  const { registerContinueAction } = useTxContext();
  const { createOffer } = useCreateOffer();
  const { cancelOffer } = useCancelOffer();
  const { confirmSale } = useConfirmSale();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState(EMPTY_OFFER);
  const [confirmingOfferId, setConfirmingOfferId] = useState<number | null>(null);
  const [buyerAddress, setBuyerAddress] = useState('');

  const loadOffers = useCallback(async () => {
    try {
      const contract = getRCMarketContract();
      const count = Number(await contract.methods.getOffersCount().call());
      const ids = Array.from({ length: count }, (_, index) => count - index);

      const results = await Promise.all(ids.map(async id => {
        try {
          const offer = await contract.methods.getOffer(id).call() as any;
          return {
            id,
            seller: offer.seller,
            amount: Number(offer.amountRC),
            unitPrice: String(offer.unitPrice),
            paymentMethod: offer.paymentMethod,
            description: offer.description,
            active: offer.active,
          } as Offer;
        } catch {
          return null;
        }
      }));

      setOffers(results.filter((offer): offer is Offer => offer !== null && offer.active));
    } catch (error) {
      console.log('Error loading market offers', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
    registerContinueAction(() => loadOffers());
  }, []);

  function handleGoToUser(seller: string) {
    navigation.navigate('UserDetailsScreen', { address: seller });
  }

  function handleBuy() {
    Alert.alert(t('market.buyTitle'), t('market.buyMessage'));
  }

  function handleCancel(offerId: number) {
    Alert.alert(
      t('market.cancelOfferTitle'),
      t('market.cancelOfferMessage'),
      [
        { text: t('common.no'), style: 'cancel' },
        { text: t('common.yes'), onPress: () => cancelOffer({ offerId }) },
      ]
    );
  }

  function handleConfirm(offerId: number) {
    setBuyerAddress('');
    setConfirmingOfferId(offerId);
  }

  function handleSubmitConfirmSale() {
    const buyer = buyerAddress.trim();
    if (confirmingOfferId === null) return;
    if (!utils.isAddress(buyer)) {
      Alert.alert(t('market.error'), t('common.invalidAddress'));
      return;
    }
    confirmSale({ offerId: confirmingOfferId, buyer });
    setConfirmingOfferId(null);
  }

  function handleCreateOffer() {
    if (!address) {
      Alert.alert(t('market.error'), t('market.connectWalletFirst'));
      return;
    }

    if (!newOffer.amount || !newOffer.price || !newOffer.description) {
      Alert.alert(t('market.error'), t('market.fillAllFields'));
      return;
    }

    if (newOffer.description.length > 500) {
      Alert.alert(t('market.error'), t('market.descriptionTooLong'));
      return;
    }

    if (newOffer.price.length > 50) {
      Alert.alert(t('market.error'), t('market.priceTooLong'));
      return;
    }

    const sanitizedAmount = newOffer.amount.trim();
    if (!/^\d+$/.test(sanitizedAmount) || Number(sanitizedAmount) <= 0) {
      Alert.alert(t('common.integerAmountRequired'));
      return;
    }

    createOffer({
      amountRC: sanitizedAmount,
      unitPrice: newOffer.price.trim(),
      paymentMethod: newOffer.method,
      description: newOffer.description,
    });

    setShowModal(false);
    setNewOffer(EMPTY_OFFER);
  }

  const isOwnOffer = (offer: Offer) => !!address && offer.seller.toLowerCase() === address.toLowerCase();

  return (
    <Screen title={t('market.title')} showBackButton>
      <View className="flex-1">
        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center gap-2">
              <ActivityIndicator color="white" size={30} />
              <Text className="text-gray-300">{t('market.loadingOffers')}</Text>
            </View>
          ) : (
            <OffersList
              offers={offers}
              bottomInset={bottom + 90}
              locale={i18n.language}
              isOwnOffer={isOwnOffer}
              onBuy={handleBuy}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
              onPressSeller={handleGoToUser}
            />
          )}
        </View>

        <View className="absolute left-3 right-3" style={{ bottom: bottom + 16 }}>
          <TouchableOpacity
            className="h-12 rounded-2xl items-center justify-center bg-green-primary"
            style={{ shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}
            onPress={() => setShowModal(true)}
          >
            <Text className="text-green-secondary font-bold">{t('market.publishOffer')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView
          className="flex-1 justify-end bg-black/70"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View className="w-full p-5 gap-4 rounded-t-2xl bg-card-primary" style={{ paddingBottom: bottom + 20 }}>
            <Text className="text-white text-lg font-bold text-center">{t('market.newOffer')}</Text>

            <TextInput
              label={t('market.amountLabel')}
              placeholder="Ex: 100"
              keyboardType="number-pad"
              value={newOffer.amount}
              onChangeText={amount => setNewOffer({ ...newOffer, amount })}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            <TextInput
              label={t('market.priceLabel')}
              placeholder="Ex: 0,15"
              keyboardType="decimal-pad"
              maxLength={50}
              value={newOffer.price}
              onChangeText={price => setNewOffer({ ...newOffer, price })}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            <View>
              <Text className="text-gray-300 mb-2">{t('market.paymentMethodLabel')}</Text>
              <View className="flex-row gap-2">
                {PAYMENT_METHODS.map(method => (
                  <TouchableOpacity
                    key={method}
                    className={`flex-1 h-10 rounded-xl items-center justify-center ${newOffer.method === method ? 'bg-green-btn' : 'bg-card-secondary'}`}
                    onPress={() => setNewOffer({ ...newOffer, method })}
                  >
                    <Text className="text-white font-semibold">{method === 'Dinheiro' ? t('market.cash') : method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              label={t('market.descriptionLabel')}
              placeholder={t('market.descriptionPlaceholder')}
              multiline
              maxLength={500}
              value={newOffer.description}
              onChangeText={description => setNewOffer({ ...newOffer, description })}
            />

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="flex-1 h-12 rounded-2xl items-center justify-center bg-card-secondary"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-white font-semibold">{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-12 rounded-2xl items-center justify-center bg-green-btn"
                onPress={handleCreateOffer}
              >
                <Text className="text-white font-semibold">{t('market.publish')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={confirmingOfferId !== null} animationType="fade" transparent onRequestClose={() => setConfirmingOfferId(null)}>
        <View className="flex-1 items-center justify-center bg-black/70">
          <View className="w-[90%] p-5 gap-4 rounded-2xl bg-card-primary">
            <Text className="text-white text-lg font-bold text-center">{t('market.confirmSaleTitle')}</Text>
            <TextInput
              label={t('market.confirmSaleMessage')}
              placeholder="0x..."
              autoCapitalize="none"
              autoCorrect={false}
              value={buyerAddress}
              onChangeText={setBuyerAddress}
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 h-12 rounded-2xl items-center justify-center bg-card-secondary"
                onPress={() => setConfirmingOfferId(null)}
              >
                <Text className="text-white font-semibold">{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-12 rounded-2xl items-center justify-center bg-blue-primary"
                onPress={handleSubmitConfirmSale}
              >
                <Text className="text-white font-semibold">{t('common.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

interface OffersListProps {
  offers: Offer[];
  bottomInset: number;
  locale: string;
  isOwnOffer: (offer: Offer) => boolean;
  onBuy: () => void;
  onCancel: (offerId: number) => void;
  onConfirm: (offerId: number) => void;
  onPressSeller: (seller: string) => void;
}

function OffersList({ offers, bottomInset, locale, isOwnOffer, onBuy, onCancel, onConfirm, onPressSeller }: OffersListProps) {
  const { t } = useTranslation();

  if (offers.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-gray-300 text-center">{t('market.noOffers')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="px-3 pt-5"
      contentContainerStyle={{ gap: 12, paddingBottom: bottomInset }}
      showsVerticalScrollIndicator={false}
    >
      {offers.map(offer => (
        <View key={offer.id} className="p-4 rounded-2xl bg-card-primary gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-300 text-sm">{t('market.offer', { id: offer.id })}</Text>
            <Text className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-card-secondary">
              {offer.paymentMethod === 'Dinheiro' ? t('market.cash') : offer.paymentMethod}
            </Text>
          </View>

          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-gray-400 text-xs">{t('market.amount')}</Text>
              <Text className="text-white text-2xl font-bold">
                {Intl.NumberFormat(locale).format(offer.amount)} RC
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 text-xs">{t('market.unitPrice')}</Text>
              <Text className="text-green-primary text-xl font-bold">{formatOfferPrice(offer.unitPrice, locale)}</Text>
            </View>
          </View>

          {!!offer.description && (
            <Text className="text-gray-300 p-3 rounded-xl bg-card-secondary">{offer.description}</Text>
          )}

          <SellerInfo address={offer.seller} onPress={onPressSeller} />

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="flex-1 h-11 rounded-2xl items-center justify-center bg-green-btn"
              onPress={onBuy}
            >
              <Text className="text-white font-semibold">{t('market.buy')}</Text>
            </TouchableOpacity>

            {isOwnOffer(offer) && (
              <>
                <TouchableOpacity
                  className="flex-1 h-11 rounded-2xl items-center justify-center border border-red-400"
                  onPress={() => onCancel(offer.id)}
                >
                  <Text className="text-red-400 font-semibold">{t('market.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 h-11 rounded-2xl items-center justify-center bg-blue-primary"
                  onPress={() => onConfirm(offer.id)}
                >
                  <Text className="text-white font-semibold">{t('market.complete')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
