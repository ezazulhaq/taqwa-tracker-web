import { Journey } from '../journey.model';

export const PROPHETS_PHASE_2: Journey[] = [
    {
        id: 'hud',
        prophetName: 'Hud (AS)',
        title: 'The Caller of \'Ad',
        description: 'Sent to the powerful giants of Iram who built lofty pillars.',
        icon: '🏜️',
        themeColor: 'amber',
        scenes: [
            {
                id: 'start',
                title: 'The Giants',
                text: 'The People of \'Ad were successors to Nuh\'s people. Physically huge and strong, they dwelled in Iram of the Pillars. They said: "Who is mightier than us?"',
                themeColor: 'amber',
                imageHint: '🏛️',
                choices: [{ text: 'Warn them', nextSceneId: 'warning', wisdomAdded: 1 }]
            },
            {
                id: 'warning',
                title: 'Brother Hud',
                text: 'Hud (AS) said: "O my people! Worship Allah! You have no other god but Him." They replied: "You are foolish and a liar."',
                themeColor: 'orange',
                imageHint: '🗣️',
                choices: [{ text: 'Remind of Blessings', nextSceneId: 'blessings', wisdomAdded: 2 }]
            },
            {
                id: 'blessings',
                title: 'Ungrateful',
                text: 'He pointed to their cattle, gardens, and springs. They built monuments on every high place just for vanity. "We will not leave our gods for your word!"',
                themeColor: 'slate',
                imageHint: '🏰',
                choices: [{ text: 'The Drought', nextSceneId: 'cloud', wisdomAdded: 2 }]
            },
            {
                id: 'cloud',
                title: 'The Deceptive Cloud',
                text: 'A drought struck. Then a large cloud appeared. They rejoiced: "This will give us rain!" Hud cried: "Nay! It is a wind containing a painful torment!"',
                themeColor: 'slate',
                imageHint: '☁️',
                choices: [{ text: 'Seek Shelter', nextSceneId: 'wind', wisdomAdded: 3 }]
            },
            {
                id: 'wind',
                title: 'The Raging Wind',
                text: 'The wind (Sarsar) screamed for 7 nights and 8 days. It lifted men and smashed them. It left them like hollow palm trunks.',
                themeColor: 'slate',
                imageHint: '🌪️',
                choices: [{ text: 'The Aftermath', nextSceneId: 'finish', wisdomAdded: 2 }]
            },
            {
                id: 'finish',
                title: 'Only the Ruin',
                text: 'The wind stopped. Nothing was seen except their empty dwellings. Hud and the believers were saved by Allah\'s mercy.',
                themeColor: 'indigo',
                imageHint: '🏚️',
                choices: []
            }
        ]
    },
    {
        id: 'salih',
        prophetName: 'Salih (AS)',
        title: 'The She-Camel',
        description: 'The people of Thamud carved homes in mountains and demanded a miracle.',
        icon: '🐪',
        themeColor: 'orange',
        scenes: [
            {
                id: 'start',
                title: 'The Mountain Carvers',
                text: 'Thamud succeeded \'Ad. They carved safe homes in rocks. But they worshipped idols. Salih (AS) was sent: "He created you from earth and settled you in it."',
                themeColor: 'orange',
                imageHint: '⛰️',
                choices: [{ text: 'The Challenge', nextSceneId: 'challenge', wisdomAdded: 1 }]
            },
            {
                id: 'challenge',
                title: 'An Impossible Demand',
                text: 'They pointed to a solid rock: "Bring a pregnant she-camel out of this rock, red and hairy!" Salih prayed. The rock cracked and groaned.',
                themeColor: 'slate',
                imageHint: '🪨',
                choices: [{ text: 'Witness the Miracle', nextSceneId: 'miracle', wisdomAdded: 3 }]
            },
            {
                id: 'miracle',
                title: 'Naqat-ullah',
                text: 'The massive camel emerged! She gave enough milk for the whole town. "She has a day to drink, and you have a day," Salih ordered. "Do not harm her."',
                themeColor: 'emerald',
                imageHint: '🐪',
                choices: [{ text: 'The Conspiracy', nextSceneId: 'plot', wisdomAdded: 2 }]
            },
            {
                id: 'plot',
                title: 'The Nine Men',
                text: 'Nine mischief-makers plotted. They hamstrung the camel and killed her. They mocked Salih: "Bring the punishment if you are truthful!"',
                themeColor: 'red',
                imageHint: '🔪',
                choices: [{ text: 'The Warning', nextSceneId: 'blast', wisdomAdded: 2 }]
            },
            {
                id: 'blast',
                title: 'The Scream',
                text: '"Enjoy your homes for three days." On the fourth morning, a mighty Blast (Sayhah) struck. Their hearts stopped instantly in their safe mountain homes.',
                themeColor: 'slate',
                imageHint: '🔊',
                choices: [{ text: 'The End', nextSceneId: 'finish', wisdomAdded: 1 }]
            },
            {
                id: 'finish',
                title: 'Silent Rocks',
                text: 'Salih turned away: "O my people, I advised you, but you do not like advisors."',
                themeColor: 'indigo',
                imageHint: '🌫️',
                choices: []
            }
        ]
    },
    {
        id: 'ibrahim',
        prophetName: 'Ibrahim (AS)',
        title: 'The Friend of Allah',
        description: 'The Father of Prophets who found Truth and passed every test.',
        icon: '🕌',
        themeColor: 'amber',
        scenes: [
            {
                id: 'start',
                title: 'The Idol Carver\'s Son',
                text: 'Azar carved idols. Ibrahim asked: "Why do you worship what hears not nor sees?" He was threatened with stoning.',
                themeColor: 'slate',
                imageHint: '🗿',
                choices: [{ text: 'Search for Truth', nextSceneId: 'stars', wisdomAdded: 2 }]
            },
            {
                id: 'stars',
                title: 'Star, Moon, Sun',
                text: 'He looked at the star: "This is my Lord?" It set. The Moon? It set. The Sun? It set. "I turn my face to the One who created them."',
                themeColor: 'primary',
                imageHint: '✨',
                choices: [{ text: 'The Great Smash', nextSceneId: 'idols', wisdomAdded: 3 }]
            },
            {
                id: 'idols',
                title: 'The Axe',
                text: 'While the town was at a festival, he smashed all idols except the big one. "Ask him, if he can speak!" The logic stumped them, but arrogance won.',
                themeColor: 'red',
                imageHint: '🪓',
                choices: [{ text: 'The Fire', nextSceneId: 'fire', wisdomAdded: 4 }]
            },
            {
                id: 'fire',
                title: 'Cool and Safe',
                text: 'They built a massive fire. HasbunAllah wa Ni\'mal Wakil. He was thrown in. Allah said: "O Fire! Be cool and safe for Ibrahim."',
                themeColor: 'emerald',
                imageHint: '🔥',
                choices: [{ text: 'The Migration', nextSceneId: 'kings', wisdomAdded: 3 }]
            },
            {
                id: 'kings',
                title: 'The Tyrant King',
                text: 'He debated Nimrod. "My Lord gives life and death." Nimrod killed a prisoner and spared one. Ibrahim said: "Allah brings the sun from the East; bring it from the West!" Nimrod was stumped.',
                themeColor: 'purple',
                imageHint: '👑',
                choices: [{ text: 'Leave for Palestine', nextSceneId: 'hajar', wisdomAdded: 3 }]
            },
            {
                id: 'hajar',
                title: 'The Valley',
                text: 'Old and grey, he is gifted Ismail from Hajar. He is commanded to leave them in Mecca. Hajar asks: "Did Allah command this?" "Yes." "Then He will not waste us."',
                themeColor: 'amber',
                imageHint: '🏜️',
                choices: [{ text: 'Zamzam', nextSceneId: 'sacrifice', wisdomAdded: 3 }]
            },
            {
                id: 'sacrifice',
                title: 'The Dream',
                text: 'The hardest test. Sacrifice your son. Both submit. As the knife touches, Allah calls: "You have fulfilled the vision!" A ram is given instead.',
                themeColor: 'rose',
                imageHint: '🐑',
                choices: [{ text: 'Build the Kaaba', nextSceneId: 'kaaba', wisdomAdded: 5 }]
            },
            {
                id: 'kaaba',
                title: 'The House of Allah',
                text: 'Father and son build the Cube. "Accept from us!" They call humanity to Hajj. The echo remains today.',
                themeColor: 'emerald',
                imageHint: '🕋',
                choices: []
            }
        ]
    }
];
