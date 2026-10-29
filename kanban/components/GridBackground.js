import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

// Two taps closer together than this count as a double tap.
const DOUBLE_TAP_MS = 300;

// Draws a grid that covers at minimum the whole screen, and grows past it to
// cover the full content size when it wraps content that outgrows the viewport.
// Lines are laid out from the measured size, so the pattern keeps repeating
// instead of stretching or clipping.
export default function GridBackground({
  cellSize = 40,
  lineColor = '#e4e4e7',
  lineWidth = StyleSheet.hairlineWidth,
  backgroundColor = '#fff',
  onDoubleTap,
  style,
  children,
}) {
  const window = useWindowDimensions();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lastTapAt = useRef(0);

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((previous) =>
      previous.width === width && previous.height === height
        ? previous
        : { width, height }
    );
  }, []);

  // Taps land on the line layer, which sits behind children, so only presses on
  // empty grid get here — anything rendered on top handles its own touches.
  const onPress = useCallback(
    (event) => {
      const now = Date.now();
      if (now - lastTapAt.current > DOUBLE_TAP_MS) {
        lastTapAt.current = now;
        return;
      }

      lastTapAt.current = 0;
      const { locationX, locationY } = event.nativeEvent;
      onDoubleTap({
        x: locationX,
        y: locationY,
        column: Math.floor(locationX / cellSize),
        row: Math.floor(locationY / cellSize),
      });
    },
    [onDoubleTap, cellSize]
  );

  const lines = useMemo(() => {
    // Never fewer lines than the screen needs, so the grid is already painted
    // on the first frame, before onLayout has reported anything.
    const columns = Math.ceil(Math.max(size.width, window.width) / cellSize);
    const rows = Math.ceil(Math.max(size.height, window.height) / cellSize);

    return {
      columns: Array.from({ length: columns + 1 }, (_, index) => index * cellSize),
      rows: Array.from({ length: rows + 1 }, (_, index) => index * cellSize),
    };
  }, [size.width, size.height, window.width, window.height, cellSize]);

  const LineLayer = onDoubleTap ? Pressable : View;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, minWidth: window.width, minHeight: window.height },
        style,
      ]}
      onLayout={onLayout}
    >
      <LineLayer
        style={StyleSheet.absoluteFill}
        pointerEvents={onDoubleTap ? 'auto' : 'none'}
        {...(onDoubleTap ? { onPress } : null)}
      >
        {lines.columns.map((left) => (
          <View
            key={`v-${left}`}
            style={[
              styles.vertical,
              { left, width: lineWidth, backgroundColor: lineColor },
            ]}
          />
        ))}
        {lines.rows.map((top) => (
          <View
            key={`h-${top}`}
            style={[
              styles.horizontal,
              { top, height: lineWidth, backgroundColor: lineColor },
            ]}
          />
        ))}
      </LineLayer>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  horizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
