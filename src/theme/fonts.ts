import { useFonts } from 'expo-font';

// Loads the brand's Instrument Sans variable font. RN interpolates the
// weight axis via the standard `fontWeight` style prop once the family
// is registered, so a single load covers 400-700.
export function useAppFonts() {
  return useFonts({
    InstrumentSans: require('../../assets/fonts/InstrumentSans-VariableFont_wdth_wght.ttf'),
    'InstrumentSans-Italic': require('../../assets/fonts/InstrumentSans-Italic-VariableFont_wdth_wght.ttf'),
  });
}
