/// <reference types="vite/client" />
import SamSupport from './voices/SamSupport.m4a?inline';
import RiveraHelp from './voices/RiveraHelp.m4a?inline';
import RiveraReport from './voices/RiveraReport.m4a?inline';
import JoSupport from './voices/JoSupport.m4a?inline';
import LeeHelp from './voices/LeeHelp.m4a?inline';
import LeeReport from './voices/LeeReport.m4a?inline';
import AriSupport from './voices/AriSupport.m4a?inline';
import AriHelp from './voices/AriHelp.m4a?inline';
import BusReport from './voices/BusReport.m4a?inline';
export {default as ambience} from './voices/ambience.m4a?inline';

export const dialogue = {
  SamSupport: {text: "Sam, want some company?", clip: SamSupport},
  RiveraHelp: {text: "I’m listening. Can you tell me what you saw?", clip: RiveraHelp},
  RiveraReport: {text: "Thank you for telling me. I’ll check on Sam and speak with the group.", clip: RiveraReport},
  JoSupport: {text: "Jo, you can sit with me!", clip: JoSupport},
  LeeHelp: {text: "Thanks for coming to me. What’s been happening?", clip: LeeHelp},
  LeeReport: {text: "I’ll check in with Jo privately and follow up.", clip: LeeReport},
  AriSupport: {text: "Ari, are you okay? I can come with you to tell an adult.", clip: AriSupport},
  AriHelp: {text: "I’ll tell an adult when we get to our stop.", clip: AriHelp},
  BusReport: {text: "I’ll check on Ari and talk with the school about making the bus ride safer.", clip: BusReport},
};
