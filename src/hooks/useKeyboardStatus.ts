import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export function useKeyboardStatus() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onKeyboardDidShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setKeyboardOpen(true);
    };
    const onKeyboardDidHide = () => {
      setKeyboardHeight(0);
      setKeyboardOpen(false);
    };

    const showListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return {
    keyboardOpen,
    keyboardHeight
  };
}