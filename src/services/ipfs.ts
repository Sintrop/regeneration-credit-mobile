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
