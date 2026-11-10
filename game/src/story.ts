export type Badge = 'notice' | 'support' | 'help';
export const badges: Record<Badge, {name: string; icon: string; detail: string}> = {
  notice: {name: 'Spot the signs', icon: '◎', detail: 'Notice when hurtful behavior keeps happening.'},
  support: {name: 'Be a friend', icon: '♡', detail: 'Show a classmate they have someone on their side.'},
  help: {name: 'Get help', icon: '✦', detail: 'Tell a trusted adult what you saw.'},
};
type Choice = {label: string; feedback: string; next?: string; badge?: Badge};
export type Step = {prompt: string; story: string; choices: Choice[]};
export type Mission = {title: string; setting: string; icon: string; reflection: string; steps: Record<string, Step>};
export const missions: Mission[] = [
  {
    title: 'The Playground', setting: 'Outside at recess', icon: '☀',
    reflection: 'Who is one trusted adult you could talk to at your school? Think of what you could say to start the conversation.',
    steps: {
      notice: {prompt: 'What do you notice?', story: 'At recess, a group calls Sam a mean name. Sam asks them to stop. The group keeps going. You saw the same thing yesterday.', choices: [
        {label: 'They keep doing it even after Sam asks them to stop.', feedback: 'You spotted a pattern. A group repeatedly picking on one child can be bullying.', next: 'act', badge: 'notice'},
        {label: 'Everyone seems to be having fun.', feedback: 'Look at what Sam says. Asking them to stop is a clue that this is hurting Sam.'},
        {label: 'It looks like a one-time argument.', feedback: 'Think about yesterday. The same group has picked on Sam more than once.'},
      ]},
      act: {prompt: 'What could you do first?', story: 'The group walks away. Sam stands near the bench. Ms. Rivera is nearby, watching the playground.', choices: [
        {label: 'Ask Sam if they’d like some company.', feedback: 'Sam nods and asks you to come along to tell Ms. Rivera. Having someone beside you can make it easier to ask for help.', next: 'report', badge: 'support'},
        {label: 'Go straight to Ms. Rivera for help.', feedback: 'You can get an adult’s help right away. Ms. Rivera stops to listen and asks what you saw.', next: 'report'},
        {label: 'Chase the group and shout at them.', feedback: 'It makes sense to feel upset. Chasing the group could make things worse. Try a safer way to help.'},
      ]},
      report: {prompt: 'What could you tell Ms. Rivera?', story: 'Ms. Rivera asks, “Can you tell me what you saw?”', choices: [
        {label: 'A group called Sam names by the bench today and yesterday. Sam asked them to stop.', feedback: 'You shared what happened, where it happened, and that it happened before. Ms. Rivera checks on Sam and says she’ll follow up with the group.', next: 'finish', badge: 'help'},
        {label: 'Something bad happened.', feedback: 'That can be a good way to start. Now add what you saw, where it happened, and when.'},
      ]},
    },
  },
  {
    title: 'The Lunchroom', setting: 'Inside at lunchtime', icon: '✿',
    reflection: 'What could you say to invite someone to sit with you? Try saying it out loud.',
    steps: {
      notice: {prompt: 'What clue stands out?', story: 'For three days, the same group has blocked the empty seat when Jo tries to sit down. Today, they laugh as Jo walks away with their tray.', choices: [
        {label: 'The same group keeps blocking Jo from joining.', feedback: 'You noticed a pattern. Leaving someone out on purpose over and over can be bullying.', next: 'act', badge: 'notice'},
        {label: 'There must be no room at the table.', feedback: 'There is an empty seat. Think about who keeps blocking it and what happened on the other days.'},
      ]},
      act: {prompt: 'How could you help Jo?', story: 'Jo is looking for a seat. Mr. Lee is supervising lunch nearby.', choices: [
        {label: 'Invite Jo to sit with you.', feedback: 'Jo smiles and sits with you. You can make someone feel welcome and still ask an adult to help with what’s been happening.', next: 'report', badge: 'support'},
        {label: 'Tell Mr. Lee what you noticed.', feedback: 'Asking for help is a safe choice. Mr. Lee asks you what has been happening.', next: 'report'},
        {label: 'Laugh along so the group likes you.', feedback: 'It can feel hard to go against a group. Laughing along can add to the hurt. Try one thing that could help Jo.'},
      ]},
      report: {prompt: 'What could you tell Mr. Lee?', story: 'Mr. Lee asks what has been happening near the lunch tables.', choices: [
        {label: 'The same group has blocked Jo from an empty seat for three days.', feedback: 'You described the pattern clearly. Mr. Lee checks in with Jo privately and makes a plan to follow up.', next: 'finish', badge: 'help'},
        {label: 'Jo had a bad lunch.', feedback: 'Tell Mr. Lee what you actually saw and how often it happened so he knows where to start.'},
      ]},
    },
  },
];
