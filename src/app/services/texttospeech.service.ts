import { Injectable } from '@angular/core';
import { TextToSpeech, TextToSpeechPlugin } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root'
})
export class TexttospeechService {

  constructor(private tts:TextToSpeechPlugin) {
    
   }

  public talk(text:string){
    return this.tts.speak({
      text: text,
      lang: 'es-ES',
      rate: 1.0
    });
  }
  
}
