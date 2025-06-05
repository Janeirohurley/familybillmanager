import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { colors, spacing, fonts } from '../../theme';

const { width } = Dimensions.get('window');

const OnboardingItem = ({ item, scrollX, index }) => {
  const { theme } = useContext(ThemeContext);

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [
        { scale: interpolate(scrollX.value, inputRange, [0.9, 1, 0.9], Extrapolate.CLAMP) },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      transform: [{ scale: interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP) }],
      opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolate.CLAMP),
    };
  });

  return (
    <View style={[styles.container, { width, backgroundColor: theme.background }]}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.title, { color: theme.text }, textStyle]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.description, { color: theme.textSecondary }, textStyle]}>
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xlarge * 2,
  },
  imageContainer: {
    flex: 0.6,
    width: '100%',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    height: 300,
  },
  textContainer: {
    flex: 0.4,
    paddingHorizontal: spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fonts.sizes.xxlarge,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.medium,
  },
  description: {
    fontSize: fonts.sizes.medium,
    textAlign: 'center',
    paddingHorizontal: spacing.large,
    lineHeight: fonts.sizes.medium * 1.4,
  },
});

export default OnboardingItem;