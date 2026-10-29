import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import useDoubleTap from '../hooks/useDoubleTap';

// A single board column: a text label across the top, then one item per line
// stacked down the column. With no label yet, the top becomes a text input so
// the column can be named in place; onLabelChange fires on submit or blur.
export default function Column({
  label,
  onLabelChange,
  placeholder = 'Column name',
  autoFocus = false,
  onPress,
  onDoubleTap,
  items = [],
  renderItem,
  keyExtractor,
  width = 280,
  gap = 8,
  style,
  labelStyle,
  children,
}) {
  const [draft, setDraft] = useState('');
  const hasLabel = label != null && String(label).length > 0;
  const handlePress = useDoubleTap(onDoubleTap, onPress);

  const commitDraft = () => {
    const next = draft.trim();
    if (next && onLabelChange) onLabelChange(next);
  };

  const keyFor = (item, index) => {
    if (keyExtractor) return keyExtractor(item, index);
    if (item && item.id != null) return String(item.id);
    return String(index);
  };

  return (
    // Pressable, not View: the column claims presses that land on it, so a tap
    // or double tap on a column never falls through to the grid behind it.
    <Pressable style={[styles.column, { width }, style]} onPress={handlePress}>
      {hasLabel ? (
        // pointerEvents none so presses fall through to the column behind it,
        // and selectable false so a double tap names a card instead of
        // highlighting the label text.
        <Text
          style={[styles.label, labelStyle]}
          numberOfLines={1}
          pointerEvents="none"
          selectable={false}
        >
          {label}
        </Text>
      ) : (
        <TextInput
          style={[styles.label, styles.labelInput, labelStyle]}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={commitDraft}
          onBlur={commitDraft}
          placeholder={placeholder}
          placeholderTextColor="#a1a1aa"
          autoFocus={autoFocus}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
        />
      )}
      <View style={[styles.items, { gap }]}>
        {items.map((item, index) => (
          <View key={keyFor(item, index)}>
            {renderItem ? renderItem(item, index) : item}
          </View>
        ))}
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    // Fill the height the parent row offers, which the board sizes to the
    // screen, rather than shrinking to the items in the column.
    alignSelf: 'stretch',
    padding: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  labelInput: {
    // Keep the input on the same baseline as the Text it replaces.
    paddingVertical: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d8',
  },
  items: {
    flexDirection: 'column',
  },
});
