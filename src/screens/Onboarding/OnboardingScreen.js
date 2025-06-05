import React from 'react';
import { SafeAreaView, FlatList, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../../store';
import { useOnboarding } from '../../hooks/useOnboarding';
import OnboardingItem from '../../components/onboarding/OnboardingItem';
import Pagination from '../../components/onboarding/Pagination';
import  Button  from '../../components/common/Button';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const OnboardingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const {
    scrollRef,
    currentIndex,
    scrollX,
    scrollTo,
    viewableItemsChanged,
    viewConfig,
    slides,
    skipOnboarding,
  } = useOnboarding();

  const handleSkip = () => {
    dispatch(completeOnboarding());
    skipOnboarding();
  };

  const handleComplete = () => {
    dispatch(completeOnboarding());
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={scrollRef}
        data={slides}
        renderItem={({ item, index }) => <OnboardingItem item={item} scrollX={scrollX} index={index} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScrollToIndexFailed={(info) => {
          console.warn('Scroll failed for index:', info.index);
        }}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      <Pagination data={slides} scrollX={scrollX} />
      <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 ? (
          <>
            <Button 
              title="Passer" 
              variant="text" 
              onPress={handleSkip} 
            />
            <Button 
              title="Suivant" 
              onPress={() => {
                try {
                  scrollTo(currentIndex + 1);
                } catch (error) {
                  console.error('Failed to scroll:', error);
                }
              }} 
            />
          </>
        ) : (
          <Button 
            title="Commencer" 
            onPress={handleComplete} 
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default OnboardingScreen;