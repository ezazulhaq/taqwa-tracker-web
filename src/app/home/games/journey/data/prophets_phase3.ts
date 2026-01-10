import { Journey } from '../journey.model';

export const PROPHETS_PHASE_3: Journey[] = [
    {
        id: 'lut',
        prophetName: 'Lut (AS)',
        title: 'Messenger to Sodom',
        description: 'Standing firm against a society drowned in vice.',
        icon: '🏚️',
        themeColor: 'slate',
        scenes: [
            {
                id: 'start',
                title: 'The Nephew',
                text: 'Lut (AS) migrated with Ibrahim (AS) then was sent to Sodom. Its people robbers, inhospitable, and committed sins no one before them had done.',
                themeColor: 'slate',
                imageHint: '🏙️',
                choices: [{ text: 'Preach Purity', nextSceneId: 'guests', wisdomAdded: 2 }]
            },
            {
                id: 'guests',
                title: 'The Beautiful Guests',
                text: 'Angels (Jibril, Mikail, Israfil) came as handsome men. Lut was distressed, knowing his people\'s wickedness. "This is a distressing day."',
                themeColor: 'rose',
                imageHint: '🚪',
                choices: [{ text: 'Protect the Guests', nextSceneId: 'mob', wisdomAdded: 2 }]
            },
            {
                id: 'mob',
                title: 'The Mob',
                text: 'The townspeople rushed the house. "Did we not forbid you from hosting men?" Lut pleaded: "These are my daughters (women of the town for marriage)... fear Allah!"',
                themeColor: 'red',
                imageHint: '😠',
                choices: [{ text: 'The Angel\'s Reveal', nextSceneId: 'blind', wisdomAdded: 3 }]
            },
            {
                id: 'blind',
                title: 'Blinded',
                text: 'Jibril struck the men with his wing. They lost their sight instantly. "Taste my punishment!" The angels told Lut: "Leave by night. Do not look back."',
                themeColor: 'slate',
                imageHint: '👁️',
                choices: [{ text: 'The Departure', nextSceneId: 'wife', wisdomAdded: 2 }]
            },
            {
                id: 'wife',
                title: 'The Look Back',
                text: 'As they fled, a mighty scream tore the sky. Lut\'s wife, who supported the people\'s sins, looked back. A stone struck her.',
                themeColor: 'slate',
                imageHint: '🗿',
                choices: [{ text: 'The Overturning', nextSceneId: 'finish', wisdomAdded: 1 }]
            },
            {
                id: 'finish',
                title: 'Marked Stones',
                text: 'Jibril lifted the cities with his wing tip to the sky, then flipped them upside down. Stones of baked clay rained down.',
                themeColor: 'indigo',
                imageHint: '🏜️',
                choices: []
            }
        ]
    },
    {
        id: 'ismail',
        prophetName: 'Ismail (AS)',
        title: 'The Patient Son',
        description: 'The ancestor of the Arabs and the grandfather of the Final Prophet.',
        icon: '💧',
        themeColor: 'blue',
        scenes: [
            {
                id: 'start',
                title: 'Left in the Desert',
                text: 'Ibrahim left Hajar and infant Ismail in Mecca. She asked: "To whom do you leave us?" He said nothing. "To Allah?" "Yes." "He will not lose us."',
                themeColor: 'amber',
                imageHint: '🏜️',
                choices: [{ text: 'The Thirst', nextSceneId: 'zamzam', wisdomAdded: 3 }]
            },
            {
                id: 'zamzam',
                title: 'Zamzam',
                text: 'Hajar ran between Safa and Marwa 7 times. The angel struck the ground. Water gushed. She shouted "Zome! Zome!" (Stop/Gather).',
                themeColor: 'cyan',
                imageHint: '💧',
                choices: [{ text: 'The Jurhum Tribe', nextSceneId: 'sacrifice', wisdomAdded: 2 }]
            },
            {
                id: 'sacrifice',
                title: 'The Obedience',
                text: 'Years later, the dream. "O father, do what you are commanded." He lay down. The knife refused to cut. "You have passed the test!"',
                themeColor: 'rose',
                imageHint: '🔪',
                choices: [{ text: 'Building the House', nextSceneId: 'kaaba', wisdomAdded: 4 }]
            },
            {
                id: 'finish',
                title: 'The Messenger',
                text: 'He became a messenger to the tribes. He was true to his promise and commanded his family to pray.',
                themeColor: 'emerald',
                imageHint: '✨',
                choices: []
            }
        ]
    },
    {
        id: 'ishaq',
        prophetName: 'Ishaq (AS)',
        title: 'The Promise',
        description: 'The son of Sarah, born in old age, father of Yaqub.',
        icon: '📜',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'The Laugh',
                text: 'Angels visited Ibrahim. Sarah stood laughing (or amazed). "We give you glad tidings of Ishaq." She struck her face: "An old woman and a barren man?"',
                themeColor: 'emerald',
                imageHint: '😲',
                choices: [{ text: 'The Decree', nextSceneId: 'birth', wisdomAdded: 2 }]
            },
            {
                id: 'birth',
                title: 'The Wise Prophet',
                text: 'Ishaq lived in Palestine. He carried the legacy of Prophethood. Allah praised him as having "hands (strength meant for deeds) and vision (insight)".',
                themeColor: 'primary',
                imageHint: '👁️',
                choices: [{ text: 'The Twins', nextSceneId: 'finish', wisdomAdded: 2 }]
            },
            {
                id: 'finish',
                title: 'Israel',
                text: 'He had two sons, Esau and Yaqub. From Yaqub came the Israelites.',
                themeColor: 'indigo',
                imageHint: '🌳',
                choices: []
            }
        ]
    },
    {
        id: 'yusuf',
        prophetName: 'Yusuf (AS)',
        title: 'The Best Story',
        description: 'A story of jealousy, patience, temptation, power, and forgiveness.',
        icon: '👑',
        themeColor: 'indigo',
        scenes: [
            {
                id: 'start',
                title: 'The Dream',
                text: '"O father, I saw 11 stars, the sun, and the moon prostrating to me." Yaqub said: "Do not tell your brothers."',
                themeColor: 'indigo',
                imageHint: '💤',
                choices: [{ text: 'The Plot', nextSceneId: 'well', wisdomAdded: 1 }]
            },
            {
                id: 'well',
                title: 'The Well',
                text: 'Brothers threw him in a well. They brought a shirt with fake blood. "A wolf ate him." Yaqub: "Beautiful Patience (Sabrun Jameel)."',
                themeColor: 'slate',
                imageHint: '🕳️',
                choices: [{ text: 'Sold in Egypt', nextSceneId: 'sedution', wisdomAdded: 2 }]
            },
            {
                id: 'sedution',
                title: 'The Test of Chastity',
                text: 'The Aziz bought him. He grew handsome. The wife tried to seduce him. He ran. She tore his shirt from behind.',
                themeColor: 'rose',
                imageHint: '🚪',
                choices: [{ text: 'Choose Prison', nextSceneId: 'prison', wisdomAdded: 5 }]
            },
            // ... (Continuing story in same vein)
            {
                id: 'prison',
                title: 'The Prison',
                text: 'He interpreted dreams for prisoners. "One will pour wine, the other crucified." He asked the survivor to mention him to the King. But he forgot for years.',
                themeColor: 'slate',
                imageHint: '⛓️',
                choices: [{ text: 'The King\'s Dream', nextSceneId: 'king', wisdomAdded: 2 }]
            },
            {
                id: 'king',
                title: 'Fat and Lean Cows',
                text: '7 fat cows eaten by 7 lean ones. Yusuf interpreted: 7 years of plenty, 7 of famine. Store the grain.',
                themeColor: 'amber',
                imageHint: '🌾',
                choices: [{ text: 'Rise to Power', nextSceneId: 'brothers', wisdomAdded: 3 }]
            },
            {
                id: 'brothers',
                title: 'The Reunion',
                text: 'Brothers came for food. He recognized them. He put a cup in Benjamin\'s bag to keep him. The brothers pleaded.',
                themeColor: 'emerald',
                imageHint: '🏆',
                choices: [{ text: 'The Reveal', nextSceneId: 'forgive', wisdomAdded: 3 }]
            },
            {
                id: 'forgive',
                title: 'No Blame Today',
                text: '"I am Yusuf." They were ashamed. "No blame on you today. Allah forgive you." He sent his shirt to heal his father\'s eyes.',
                themeColor: 'indigo',
                imageHint: '👕',
                choices: [{ text: 'The Prostration', nextSceneId: 'finish', wisdomAdded: 2 }]
            },
            {
                id: 'finish',
                title: 'Dream Fulfilled',
                text: 'Parents and brothers bowed. "This is the interpretation of my dream." Yusuf died a Muslim and joined the righteous.',
                themeColor: 'emerald',
                imageHint: '✨',
                choices: []
            }
        ]
    }
];
