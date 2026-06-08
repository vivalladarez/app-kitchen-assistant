import Constants from 'expo-constants';

import { speechRecognitionService as stubService } from './speechRecognitionService.stub';

export type {
  ExpoSpeechRecognitionErrorEvent,
  ExpoSpeechRecognitionResultEvent,
} from './speechRecognitionService.stub';

function loadNativeService() {
  return require('./speechRecognitionService.impl')
    .speechRecognitionService as typeof stubService;
}

export const speechRecognitionService =
  Constants.appOwnership === 'expo' ? stubService : loadNativeService();
