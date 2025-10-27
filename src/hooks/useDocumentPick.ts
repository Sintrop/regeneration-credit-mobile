import { DocumentPickerResponse, pick } from '@react-native-documents/picker';

interface ReturnPick {
  success: boolean;
  document: DocumentPickerResponse | null;
}
interface ReturnUseDocumentPick {
  pick: () => Promise<ReturnPick>
}
export function useDocumentPick(): ReturnUseDocumentPick {
  async function handlePick(): Promise<ReturnPick> {
    try {
      const pickResult = await pick();

      return {
        success: true,
        document: pickResult[0]
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        document: null
      }
    }
  }

  return {
    pick: handlePick
  }
}
