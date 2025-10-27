import { Children, cloneElement, isValidElement, ReactNode, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import Toast from "react-native-toast-message";

import { useAppSafeArea, useTxContext, useUploadToIpfs } from "@hooks";
import { FileInput, Text, TextInput } from "@components";
import { useRealizeInspection } from "@domain";

interface ModalControls {
  openModal: () => void;
  closeModal: () => void;
}

interface Props {
  children: ReactNode;
}

export function RealizeInspection({ children }: Props) {
  const { t } = useTranslation();
  const { bottom } = useAppSafeArea();
  const modal = useRef<Modalize>(null);
  
  const { registerContinueAction } = useTxContext();
  const { realizeInspection } = useRealizeInspection();
  
  const { upload, uploading } = useUploadToIpfs();

  const [inspectionId, setInspectionId] = useState('');
  const [trees, setTrees] = useState('');
  const [biodiversity, setBiodiversity] = useState('');
  const [reportUri, setReportUri] = useState<string | null>(null);
  const [proofPhotosUri, setProofPhotosUri] = useState<string | null>(null);

  useEffect(() => {
    registerContinueAction(() => {
      //action success
      Toast.show({
        type: 'success',
        text1: t('actions.realizedInspection')
      });
      setInspectionId('');
      setTrees('');
      setBiodiversity('');
      setReportUri(null);
      setProofPhotosUri(null);
      closeModal();
    })
  }, []);

  async function handleRealize() {
    if (!reportUri || !proofPhotosUri) return;
    let reportHash = '';
    let proofPhotosHash = '';

    const uploadReport = await upload({ uri: reportUri });
    if (uploadReport.isSuccess) {
      reportHash = uploadReport.hash;
    } else {
      return;
    }

    const uploadProofPhotos = await upload({ uri: proofPhotosUri });
    if (uploadProofPhotos.isSuccess) {
      proofPhotosHash = uploadProofPhotos.hash;
    } else {
      return;
    }

    realizeInspection({
      inspectionId: parseInt(inspectionId),
      biodiversityResult: parseInt(biodiversity),
      justificationReport: reportHash,
      proofPhotos: proofPhotosHash,
      treesResult: parseInt(trees)
    })
  }

  function openModal() {
    modal.current?.open();
  }

  function closeModal() {
    modal.current?.close();
  }

  const enhancedChildren = Children.map(children, child => {
    if (isValidElement<ModalControls>(child)) {
      return cloneElement(child, { openModal, closeModal });
    }
    return child;
  });

  return (
    <View>
      {enhancedChildren}

      <Portal>
        <Modalize
          ref={modal}
          adjustToContentHeight
          modalStyle={{ backgroundColor: 'transparent' }}
        >
          <View 
            className="rounded-t-2xl p-5 bg-card-primary"
          >
            <ScrollView
              style={{ maxHeight: 600, paddingBottom: bottom + 20 }}
            >
              <Text className="text-white text-center">{t('actions.realizeInspection')}</Text>

              <View className="mt-5 gap-5">
                <Text className="text-white">{t('actionsDescriptions.realizeInspection')}</Text>

                <TextInput
                  label={t('actions.inspectionId')}
                  value={inspectionId}
                  onChangeText={setInspectionId}
                  keyboardType="numeric"
                />

                <TextInput
                  label={t('actions.treesResult')}
                  value={trees}
                  onChangeText={setTrees}
                  keyboardType="numeric"
                />

                <TextInput
                  label={t('actions.biodiversityResult')}
                  value={biodiversity}
                  onChangeText={setBiodiversity}
                  keyboardType="numeric"
                />

                <FileInput
                  label={t('actions.reportInspection')}
                  onChange={setReportUri}
                />

                <FileInput
                  label={t('actions.proofPhotosInspection')}
                  onChange={setProofPhotosUri}
                />

                <TouchableOpacity
                  className="w-full h-12 mt-5 mb-10 rounded-2xl flex-row items-center justify-center bg-green-primary disabled:opacity-50"
                  onPress={handleRealize}
                  disabled={uploading || !proofPhotosUri || !reportUri || !trees.trim() || !inspectionId.trim() || !biodiversity.trim()}
                >
                  {uploading ? (
                    <ActivityIndicator size={30} color="white" />
                  ) : (
                    <Text className="text-white font-semibold">{t('actions.realizeInspection')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modalize>
      </Portal>
    </View>
  );
}
