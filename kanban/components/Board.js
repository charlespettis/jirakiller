import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Column from './Column';
import GridBackground from './GridBackground';

// The board surface: a grid that grows with its content, and the columns laid
// out across it. Double tapping empty grid appends a new, unnamed column with
// its label input focused.
export default function Board({ initialColumns = [] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [focusedId, setFocusedId] = useState(null);
  const nextId = useRef(1);

  const addColumn = useCallback(() => {
    const id = `column-${nextId.current++}`;
    setColumns((previous) => [...previous, { id, name: '', cards: [] }]);
    setFocusedId(id);
  }, []);

  const renameColumn = useCallback((id, name) => {
    setColumns((previous) =>
      previous.map((column) => (column.id === id ? { ...column, name } : column))
    );
  }, []);

  return (
    <ScrollView horizontal contentContainerStyle={styles.grow}>
      <ScrollView contentContainerStyle={styles.grow}>
        <GridBackground onDoubleTap={addColumn}>
          {/* box-none: the row itself is never a touch target, so double taps
              in its padding and gaps reach the grid, while the columns inside
              it still take their own presses. */}
          <View style={styles.columns} pointerEvents="box-none">
            {columns.map((column) => (
              <Column
                key={column.id}
                label={column.name}
                onLabelChange={(name) => renameColumn(column.id, name)}
                autoFocus={column.id === focusedId}
                items={column.cards}
              />
            ))}
          </View>
        </GridBackground>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
  },
  columns: {
    flexDirection: 'row',
    // Grow to the grid's height (at least the screen) so stretched columns
    // have a full-height row to fill.
    flexGrow: 1,
    alignItems: 'stretch',
    padding: 12,
    gap: 12,
  },
});
