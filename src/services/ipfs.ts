import axios from 'axios'
import { Platform } from 'react-native';

interface UploadToIpfsProps {
  file: string;
  ipfsApiUrl: string
}

interface ReturnUploadToIpfsProps {
  success: boolean
  hash: string
}

export async function uploadToIpfs(props: UploadToIpfsProps): Promise<ReturnUploadToIpfsProps> {
  const { file, ipfsApiUrl } = props

  try {
    const formData = new FormData();

    formData.append('file', {
      uri: Platform.OS === 'android' ? file : file.replace('file://', ''),
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    const response = await axios.postForm(`${ipfsApiUrl}/api/v0/add?pin=true`, formData, {
      headers: {
        Accept: 'application/json',
      }
    })

    return {
      success: true,
      hash: response.data.Hash
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
      hash: ''
    }
  }
}

export function base64ToBlob(base64String: string): Blob {
  const base64WithoutPrefix = base64String.split(';base64,').pop()
  const byteCharacters = atob(base64WithoutPrefix as string)
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i))
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: 'image/png' })
}