import { Journey } from '../journey.model';

export const PROPHETS_PHASE_1: Journey[] = [
    {
        id: 'adam',
        prophetName: 'Adam (AS)',
        title: 'The First of Mankind',
        description: 'Experience the beginning of humanity, the trial in Jannah, and the first steps on Earth.',
        icon: '🌳',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'The Divine Plan',
                text: 'Allah announces to the angels: "I am placing a vicegerent (Khalifah) on earth." The angels ask: "Will You place therein one who will spread corruption and shed blood?" Allah replies: "I know that which you do not."',
                themeColor: 'emerald',
                imageHint: '☁️',
                choices: [{ text: 'Witness the Creation', nextSceneId: 'creation', wisdomAdded: 2 }]
            },
            {
                id: 'creation',
                title: 'Molded from Clay',
                text: 'Allah gathers soil from all parts of the earth—red, white, black, soft, and hard. He molds Adam (AS) and breathes His Spirit into him. Adam sneezes and says "Alhamdulillah".',
                themeColor: 'amber',
                imageHint: '🏺',
                choices: [{ text: 'Learn the Names', nextSceneId: 'names', wisdomAdded: 2 }]
            },
            {
                id: 'names',
                title: 'The Test of Knowledge',
                text: 'Allah teaches Adam the names of all things. He challenges the angels to name them. They fail. Adam names each one perfectly. "Did I not tell you that I know the unseen?" says Allah.',
                themeColor: 'primary',
                imageHint: '📚',
                choices: [{ text: 'Face the Prostration', nextSceneId: 'prostration', wisdomAdded: 3 }]
            },
            {
                id: 'prostration',
                title: 'The Refusal',
                text: 'All angels prostrate to Adam out of respect. Only Iblis refuses. "I am fire, he is clay. I am better." His arrogance creates the first sin.',
                themeColor: 'red',
                imageHint: '🔥',
                choices: [{ text: 'Enter Jannah', nextSceneId: 'jannah', wisdomAdded: 1 }]
            },
            {
                id: 'jannah',
                title: 'The Dwelling',
                text: 'Adam and Hawwa dwell in Paradise. "Eat freely from wherever you wish, but do not approach this one tree." They live in bliss, unaware of nakedness or hunger.',
                themeColor: 'emerald',
                imageHint: '🍇',
                choices: [{ text: 'Hear the Whisper', nextSceneId: 'whisper', wisdomAdded: 1 }]
            },
            {
                id: 'whisper',
                title: 'The Deception',
                text: 'Iblis swears by Allah: "I am a sincere advisor. Shall I show you the Tree of Eternity?" Slowly, their resolve weakens. They eat.',
                themeColor: 'slate',
                imageHint: '🐍',
                choices: [{ text: 'Realize the Error', nextSceneId: 'shame', wisdomAdded: 2 }]
            },
            {
                id: 'shame',
                title: 'The Fall',
                text: 'Their coverings fall away. Ashamed, they scramble for leaves. Allah calls: "Did I not forbid you from that tree?" They do not blame fate; they blame themselves.',
                themeColor: 'rose',
                imageHint: '🍃',
                choices: [{ text: 'Make Repentance', nextSceneId: 'repentance', wisdomAdded: 5 }]
            },
            {
                id: 'repentance',
                title: 'The Prayer of Adam',
                text: '"Our Lord! We have wronged ourselves. If You do not forgive us and bestow Your Mercy, we shall certainly be of the losers." Allah accepts their repentance.',
                themeColor: 'indigo',
                imageHint: '🤲',
                choices: [{ text: 'Descend to Earth', nextSceneId: 'earth', wisdomAdded: 2 }]
            },
            {
                id: 'earth',
                title: 'Life on Earth',
                text: 'They are sent down to Earth. Separation, then reunion at Arafat. They learn to till the soil, build shelter, and worship Allah in a new world.',
                themeColor: 'amber',
                imageHint: '🌍',
                choices: [{ text: 'Story of the Sons', nextSceneId: 'sons', wisdomAdded: 2 }]
            },
            {
                id: 'sons',
                title: 'Habil and Qabil',
                text: 'The first crime on earth. Qabil kills his brother Habil out of jealousy. A crow teaches him how to bury the body. Adam weeps but remains patient.',
                themeColor: 'slate',
                imageHint: '🐦',
                choices: [{ text: 'The Final Sermon', nextSceneId: 'finish', wisdomAdded: 3 }]
            },
            {
                id: 'finish',
                title: 'The Father of Humanity',
                text: 'Adam (AS) passes away, leaving his children with the legacy of Monotheism. Angels wash his body, teaching humanity the funeral rites.',
                themeColor: 'emerald',
                imageHint: '✨',
                choices: []
            }
        ]
    },
    // IDRIS (AS)
    {
        id: 'idris',
        prophetName: 'Idris (AS)',
        title: 'The Wise Messenger',
        description: 'The first to write with a pen and a man of high station.',
        icon: '✒️',
        themeColor: 'indigo',
        scenes: [
            {
                id: 'start',
                title: 'A Corrupt World',
                text: 'Generations after Adam, people began to forget. Idris (AS) was born in Babylon. He saw fire-worship beginning and stood against it.',
                themeColor: 'slate',
                imageHint: '🏙️',
                choices: [{ text: 'Call to Truth', nextSceneId: 'tech', wisdomAdded: 2 }]
            },
            {
                id: 'tech',
                title: 'The First Pen',
                text: 'Allah gifted Idris with many talents. He was the first to write, the first to stitch clothes (people wore skins), and skilled in astronomy.',
                themeColor: 'indigo',
                imageHint: '🧵',
                choices: [{ text: 'Teach the People', nextSceneId: 'migration', wisdomAdded: 3 }]
            },
            {
                id: 'migration',
                title: 'Migration for Allah',
                text: 'When Babylon rejected him, he said: "I will migrate for the sake of my Lord." He moved to Egypt (some say) near the Nile, teaching the Oneness of God.',
                themeColor: 'blue',
                imageHint: '🌊',
                choices: [{ text: 'The Heavy Deeds', nextSceneId: 'merit', wisdomAdded: 2 }]
            },
            {
                id: 'finish',
                title: 'Raised High',
                text: 'The Prophet Muhammad (SAW) met him in the 4th Heaven during Mi\'raj. "We raised him to a high station." A life of knowledge and action.',
                themeColor: 'emerald',
                imageHint: '✨',
                choices: []
            }
        ]
    },
    // NUH (AS)
    {
        id: 'nuh',
        prophetName: 'Nuh (AS)',
        title: 'The Prophet of Patience',
        description: '950 years of calling to Allah, ending in the Great Flood.',
        icon: '🚢',
        themeColor: 'blue',
        scenes: [
            {
                id: 'start',
                title: 'The First Idol',
                text: 'Shaytan tricked people into making statues of righteous men (Wadd, Suwa, etc.). Over time, reverence turned to worship. Nuh (AS) was sent to break this chain.',
                themeColor: 'slate',
                imageHint: '🗿',
                choices: [{ text: 'Begin the Call', nextSceneId: 'call', wisdomAdded: 1 }]
            },
            {
                id: 'call',
                title: 'Day and Night',
                text: '"O my people! I am a plain warner." He called them secretly and openly. They ridiculed him, putting fingers in their ears and covering their faces.',
                themeColor: 'slate',
                imageHint: '🗣️',
                choices: [{ text: 'Endure for Centuries', nextSceneId: 'rich_poor', wisdomAdded: 3 }]
            },
            {
                id: 'rich_poor',
                title: 'The Argument of the Elite',
                text: 'The chiefs said: "We see only the poor and weak following you. Drive them away, and we might listen." Nuh refused: "I am not one to drive away the believers."',
                themeColor: 'amber',
                imageHint: '👑',
                choices: [{ text: 'Face the Ultimatum', nextSceneId: 'prayer', wisdomAdded: 2 }]
            },
            {
                id: 'prayer',
                title: 'The Prayer of Despair',
                text: 'After 950 years, Allah revealed: "No more will believe." Nuh prayed: "My Lord! Leave not one of the disbelievers on the earth!"',
                themeColor: 'red',
                imageHint: '🤲',
                choices: [{ text: 'Plant the Trees', nextSceneId: 'building', wisdomAdded: 2 }]
            },
            {
                id: 'building',
                title: 'The Ark',
                text: 'He was commanded to build a ship far from the sea. The people passed by and mocked: "O Nuh! You have become a carpenter after being a Prophet?" He replied: "If you mock us, we will mock you."',
                themeColor: 'orange',
                imageHint: '🔨',
                choices: [{ text: 'Load the Ship', nextSceneId: 'oven', wisdomAdded: 3 }]
            },
            {
                id: 'oven',
                title: 'The Oven Boils',
                text: 'The sign arrived: water gushed from the oven. "Load a pair of every species!" The believers boarded. The sky opened with pouring water.',
                themeColor: 'blue',
                imageHint: '🌧️',
                choices: [{ text: 'The Final Plea', nextSceneId: 'son', wisdomAdded: 2 }]
            },
            {
                id: 'son',
                title: 'The Son',
                text: 'Waves like mountains rose. Nuh saw his son: "O my son! Embark with us!" The son replied: "I will take refuge on a mountain." A wave came between them.',
                themeColor: 'slate',
                imageHint: '🌊',
                choices: [{ text: 'The Storm Settles', nextSceneId: 'judi', wisdomAdded: 4 }]
            },
            {
                id: 'judi',
                title: 'Mount Judi',
                text: '"O Earth, swallow your water! O Sky, cease!" The Ark rested on Mount Judi. Nuh asked about his son. Allah corrected him: "He was not of your family (in faith)."',
                themeColor: 'emerald',
                imageHint: '⛰️',
                choices: [{ text: 'A New World', nextSceneId: 'finish', wisdomAdded: 3 }]
            },
            {
                id: 'finish',
                title: 'The Second Adam',
                text: 'All humans today descend from the believers on that Ark. Nuh (AS) is called the Second Adam.',
                themeColor: 'indigo',
                imageHint: '🌍',
                choices: []
            }
        ]
    }
    // ... Additional Prophets (Hud, Salih, Ibrahim, Lut, Ismail) to be added in next chunk or file to manage size.
    // Given the task size, separate files are better.
];
