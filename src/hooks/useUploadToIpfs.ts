import { useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

import { uploadToIpfs } from "@services";

import { useSettingsContext } from "./useSettingsContext";

interface UploadProps {
  uri: string;
}
interface ReturnUploadProps {
  isSuccess: boolean;
  hash: string;
}
interface ReturnUseUploadToIpfs {
  uploading: boolean;
  upload: (data: UploadProps) => Promise<ReturnUploadProps>;
  hash: string | null;
  isSuccess: boolean;
  isError: boolean;
}
export function useUploadToIpfs(): ReturnUseUploadToIpfs {
  const { t } = useTranslation();
  const { ipfsApi } = useSettingsContext();
  const [uploading, setUploading] = useState<boolean>(false);
  const [hash, setHash] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  async function handleUpload(data: UploadProps): Promise<ReturnUploadProps> {
    setUploading(true);
    const response = await uploadToIpfs({
      ipfsApiUrl: ipfsApi,
      file: data.uri
    });

    setIsSuccess(response.success);
    setIsError(!response.success);

    if (response.success) {
      setHash(response.hash);
    } else {
      Toast.show({
        type: 'error',
        text1: t('common.errorOnUploadFileToIpfs')
      })
    }

    setUploading(false);
    return {
      isSuccess: response.success,
      hash: response.hash
    }
  }

  return {
    uploading,
    upload: handleUpload,
    hash,
    isError,
    isSuccess
  }
}