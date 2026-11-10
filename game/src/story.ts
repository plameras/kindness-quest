export const badges = {
  playgroundNotice: {name: 'Spot the Signs', icon: '◎', detail: 'Notice that the group keeps picking on Sam.'},
  playgroundSupport: {name: 'Be a Friend', icon: '♡', detail: 'Ask Sam if they’d like some company.'},
  playgroundReport: {name: 'Get Help', icon: '✦', detail: 'Tell Ms. Rivera what happened by the bench.'},
  lunchNotice: {name: 'Spot Exclusion', icon: '◎', detail: 'Notice that the group keeps blocking Jo from joining.'},
  include: {name: 'Make Room', icon: '✿', detail: 'Invite Jo to sit with you in the Lunchroom.'},
  lunchReport: {name: 'Describe the Pattern', icon: '✦', detail: 'Tell Mr. Lee how long the group has been blocking the seat.'},
  busNotice: {name: 'Connect the Clues', icon: '◎', detail: 'Notice that the group keeps knocking Ari’s bag down.'},
  busSupport: {name: 'Check In Safely', icon: '♡', detail: 'Stay seated and quietly ask Ari if they’re okay.'},
  report: {name: 'Speak Up Safely', icon: '◈', detail: 'Tell a trusted adult what happened on the School Bus.'},
};
export type Badge = keyof typeof badges;
export type CardArt = 'repeat' | 'joke' | 'backpack' | 'seat' | 'adult' | 'shout';
export type SceneAction = 'pattern' | 'mistake' | 'support' | 'help' | 'unsafe' | 'report' | 'vague';
export const stepIds = ['notice', 'act', 'report'] as const;
export type StepId = typeof stepIds[number];
type Choice = {scene: SceneAction; cue: string; art?: CardArt; label: string; feedback: string; next?: StepId | 'finish'; badge?: Badge};
export type Challenge = {
  mode: 'select' | 'sequence';
  cards: {label: string; art?: CardArt}[];
  answer: number[];
};
export type Step = {prompt: string; story: string; choices: Choice[]; challenge?: Challenge};
export type Mission = {title: string; setting: string; icon: string; reflection: string; badgeByStep: Record<StepId, Badge>; steps: Record<StepId, Step>};
export const missions: Mission[] = [
  {
    title: 'The Playground', setting: 'Outside at recess', icon: '☀',
    reflection: 'Who is one trusted adult you could talk to at your school? Think of what you could say to start the conversation.',
    badgeByStep: {notice: 'playgroundNotice', act: 'playgroundSupport', report: 'playgroundReport'},
    steps: {
      notice: {prompt: 'What do you notice?', story: 'At recess, a group calls Sam a mean name. Sam asks them to stop. The group keeps going. You saw the same thing yesterday.', choices: [
        {scene: 'pattern', cue: 'The group keeps going.', label: 'They keep doing it even after Sam asks them to stop.', feedback: 'You spotted a pattern. A group repeatedly picking on one child can be bullying.', next: 'act', badge: 'playgroundNotice'},
        {scene: 'mistake', cue: 'Sam asks them to stop.', label: 'Everyone seems to be having fun.', feedback: 'Look at what Sam says. Asking them to stop is a clue that this is hurting Sam.'},
        {scene: 'pattern', cue: 'It happened yesterday, too.', label: 'It looks like a one-time argument.', feedback: 'Think about yesterday. The same group has picked on Sam more than once.'},
      ]},
      act: {prompt: 'What could you do first?', story: 'The group walks away. Sam stands near the bench. Ms. Rivera is nearby, watching the playground.', choices: [
        {scene: 'support', cue: 'Sam, want some company?', label: 'Ask Sam if they’d like some company.', feedback: 'Sam nods and asks you to come along to tell Ms. Rivera. Having someone beside you can make it easier to ask for help.', next: 'report', badge: 'playgroundSupport'},
        {scene: 'help', cue: 'Ms. Rivera, can you help?', label: 'Go straight to Ms. Rivera for help.', feedback: 'You can get an adult’s help right away. Ms. Rivera stops to listen and asks what you saw.', next: 'report'},
        {scene: 'unsafe', cue: 'You start to chase the group.', label: 'Chase the group and shout at them.', feedback: 'It makes sense to feel upset. Chasing the group could make things worse. Try a safer way to help.'},
      ]},
      report: {prompt: 'What could you tell Ms. Rivera?', story: 'Ms. Rivera asks, “Can you tell me what you saw?”', choices: [
        {scene: 'report', cue: 'It happened by the bench, twice.', label: 'A group called Sam names by the bench today and yesterday. Sam asked them to stop.', feedback: 'You shared what happened, where it happened, and that it happened before. Ms. Rivera checks on Sam and says she’ll follow up with the group.', next: 'finish', badge: 'playgroundReport'},
        {scene: 'vague', cue: 'Something bad happened…', label: 'Something bad happened.', feedback: 'That can be a good way to start. Now add what you saw, where it happened, and when.'},
      ]},
    },
  },
  {
    title: 'The Lunchroom', setting: 'Inside at lunchtime', icon: '✿',
    reflection: 'What could you say to invite someone to sit with you? Try saying it out loud.',
    badgeByStep: {notice: 'lunchNotice', act: 'include', report: 'lunchReport'},
    steps: {
      notice: {prompt: 'What clue stands out?', story: 'For three days, the same group has blocked the empty seat when Jo tries to sit down. Today, they laugh as Jo walks away with their tray.', choices: [
        {scene: 'pattern', cue: 'The group blocks the seat again.', label: 'The same group keeps blocking Jo from joining.', feedback: 'You noticed a pattern. Leaving someone out on purpose over and over can be bullying.', next: 'act', badge: 'lunchNotice'},
        {scene: 'mistake', cue: 'There’s an empty seat.', label: 'There must be no room at the table.', feedback: 'There is an empty seat. Think about who keeps blocking it and what happened on the other days.'},
      ]},
      act: {prompt: 'How could you help Jo?', story: 'Jo is looking for a seat. Mr. Lee is supervising lunch nearby.', choices: [
        {scene: 'support', cue: 'Jo, sit with me!', label: 'Invite Jo to sit with you.', feedback: 'Jo smiles and sits with you. You can make someone feel welcome and still ask an adult to help with what’s been happening.', next: 'report', badge: 'include'},
        {scene: 'help', cue: 'Mr. Lee, can you help?', label: 'Tell Mr. Lee what you noticed.', feedback: 'Asking for help is a safe choice. Mr. Lee asks you what has been happening.', next: 'report'},
        {scene: 'unsafe', cue: 'You laugh along with the group.', label: 'Laugh along so the group likes you.', feedback: 'It can feel hard to go against a group. Laughing along can add to the hurt. Try one thing that could help Jo.'},
      ]},
      report: {prompt: 'Build your report for Mr. Lee', story: 'Mr. Lee asks what happened near the lunch tables. Pick two details you actually saw that help explain the pattern.',
        challenge: {
          mode: 'select',
          cards: [
            {label: 'Jo carried a lunch tray.'},
            {label: 'The same group blocked Jo from an empty seat.'},
            {label: 'The group probably wanted the seat for a friend.'},
            {label: 'It happened three days in a row.'},
          ],
          answer: [1, 3],
        }, choices: [
        {scene: 'report', cue: 'They’ve blocked the seat for three days.', label: 'The same group has blocked Jo from an empty seat for three days.', feedback: 'You described the pattern clearly. Mr. Lee checks in with Jo privately and makes a plan to follow up.', next: 'finish', badge: 'lunchReport'},
        {scene: 'vague', cue: 'Jo had a bad lunch…', label: 'Jo had a bad lunch.', feedback: 'Pick the detail that tells Mr. Lee what the group did and the detail that tells him how often it happened. Leave out guesses about why.'},
      ]},
    },
  },
  {
    title: 'The School Bus', setting: 'On the way home', icon: '▰',
    reflection: 'If the bus driver is driving, which trusted adult could you tell when you get off the bus?',
    badgeByStep: {notice: 'busNotice', act: 'busSupport', report: 'report'},
    steps: {
      notice: {prompt: 'Pick the card that shows a pattern', story: 'A group keeps knocking Ari’s backpack off the seat, even after Ari asks them to stop. You saw the same thing on yesterday’s ride.', choices: [
        {scene: 'mistake', cue: 'Ari asks them to stop.', art: 'joke', label: 'Everyone is enjoying a joke.', feedback: 'Ari asked them to stop. That tells you it isn’t fun for Ari.'},
        {scene: 'pattern', cue: 'Watch the backpack.', art: 'backpack', label: 'A backpack fell once.', feedback: 'Think about yesterday’s ride. The group knocked the bag down more than once.'},
        {scene: 'pattern', cue: 'The backpack falls again.', art: 'repeat', label: 'The group keeps doing it after Ari asks them to stop.', feedback: 'You spotted the pattern. The same group keeps picking on Ari, even after being asked to stop.', next: 'act', badge: 'busNotice'},
      ]},
      act: {prompt: 'Pick a safe way to help Ari', story: 'The bus is moving. Ari has picked up the bag and is sitting across the aisle from you.', choices: [
        {scene: 'support', cue: 'Ari, are you okay?', art: 'seat', label: 'Stay seated and quietly ask Ari if they’re okay.', feedback: 'Ari says they’d like someone to go with them to tell an adult after the bus stops.', next: 'report', badge: 'busSupport'},
        {scene: 'unsafe', cue: 'You start to stand up.', art: 'shout', label: 'Stand up and shout at the group.', feedback: 'It makes sense to feel upset. While the bus is moving, stay seated and choose a safer way to help.'},
        {scene: 'help', cue: 'I’ll tell an adult at my stop.', art: 'adult', label: 'Stay seated and plan to tell an adult at your stop.', feedback: 'Getting help is a safe choice. Think about what you saw so you can explain it clearly.', next: 'report'},
      ]},
      report: {prompt: 'Put the safe steps in order', story: 'You’re off the bus now. Think back to the ride and put the three cards in order, starting while the bus is still moving.',
        challenge: {
          mode: 'sequence',
          cards: [
            {label: 'Explain what happened today and yesterday.', art: 'repeat'},
            {label: 'Stay seated while the bus is moving.', art: 'seat'},
            {label: 'At your stop, find a trusted adult.', art: 'adult'},
          ],
          answer: [1, 2, 0],
        }, choices: [
        {scene: 'vague', cue: 'What happens first?', art: 'backpack', label: 'Something happened with a bag.', feedback: 'Start by staying safe on the moving bus. Once you’re off, find an adult before you explain what happened.'},
        {scene: 'report', cue: 'It happened today and yesterday.', art: 'adult', label: 'The group knocked Ari’s bag down on the bus today and yesterday. Ari asked them to stop.', feedback: 'The adult listens, checks on Ari, and says they’ll speak with the school about making the bus ride safer.', next: 'finish', badge: 'report'},
      ]},
    },
  },
];
