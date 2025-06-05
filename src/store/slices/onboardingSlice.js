import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnboarded: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeOnboarding: (state) => {
      state.isOnboarded = true;
    },
    resetOnboarding: (state) => {
      state.isOnboarded = false;
    },
  },
});

export const { completeOnboarding, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;