import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { spacing } from '../../theme';

const { width } = Dimensions.get('window');

const Pagination = ({ data, scrollX }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
          return {
            width: interpolate(scrollX.value, inputRange, [10, 20, 10], Extrapolate.CLAMP),
            opacity: interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP),
          };
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, { backgroundColor: theme.primary }, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xxlarge,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: spacing.small,
  },
});

export default Pagination;