import { Platform } from 'react-native';
import { LineItem as LineItemNative } from './LineItem.native';
import { LineItem as LineItemWeb } from './LineItem.web';

// export the correct version of the component based on the platform
// TODO: just fix the alias, but this works for now
export const LineItem = Platform.OS === 'web' ? LineItemWeb : LineItemNative;
export default LineItem;
