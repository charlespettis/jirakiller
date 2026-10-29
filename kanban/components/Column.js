import { StyleSheet, Text, View } from 'react-native';

// A single board column: a text label across the top, then one item per line
// stacked down the column.
export default function Column({
  label,
  items = [],
  renderItem,
  keyExtractor,
  width = 280,
  gap = 8,
  style,
  labelStyle,
  children,
}) {
  const keyFor = (item, index) => {
    if (keyExtractor) return keyExtractor(item, index);
    if (item && item.id != null) return String(item.id);
    return String(index);
  };

  return (
    <View style={[styles.column, { width }, style]}>
      {label == null ? null : (
        <Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Text>
      )}
      <View style={[styles.items, { gap }]}>
        {items.map((item, index) => (
          <View key={keyFor(item, index)}>
            {renderItem ? renderItem(item, index) : item}
          </View>
        ))}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
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
  items: {
    flexDirection: 'column',
  },
});
