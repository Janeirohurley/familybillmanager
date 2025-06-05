import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

// Fonction pour générer les styles dynamiques basés sur variant et theme
const getButtonStyle = (variant, theme) => {
  const variantStyles = {
    contained: {
      backgroundColor: theme.primary,
      shadowColor: theme.gray,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    text: {
      backgroundColor: 'transparent',
    },
  };
  return variantStyles[variant] || {};
};

const getTextStyle = (variant, theme) => {
  const textVariantStyles = {
    contained: {
      color: theme.background,
    },
    outlined: {
      color: theme.primary,
    },
    text: {
      color: theme.primary,
    },
  };
  return textVariantStyles[variant] || {};
};

const Button = ({ 
  title, 
  onPress, 
  variant = 'contained', 
  loading = false,
  style,
  ...props 
}) => {
  const { theme } = useContext(ThemeContext);

  if (!onPress || typeof onPress !== 'function') {
    console.warn('onPress doit être une fonction');
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(variant, theme), // Utilisation de la fonction pour obtenir les styles dynamiques
        pressed && styles.pressed,
        style,
      ]}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'contained' ? theme.background : theme.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle(variant, theme)]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Button;