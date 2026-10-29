import { useCallback, useRef } from 'react';

// Two presses closer together than this count as a double tap.
const DOUBLE_TAP_MS = 300;

// React Native exposes no double-press prop on any platform — not Pressable,
// not react-native-web — so the timing lives here and is shared by every
// surface that needs it. Returns an onPress handler; onPress still fires for
// every press, onDoubleTap only for the second of a quick pair.
export default function useDoubleTap(onDoubleTap, onPress) {
  const lastTapAt = useRef(0);

  return useCallback(
    (event) => {
      if (onPress) onPress(event);

      const now = Date.now();
      if (now - lastTapAt.current > DOUBLE_TAP_MS) {
        lastTapAt.current = now;
        return;
      }

      lastTapAt.current = 0;
      if (onDoubleTap) onDoubleTap(event);
    },
    [onDoubleTap, onPress]
  );
}
