import { Journey } from '../journey.model';

export const PROPHETS_PHASE_1: Journey[] = [
    {
        id: 'adam',
        prophetName: 'Adam (AS)',
        title: 'The First of Mankind',
        description: 'Experience the stunning genesis of humanity, the tragic trial in the eternal gardens of Jannah, and the monumental first steps upon a wild Earth.',
        icon: '🌳',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'The Divine Assembly',
                text: 'Before the concept of time as we know it, a momentous decree echoes through the heavens. Allah announces to the awe-struck assembly of angels: "I am placing a vicegerent (Khalifah) upon the earth." The angels, knowing the destructive nature of free will, ask: "Will You place therein one who will spread corruption and shed blood, while we constantly glorify You?" The majestic reply silences the heavens: "I know that which you do not know."',
                themeColor: 'emerald',
                imageHint: '☁️',
                choices: [
                    { text: 'Trust completely in Allah\'s unfathomable Wisdom.', nextSceneId: 'creation', wisdomAdded: 3 },
                    { text: 'Question the necessity of this new creation.', nextSceneId: 'creation', wisdomAdded: 0, feedback: 'Even the angels questioned respectfully, but Allah\'s wisdom encompasses what no creation can see.' }
                ]
            },
            {
                id: 'creation',
                title: 'Molded from the Earth',
                text: 'Angels are dispatched to gather soil from every corner of the Earth—red sands, white dust, black earth, soft loam, and rugged rock, representing the beautiful diversity of mankind to come. From this clay, Adam (AS) is perfectly sculpted. When Allah breathes His Spirit into him, the clay transforms into living, breathing flesh. Adam suddenly sneezes, opening his eyes to a dazzling reality.',
                themeColor: 'amber',
                imageHint: '🏺',
                choices: [
                    { text: 'Utter the very first human words: "Alhamdulillah" (Praise be to Allah).', nextSceneId: 'names', wisdomAdded: 3, feedback: 'Allah responds: "May your Lord have mercy upon you, O Adam." The first interaction of humanity is steeped in Divine Mercy.' },
                    { text: 'Remain entirely silent in overwhelming awe.', nextSceneId: 'names', wisdomAdded: 1, feedback: 'Awe is natural, but recognizing and praising the Creator immediately invokes His infinite mercy.' }
                ]
            },
            {
                id: 'names',
                title: 'The Unveiling of Knowledge',
                text: 'Allah demonstrates the unique superiority of mankind: the capacity for language and profound intellect. He directly teaches Adam the names, nature, and purpose of all things in existence. Presenting these wonders to the angels, He challenges them: "Inform me of the names of these, if you are truthful." The angels bow their heads, admitting their limited knowledge. Adam is then commanded to speak, flawlessly reciting the names.',
                themeColor: 'primary',
                imageHint: '📚',
                choices: [
                    { text: 'Humbly attribute this vast knowledge solely to Allah\'s teaching.', nextSceneId: 'prostration', wisdomAdded: 3 },
                    { text: 'Boast to the angels about this newfound intellectual dominance.', nextSceneId: 'prostration', wisdomAdded: 0, feedback: 'Knowledge is a trust meant to inspire humility, not a weapon for arrogance.' }
                ]
            },
            {
                id: 'prostration',
                title: 'The Original Sin of Pride',
                text: 'As an ultimate mark of honor for Adam, Allah commands all the heavenly hosts to prostrate to him. Without hesitation, millions of angels descend into prostration. But one figure remains standing defiantly: Iblis, a Jinn elevated among the angels. His heart swells with toxic pride. "I am better than him!" he sneers. "You created me from smokeless fire, and created him from mere mud and clay."',
                themeColor: 'red',
                imageHint: '🔥',
                choices: [
                    { text: 'Recognize the terrifying danger of racial pride and arrogance.', nextSceneId: 'jannah', wisdomAdded: 2, feedback: 'Pride (Kibr) was the very first sin committed against Allah, blinding Iblis to the truth forever.' },
                    { text: 'Attempt to rationally debate the merits of fire versus clay with Iblis.', nextSceneId: 'jannah', wisdomAdded: 1, feedback: 'Iblis had already made a conscious, arrogant choice to openly disobey a direct Divine command.' }
                ]
            },
            {
                id: 'jannah',
                title: 'The Eternal Gardens',
                text: 'Adam and his newly created wife, Hawwa, are placed in the breathtaking expanse of Paradise. "O Adam, dwell you and your wife in Paradise and eat freely from wherever you wish," Allah commands, granting them unimaginable luxury, free from hunger, thirst, or sorrow. "But do not approach this one specific tree, lest you both become among the wrongdoers."',
                themeColor: 'emerald',
                imageHint: '🍇',
                choices: [
                    { text: 'Enjoy the limitless bounties with deep gratitude, avoiding the tree.', nextSceneId: 'whisper', wisdomAdded: 2 }
                ]
            },
            {
                id: 'whisper',
                title: 'The Venomous Deception',
                text: 'Consumed by eternal jealousy, Iblis plots his revenge. He approaches them disguised as a sincere, concerned advisor. He doesn\'t demand they disobey; he gently plants a seed of doubt. He swears an oath by Allah: "Your Lord only forbade you this tree to prevent you from becoming angels or gaining immortal, eternal life in this Kingdom!"',
                themeColor: 'slate',
                imageHint: '🐍',
                choices: [
                    { text: 'Ignore the whisper; Allah\'s command is absolute and sufficient.', nextSceneId: 'shame', wisdomAdded: 3, feedback: 'If only mankind could always do this! But their resolve weakened, teaching humanity a timeless lesson in vigilance.' },
                    { text: 'Entertain the thought of securing eternal life in Jannah.', nextSceneId: 'shame', wisdomAdded: 0, feedback: 'Satan is an open, calculating enemy. His glittering promises are nothing but poisonous deception.' }
                ]
            },
            {
                id: 'shame',
                title: 'The Tragic Fall',
                text: 'Their curiosity and desire override their resolve. They taste the fruit. Instantly, the illusion shatters. The glorious garments of Paradise vanish from their bodies. Overwhelmed by sudden, crushing shame and nakedness, they frantically try to cover themselves with large leaves from the garden. The Majestic Voice of Allah echoes: "Did I not forbid you from that tree and tell you that Satan is to you a clear enemy?"',
                themeColor: 'rose',
                imageHint: '🍃',
                choices: [
                    { text: 'Try to hide from Allah behind the trees of the garden.', nextSceneId: 'repentance', wisdomAdded: 1, feedback: 'You cannot hide from the All-Seeing. Turning back toward Him in absolute brokenness is the only way.' },
                    { text: 'Step forward openly, utterly broken, and acknowledge the immense error.', nextSceneId: 'repentance', wisdomAdded: 3 }
                ]
            },
            {
                id: 'repentance',
                title: 'Words of Pure Light',
                text: 'Unlike Iblis who argued and blamed Allah for his guidance, Adam and Hawwa are shattered by remorse. Allah, out of His infinite Mercy, inspires their hearts with specific words of profound repentance that will serve as a lifeline for all their descendants.',
                themeColor: 'indigo',
                imageHint: '🤲',
                choices: [
                    { text: 'Argue that it was destined, or blame Iblis for the deception.', nextSceneId: 'earth', wisdomAdded: 0, feedback: 'Evading accountability is the path of Satan. Adam took full responsibility.' },
                    { text: 'Cry out: "Our Lord! We have deeply wronged ourselves. If You do not forgive us and bestow Your Mercy upon us, we shall certainly be of the absolute losers!"', nextSceneId: 'earth', wisdomAdded: 5, feedback: 'A beautiful, timeless prayer of accountability. Allah immediately accepted their repentance, though they still had to leave Jannah.' }
                ]
            },
            {
                id: 'earth',
                title: 'The Descent to Earth',
                text: 'They are sent down to a wild, untamed Earth. The shock of the harsh environment is coupled with the pain of separation, until they joyously reunite at the plains of Arafat. Here, they must learn to till hard soil, build shelters from raw materials, face the elements, and establish the worship of Allah in a new, challenging world.',
                themeColor: 'amber',
                imageHint: '🌍',
                choices: [
                    { text: 'Roll up your sleeves and begin building a righteous civilization with immense patience.', nextSceneId: 'sons', wisdomAdded: 2 }
                ]
            },
            {
                id: 'sons',
                title: 'The First Bloodshed',
                text: 'Decades later, tragedy strikes the first family. Qabil, boiling with bitter jealousy over a rejected sacrifice, murders his righteous brother Habil—the first murder in human history. Carrying the heavy corpse in confusion, Qabil watches a raven expertly bury another dead raven in the dirt. Realizing his own ignorance and the horror of his act, he is crushed by regret. Adam (AS) weeps tears of profound sorrow for his fractured family.',
                themeColor: 'slate',
                imageHint: '🐦',
                choices: [
                    { text: 'Demand brutal vengeance and curse Qabil forever.', nextSceneId: 'finish', wisdomAdded: 0, feedback: 'Prophets teach restorative justice and divine restraint, not blind, consuming vengeance.' },
                    { text: 'Grieve with dignified patience, entirely trusting in Allah\'s ultimate judgment.', nextSceneId: 'finish', wisdomAdded: 3, feedback: 'Sabr (beautiful patience) is the defining mark of a Prophet in times of severe, heart-rending calamity.' }
                ]
            },
            {
                id: 'finish',
                title: 'The Great Father\'s Departure',
                text: 'After a long lifetime of establishing humanity\'s foundation, Adam (AS) passes away, leaving his many generations of children with the strict legacy of pure Monotheism. Angels descend to gently wash his body and bury him, teaching humanity the sacred and respectful funeral rites that will endure until the end of time.',
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
        title: 'The Master of the Pen',
        description: 'The first scribe, a visionary pioneer of civilization, and a man elevated to a profoundly high station.',
        icon: '✒️',
        themeColor: 'indigo',
        scenes: [
            {
                id: 'start',
                title: 'A World Forgetting',
                text: 'Generations after Adam\'s departure, the clear memory of Tawheed (Monotheism) began to fade. Idris (AS) was born into the growing city of Babylon. He watched with a heavy heart as humanity began shifting towards darkness, specifically the subtle beginnings of idol and fire worship, prioritizing the physical over the spiritual.',
                themeColor: 'slate',
                imageHint: '🏙️',
                choices: [
                    { text: 'Stand firmly in the city squares and call them back to the pure Oneness of God.', nextSceneId: 'tech', wisdomAdded: 3 },
                    { text: 'Retreat to the mountains and leave the corrupt city to its own devices.', nextSceneId: 'tech', wisdomAdded: 0, feedback: 'A Prophet never abandons his duty to warn and guide the people, no matter how corrupt the society.' }
                ]
            },
            {
                id: 'tech',
                title: 'The Dawn of Innovation',
                text: 'To aid in spreading the message, Allah gifted Idris with extraordinary intellectual talents. He was the very first human to write words with a pen, capturing knowledge for future generations. He was also the first to measure, cut, and stitch woven garments, elevating people from wearing crude animal skins into civilized clothing, and he possessed profound knowledge of the cosmos.',
                themeColor: 'indigo',
                imageHint: '🧵',
                choices: [
                    { text: 'Guard this advanced knowledge closely to ensure his own elite status.', nextSceneId: 'migration', wisdomAdded: 0, feedback: 'Beneficial knowledge is a trust from Allah that must be shared freely to uplift all of humanity.' },
                    { text: 'Actively teach the people these useful skills alongside the message of Islam.', nextSceneId: 'migration', wisdomAdded: 3, feedback: 'By teaching humanity how to write and make garments, he established the foundations of true civilization.' }
                ]
            },
            {
                id: 'migration',
                title: 'The First Exodus',
                text: 'Despite his brilliant teachings, the arrogant elite of Babylon vehemently rejected him, clinging to their fabricated gods. Realizing the soil there was dead, he boldly declared: "I will migrate for the sake of my Lord." Gathering his followers, he led the very first Hijrah (migration) in history, traveling far away until they reached the fertile banks of the Nile in Egypt, where he continued to spread the light of Tawheed.',
                themeColor: 'blue',
                imageHint: '🌊',
                choices: [
                    { text: 'Lament the loss of his homeland and the comforts of his youth.', nextSceneId: 'finish', wisdomAdded: 0, feedback: 'He migrated solely for Allah, knowing with certainty that the entire Earth belongs to Him.' },
                    { text: 'Trust absolutely that Allah will bless the new land and cause the message to flourish.', nextSceneId: 'finish', wisdomAdded: 3 }
                ]
            },
            {
                id: 'finish',
                title: 'Elevated Beyond Measure',
                text: 'His life was characterized by a relentless drive: he never let a day pass without performing an immense amount of righteous deeds and teaching the truth. As a reward for this tireless dedication, Allah declares in the Quran: "And We raised him to a highly exalted station." During the miraculous Night Journey (Mi\'raj), Prophet Muhammad (SAW) would meet him warmly in the Fourth Heaven.',
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
        title: 'The Prophet of Unbreakable Patience',
        description: 'A staggering 950 years of relentless preaching to deaf ears, culminating in the terrifying, earth-cleansing Great Flood.',
        icon: '🚢',
        themeColor: 'blue',
        scenes: [
            {
                id: 'start',
                title: 'The Creeping Poison of Shirk',
                text: 'Long after Idris, Shaytan devised a cunning, multi-generational trap. He inspired people to carve beautiful statues of five highly righteous men who had recently died (Wadd, Suwa, Yaghuth, Ya\'uq, and Nasr), claiming it was just to "remember their piety." Slowly, as generations passed, reverence tragically devolved into full-blown worship. Polytheism (Shirk) had finally entered the Earth. Nuh (AS) was urgently sent to shatter this dark chain.',
                themeColor: 'slate',
                imageHint: '🗿',
                choices: [
                    { text: 'Begin calling them back to Allah through gentle, persistent reasoning.', nextSceneId: 'call', wisdomAdded: 2 },
                    { text: 'Sneak in and violently smash all the idols in the middle of the night.', nextSceneId: 'call', wisdomAdded: 0, feedback: 'Nuh spent centuries preaching using profound wisdom, logical arguments, and beautiful preaching first.' }
                ]
            },
            {
                id: 'call',
                title: 'A Millennium of Rejection',
                text: '"O my people! Worship Allah, you have no deity other than Him! I am to you a clear warner." Nuh preached relentlessly—in public gatherings, in secret whispers, during the day, and in the dead of night. He promised them rain, wealth, and children if they simply repented. But their hearts were harder than stone. They aggressively thrust their fingers deep into their ears and covered their heads with their massive cloaks just to avoid seeing his face.',
                themeColor: 'slate',
                imageHint: '🗣️',
                choices: [
                    { text: 'Become exhausted and completely give up after 100 years of total rejection.', nextSceneId: 'rich_poor', wisdomAdded: 0, feedback: 'He possessed absolutely unparalleled patience, continuing his Da\'wah through generations for a staggering 950 years!' },
                    { text: 'Swallow the bitter insults, endure the mockery, and continue preaching century after century.', nextSceneId: 'rich_poor', wisdomAdded: 4, feedback: 'His superhuman patience remains a towering, monumental example for all believers until the end of time.' }
                ]
            },
            {
                id: 'rich_poor',
                title: 'The Arrogance of the Elite',
                text: 'The wealthy, arrogant chieftains of the tribe approached Nuh with a sinister deal. Looking down their noses at his followers, they sneered: "We see none following you except the lowest and poorest among us. Drive these peasants away from your gatherings, and then perhaps we nobles will sit and listen to your message."',
                themeColor: 'amber',
                imageHint: '👑',
                choices: [
                    { text: 'Agree to momentarily dismiss the poor to secure the crucial political support of the chiefs.', nextSceneId: 'prayer', wisdomAdded: 0, feedback: 'Nuh categorically refused. True value in Islam is based solely on piety and faith, never on wealth or social class.' },
                    { text: 'Refuse with absolute firmness: "I am not one to drive away the believers. I am but a clear warner!"', nextSceneId: 'prayer', wisdomAdded: 3 }
                ]
            },
            {
                id: 'prayer',
                title: 'The Final Verdict',
                text: 'After 950 grueling years, the divine revelation finally descended with heavy finality: "None of your people will believe except those who have already believed. So do not be distressed by what they have been doing." Realizing the cycle of corruption would only birth more toxic generations, Nuh poured his heartbreak into a decisive prayer.',
                themeColor: 'red',
                imageHint: '🤲',
                choices: [
                    { text: 'Pray with absolute conviction: "My Lord! Leave not a single one of the disbelievers alive upon the earth!"', nextSceneId: 'building', wisdomAdded: 2 }
                ]
            },
            {
                id: 'building',
                title: 'The Ship in the Desert',
                text: 'Allah commanded Nuh to construct a massive ship under His direct supervision, far inland and incredibly distant from any sea. As Nuh and the believers labored tirelessly, chopping wood and driving nails, the townspeople would pass by in crowds, laughing hysterically. "O Nuh! Have you finally gone mad? Have you become a lowly carpenter after claiming to be a Prophet? Where will you sail this massive block of wood? On the sand?"',
                themeColor: 'orange',
                imageHint: '🔨',
                choices: [
                    { text: 'Focus intently on the nails and boards, ignoring the mockery with absolute trust in the Divine command.', nextSceneId: 'oven', wisdomAdded: 3, feedback: '"If you mock us now, soon we will mock you," he replied, building with unshakable certainty.' },
                    { text: 'Stop hammering, look at the dry desert, and question if the water will truly come.', nextSceneId: 'oven', wisdomAdded: 0, feedback: 'A Prophet\'s certainty never wavers. He knows Allah\'s revelation is truer than the ground he stands on.' }
                ]
            },
            {
                id: 'oven',
                title: 'The Boiling of the Earth',
                text: 'The terrifying, pre-ordained sign finally manifested: water suddenly began gushing violently from a traditional stone oven (Tannur). It was the signal. Nuh frantically marshaled the believers. Meanwhile, the sky tore open, pouring down sheets of relentless, heavy water, while the earth fractured, erupting with massive geysers. The two waters met for a matter already decreed.',
                themeColor: 'blue',
                imageHint: '🌧️',
                choices: [
                    { text: 'Focus solely on rushing the human believers aboard, leaving the animals to their fate.', nextSceneId: 'son', wisdomAdded: 0, feedback: 'Allah commanded him to take a pair of every species. A Prophet must obey the command precisely to preserve the delicate balance of life.' },
                    { text: 'Methodically load a male and female of every animal species, along with the small band of believers.', nextSceneId: 'son', wisdomAdded: 3 }
                ]
            },
            {
                id: 'son',
                title: 'The Tragedy of the Son',
                text: 'The floodwaters surged rapidly, forming terrifying waves the size of towering mountains. Amidst the roaring chaos, Nuh spotted his own son struggling in the churning water. A father\'s heart screamed over the storm: "O my beloved son! Embark with us and do not be with the disbelievers!" The arrogant son shouted back: "I will take refuge on that tall mountain; it will protect me from the water!" In a heartbeat, a colossal wave smashed between them, swallowing the son forever.',
                themeColor: 'slate',
                imageHint: '🌊',
                choices: [
                    { text: 'Scream in fury and attempt to dive into the raging mountain-waves to save him manually.', nextSceneId: 'judi', wisdomAdded: 0, feedback: 'The waves were apocalyptic; diving in would be suicidal and direct disobedience to Allah\'s decree to remain on the Ark.' },
                    { text: 'Close his eyes, swallow the immense grief, and accept the painful decree of Allah.', nextSceneId: 'judi', wisdomAdded: 4, feedback: 'He learned the hardest lesson of all: true family ties are bound intimately by faith, not merely by blood.' }
                ]
            },
            {
                id: 'judi',
                title: 'The Resting of the Ark',
                text: 'After months of tossing on a completely submerged planet, the command echoed: "O Earth, swallow your water! O Sky, cease your rain!" The waters miraculously subsided, and the colossal Ark came to a gentle rest upon the peaks of Mount Judi. Nuh, still grieving, asked Allah about his son, noting that Allah\'s promise to save his family was true. Allah firmly but gently corrected him: "O Nuh, he is not of your family; indeed, his conduct was unrighteous."',
                themeColor: 'emerald',
                imageHint: '⛰️',
                choices: [
                    { text: 'Immediately repent, begging forgiveness for asking about something of which he had no divine knowledge.', nextSceneId: 'finish', wisdomAdded: 3, feedback: 'Nuh immediately sought refuge in Allah, realizing that spiritual kinship overrides biological ties.' }
                ]
            },
            {
                id: 'finish',
                title: 'The Second Father of Humanity',
                text: 'The heavy doors of the Ark opened, and the survivors stepped onto a washed, pristine, and silent Earth. Every single human being alive today descends directly from the faithful companions on that wooden ship. Thus, Nuh (AS) is forever honored as the Second Father of Humanity, a titan of patience whose legacy survived the end of the world.',
                themeColor: 'indigo',
                imageHint: '🌍',
                choices: []
            }
        ]
    }
];
