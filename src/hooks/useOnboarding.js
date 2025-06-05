import { useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { completeOnboarding } from '../store/slices/onboardingSlice';
import { slides } from '../constants/onboarding';
import { useSharedValue } from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const useOnboarding = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const scrollTo = useCallback((index) => {
    if (scrollRef.current && index >= 0 && index < slides.length) {
      scrollRef.current.scrollToIndex({ index, animated: true });
    } else {
      console.warn('Index hors limites ou scrollRef non défini:', index);
    }
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        scrollX.value = newIndex * width;
      }
    }
  }).current;

  const viewConfig = { viewAreaCoveragePercentThreshold: 50 };

  const skipOnboarding = useCallback(() => {
    dispatch(completeOnboarding());
    navigation.replace('Home');
  }, [dispatch, navigation]);

  const completeOnboarding = useCallback(() => {
    dispatch(completeOnboarding());
    navigation.replace('Home');
  }, [dispatch, navigation]);

  return {
    scrollRef,
    currentIndex,
    scrollX,
    scrollTo,
    viewableItemsChanged,
    viewConfig,
    slides,
    skipOnboarding,
    completeOnboarding,
  };
};