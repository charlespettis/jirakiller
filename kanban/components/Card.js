import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

// A ticket card: a solid color block with its text on top, in the shape of a
// Jira or ClickUp card — a small key line above the title, an optional footer
// tag below it. With no title yet, the card shows a text input instead so it
// can be written in place; onTitleChange fires on submit or blur.
export default function Card({
  title,
  onTitleChange,
  placeholder = 'Card text',
  placeholderTextColor = '#A1A1AA',
  autoFocus = false,
  ticket,
  tag,
  color = '#FCEFA1',
  textColor = '#3F3F46',
  onPress,
  numberOfLines = 3,
  style,
  titleStyle,
}) {
  const [draft, setDraft] = useState('');
  const hasTitle = title != null && String(title).length > 0;

  const commitDraft = () => {
    const next = draft.trim();
    if (next && onTitleChange) onTitleChange(next);
  };

  // The key and tag sit on the same solid fill, so they are the title color
  // held back rather than a second color that has to be picked per background.
  const mutedColor = { color: textColor, opacity: 0.75 };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: color },
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      {ticket == null ? null : (
        <Text style={[styles.ticket, mutedColor]} numberOfLines={1}>
          {ticket}
        </Text>
      )}
      {hasTitle ? (
        <Text
          style={[styles.title, { color: textColor }, titleStyle]}
          numberOfLines={numberOfLines}
        >
          {title}
        </Text>
      ) : (
        <TextInput
          style={[styles.title, styles.titleInput, { color: textColor }, titleStyle]}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={commitDraft}
          onBlur={commitDraft}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          autoFocus={autoFocus}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          multiline
        />
      )}
      {tag == null ? null : (
        <View style={styles.footer}>
          <Text style={[styles.tag, mutedColor]} numberOfLines={1}>
            {tag}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.85,
  },
  ticket: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
  },
  titleInput: {
    // Strip the input's own padding so the text sits where the Text it
    // replaces would, and keep it from collapsing to a single thin line.
    padding: 0,
    minHeight: 38,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    fontSize: 11,
    fontWeight: '600',
  },
});
