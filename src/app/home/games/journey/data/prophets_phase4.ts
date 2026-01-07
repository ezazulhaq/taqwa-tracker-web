import { Journey } from '../journey.model';

export const PROPHETS_PHASE_4: Journey[] = [
    {
        id: 'musa',
        prophetName: 'Musa (AS)',
        title: 'Kalimullah',
        description: 'The one who spoke to Allah. Defeater of Pharaoh.',
        icon: '🌊',
        themeColor: 'cyan',
        scenes: [
            {
                id: 'start',
                title: 'Year of Killing',
                text: 'Pharaoh dreamt a fire from Jerusalem burned Egypt. He ordered baby boys killed. Musa\'s mother was inspired: "Cast him in the river."',
                themeColor: 'red',
                imageHint: '🧺',
                choices: [{ text: 'The Palace', nextSceneId: 'palace', wisdomAdded: 2 }]
            },
            {
                id: 'palace',
                title: 'Raised by the Enemy',
                text: 'Asiya (Pharaoh\'s wife) found him. "A joy for me and you." They hired a wet nurse—his own mother. Allah\'s promise is true.',
                themeColor: 'amber',
                imageHint: '🏰',
                choices: [{ text: 'The Accident', nextSceneId: 'flee', wisdomAdded: 2 }]
            },
            {
                id: 'flee',
                title: 'Escape to Madyan',
                text: 'He accidentally killed an oppressor. "Lord, I wronged myself." He fled to Madyan, helped two women water flocks, and married one.',
                themeColor: 'slate',
                imageHint: '🐑',
                choices: [{ text: 'The Fire', nextSceneId: 'fire', wisdomAdded: 2 }]
            },
            {
                id: 'fire',
                title: 'Tuwa Valley',
                text: 'Seeing a fire, he approached. "O Musa! I am your Lord. Take off your shoes." He was given the Staff and the White Hand.',
                themeColor: 'orange',
                imageHint: '🔥',
                choices: [{ text: 'Confront Pharaoh', nextSceneId: 'pharaoh', wisdomAdded: 5 }]
            },
            {
                id: 'pharaoh',
                title: 'The Magicians',
                text: 'Reviewing the signs, magicians threw ropes looking like snakes. Musa\'s staff swallowed them. Magicians prostrated. Pharaoh crucified them.',
                themeColor: 'purple',
                imageHint: '🐍',
                choices: [{ text: 'The Plagues', nextSceneId: 'sea', wisdomAdded: 3 }]
            },
            {
                id: 'sea',
                title: 'The Red Sea',
                text: 'Trapped. "My Lord is with me!" He struck the sea. It split like two mountains. Israel crossed; Pharaoh drowned.',
                themeColor: 'blue',
                imageHint: '🌊',
                choices: [{ text: 'The Mountain', nextSceneId: 'tur', wisdomAdded: 3 }]
            },
            {
                id: 'tur',
                title: 'Request to See',
                text: '"Lord, show me Yourself." "You cannot see Me." The mountain crumbled. Musa fainted.',
                themeColor: 'slate',
                imageHint: '⛰️',
                choices: [{ text: 'Samiri', nextSceneId: 'calf', wisdomAdded: 2 }]
            },
            {
                id: 'calf',
                title: 'The Golden Calf',
                text: 'While away, Samiri misled them. They worshipped a calf. Musa threw the Tablets in anger. "Why did you not stop them, Harun?"',
                themeColor: 'amber',
                imageHint: '🐂',
                choices: [{ text: 'Wanderings', nextSceneId: 'finish', wisdomAdded: 1 }]
            },
            {
                id: 'finish',
                title: 'Death in the Wilderness',
                text: 'Israel refused to enter Jerusalem ("Go you and your Lord and fight"). They wandered 40 years. Musa died a stone\'s throw from the Holy Land.',
                themeColor: 'indigo',
                imageHint: '🏜️',
                choices: []
            }
        ]
    },
    {
        id: 'sulayman',
        prophetName: 'Sulayman (AS)',
        title: 'King of Ginns & Men',
        description: 'The son of Dawud, gifted a kingdom like no other.',
        icon: '🦅',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'Inherited Knowledge',
                text: 'Sulayman succeeded Dawud. "O people! We learned the language of birds." He marched with armies of Jinn, men, and birds.',
                themeColor: 'emerald',
                imageHint: '👑',
                choices: [{ text: 'Valley of Ants', nextSceneId: 'ants', wisdomAdded: 2 }]
            },
            {
                id: 'ants',
                title: 'The Ant',
                text: 'An ant cried: "Enter your homes lest Sulayman crush you!" He smiled. "Lord, inspire me to be grateful."',
                themeColor: 'amber',
                imageHint: '🐜',
                choices: [{ text: 'Missing Hoopoe', nextSceneId: 'sheba', wisdomAdded: 2 }]
            },
            {
                id: 'sheba',
                title: 'Queen of Sheba',
                text: 'Bilqis ruled Yemen, worshipping the sun. He sent a letter: "In the name of Allah... Come to me in submission."',
                themeColor: 'purple',
                imageHint: '🏰',
                choices: [{ text: 'The Throne', nextSceneId: 'floor', wisdomAdded: 3 }]
            },
            {
                id: 'floor',
                title: 'Glass Floor',
                text: 'He moved her throne instantly. She entered his palace, tucking her dress thinking the glass floor was water. "I have submitted," she said.',
                themeColor: 'cyan',
                imageHint: '💎',
                choices: [{ text: 'The End', nextSceneId: 'finish', wisdomAdded: 2 }]
            },
            {
                id: 'finish',
                title: 'Death on the Staff',
                text: 'He died leaning on his staff. The Jinn kept working for months until a termite ate the wood and he fell.',
                themeColor: 'slate',
                imageHint: '🦯',
                choices: []
            }
        ]
    },
    {
        id: 'isa',
        prophetName: 'Isa (AS)',
        title: 'Spirit of Allah',
        description: 'Maryam\'s son, the Messiah, who healed by Allah\'s leave.',
        icon: '🌴',
        themeColor: 'cyan',
        scenes: [
            {
                id: 'start',
                title: 'The Annunciation',
                text: 'Jibril told Maryam: "I grant you a pure boy." "How? No man touched me." "Allah creates what He wills."',
                themeColor: 'cyan',
                imageHint: '👼',
                choices: [{ text: 'The Birth', nextSceneId: 'cradle', wisdomAdded: 2 }]
            },
            {
                id: 'cradle',
                title: 'Speech in Cradle',
                text: 'People accused Maryam. The baby spoke: "I am the slave of Allah. He made me a Prophet and dutiful to my mother."',
                themeColor: 'primary',
                imageHint: '🗣️',
                choices: [{ text: 'Miracles', nextSceneId: 'table', wisdomAdded: 3 }]
            },
            {
                id: 'table',
                title: 'The Table Spread',
                text: 'Disciples asked for food from heaven. "Allah, send us a table!" It came down. A feast and a sign.',
                themeColor: 'amber',
                imageHint: '🍱',
                choices: [{ text: 'The Plot', nextSceneId: 'ascension', wisdomAdded: 2 }]
            },
            {
                id: 'ascension',
                title: 'Raised Up',
                text: 'They planned to kill him. "They killed him not, nor crucified him, but it appeared so." Allah raised him up.',
                themeColor: 'indigo',
                imageHint: '☁️',
                choices: [{ text: 'The Return', nextSceneId: 'finish', wisdomAdded: 1 }]
            },
            {
                id: 'finish',
                title: 'The Return',
                text: 'He will return to kill the Dajjal and rule with justice, breaking the cross and killing the pig.',
                themeColor: 'emerald',
                imageHint: '⚔️',
                choices: []
            }
        ]
    }
];
