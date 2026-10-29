import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

// Draws a grid that covers at minimum the whole screen, and grows past it to
// cover the full content size when it wraps content that outgrows the viewport.
// Lines are laid out from the measured size, so the pattern keeps repeating
// instead of stretching or clipping.
export default function GridBackground({
  cellSize = 40,
  lineColor = '#e4e4e7',
  lineWidth = StyleSheet.hairlineWidth,
  backgroundColor = '#fff',
  style,
  children,
}) {
  const window = useWindowDimensions();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((previous) =>
      previous.width === width && previous.height === height
        ? previous
        : { width, height }
    );
  }, []);

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, minWidth: window.width, minHeight: window.height },
        style,
      ]}
      onLayout={onLayout}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
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
      </View>
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
