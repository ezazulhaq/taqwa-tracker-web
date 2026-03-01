import { Journey } from '../journey.model';

export const PROPHETS_PHASE_4: Journey[] = [
    {
        id: 'musa',
        prophetName: 'Musa (AS)',
        title: 'Kalimullah',
        description: 'The one who spoke to Allah directly. Defeater of Pharaoh.',
        icon: '🌊',
        themeColor: 'cyan',
        scenes: [
            {
                id: 'start',
                title: 'Year of Killing',
                text: 'Born in a terrifying era where Pharaoh decreed the ruthless massacre of all Israelite baby boys, Musa\'s mother received a heart-stopping divine inspiration: "Cast him into the river." With profound trust overriding unbearable fear, she placed her fragile newborn in a reed basket upon the rushing Nile.',
                themeColor: 'red',
                imageHint: '🧺',
                choices: [
                    { text: 'Hide the baby in fear of the soldiers.', nextSceneId: 'palace', wisdomAdded: 0, feedback: 'Her trust in Allah\'s inspiration was so immense she placed her baby in the Nile.' },
                    { text: 'Trust Allah completely and place him in the basket.', nextSceneId: 'palace', wisdomAdded: 4, feedback: '"We will return him to you and make him of the messengers."' }
                ]
            },
            {
                id: 'palace',
                title: 'Raised by the Enemy',
                text: 'Guided by providence, the river delivered the basket straight into the palace of the tyrant. Asiya, Pharaoh\'s righteous and compassionate wife, saw the child and pleaded, "He will be a joy to my eye and yours." Miraculously refusing all wet nurses, the royal court unknowingly paid his own heartbroken mother to nurse and raise him safely.',
                themeColor: 'amber',
                imageHint: '🏰',
                choices: [
                    { text: 'Marvel at Allah\'s perfect, flawless plan.', nextSceneId: 'flee', wisdomAdded: 3, feedback: 'The very enemy seeking to kill him paid his mother to raise him in the royal palace.' }
                ]
            },
            {
                id: 'flee',
                title: 'Escape to Madyan',
                text: 'Now a strong man, Musa intervened to protect an oppressed Israelite, accidentally striking the Egyptian guard dead. Struck with deep remorse, he prayed, "My Lord, I have wronged myself!" Hunted by authorities, he fled the bustling cities of Egypt, journeying alone across the harsh desert until he reached the quiet resting wells of Madyan.',
                themeColor: 'slate',
                imageHint: '🐑',
                choices: [
                    { text: 'Help two women water their flocks selflessly.', nextSceneId: 'fire', wisdomAdded: 4, feedback: 'He drew the heavy cover for them, leading to shelter and marriage.' },
                    { text: 'Hide and mind his own business.', nextSceneId: 'fire', wisdomAdded: 0, feedback: 'Prophets establish justice, even when they are exhausted refugees.' }
                ]
            },
            {
                id: 'fire',
                title: 'Tuwa Valley',
                text: 'A decade later, traveling through the freezing, pitch-black night with his family, Musa spotted a strange, brilliant fire high upon the slopes of Mount Tur. Approaching seeking warmth, the majestic, reality-altering Voice of the Creator called out: "O Musa! Indeed, I am your Lord! Remove your sandals, for you stand in the highly sacred valley of Tuwa!"',
                themeColor: 'orange',
                imageHint: '🔥',
                choices: [
                    { text: 'Run away from the overwhelming voice.', nextSceneId: 'pharaoh', wisdomAdded: 0, feedback: 'He stood firm, listening directly to the Lord of the Worlds.' },
                    { text: 'Listen, obey, and accept his Prophethood.', nextSceneId: 'pharaoh', wisdomAdded: 5, feedback: 'He was granted the Staff (snake) and the White Hand.' }
                ]
            },
            {
                id: 'pharaoh',
                title: 'The Magicians',
                text: 'Standing bravely before the most tyrannical, arrogant king on earth, Musa challenged Pharaoh. A grandiose showdown was staged before the entire nation. Pharaoh\'s elite magicians cast their ropes, creating terrifying, slithering illusions that struck fear into the hearts of the masses.',
                themeColor: 'purple',
                imageHint: '🐍',
                choices: [
                    { text: 'Throw his staff with unwavering certainty.', nextSceneId: 'sea', wisdomAdded: 4, feedback: 'His staff swallowed their illusions. Overwhelmed by the Truth, they instantly prostrated.' },
                    { text: 'Doubt the power of his simple wooden staff.', nextSceneId: 'sea', wisdomAdded: 0, feedback: 'He did feel slight fear, but Allah reassured him: "Fear not, you will overcome."' }
                ]
            },
            {
                id: 'sea',
                title: 'The Red Sea',
                text: 'Escaping under the cloak of darkness, the Israelites found themselves utterly trapped between the violently crashing, immense waves of the Red Sea and Pharaoh\'s bloodthirsty, heavily armed battalions closing in fast. Panic erupted.',
                themeColor: 'blue',
                imageHint: '🌊',
                choices: [
                    { text: 'Despair: "We will surely be overtaken!"', nextSceneId: 'tur', wisdomAdded: 0, feedback: 'This is what the people said out of sheer terror.' },
                    { text: 'Proclaim: "No! Indeed, with me is my Lord; He will guide me."', nextSceneId: 'tur', wisdomAdded: 5, feedback: 'He struck the sea. It split like colossal mountains, saving the believers.' }
                ]
            },
            {
                id: 'tur',
                title: 'Request to See',
                text: 'Following the miraculous crossing, Musa was called to the peak of Mount Sinai for forty days of intimate communion to receive the radiant Torah. Overwhelmed by profound spiritual longing and divine proximity, he boldly pleaded: "My Lord, reveal Yourself, that I may look upon You!"',
                themeColor: 'slate',
                imageHint: '⛰️',
                choices: [
                    { text: 'Accept Allah\'s answer of "You cannot see Me."', nextSceneId: 'calf', wisdomAdded: 3, feedback: 'When Allah revealed a glimpse to the mountain, it shattered into dust, and Musa fainted.' }
                ]
            },
            {
                id: 'calf',
                title: 'The Golden Calf',
                text: 'Descending the mountain bearing the incredibly heavy, shining Divine Tablets, Musa was met with a devastating sight: his people, impatient and deceived by the hypocrite Samiri, dancing in unholy worship around a lifeless golden calf.',
                themeColor: 'amber',
                imageHint: '🐂',
                choices: [
                    { text: 'Join them out of peer pressure.', nextSceneId: 'finish', wisdomAdded: 0, feedback: 'A Prophet\'s duty is to violently shatter idols. He raged against this severe Shirk.' },
                    { text: 'Throw down the Tablets in holy rage and confront them.', nextSceneId: 'finish', wisdomAdded: 4, feedback: 'He fiercely reprimanded his brother Harun and the people for falling into Shirk.' }
                ]
            },
            {
                id: 'finish',
                title: 'Death in the Wilderness',
                text: 'Standing at the very threshold of the Holy Land, his people stubbornly refused to face the battle ahead, declaring, "Go, you and your Lord, and fight!" Condemned to wander the desolate wilderness for forty grueling years, Musa eventually passed away, honored forever as Kalimullah—The One Who Spoke directly to Allah.',
                themeColor: 'indigo',
                imageHint: '🏜️',
                choices: []
            }
        ]
    },
    {
        id: 'sulayman',
        prophetName: 'Sulayman (AS)',
        title: 'King of Jinns & Men',
        description: 'The son of Dawud, granted an unparalleled kingdom.',
        icon: '🦅',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'Inherited Knowledge',
                text: 'Inheriting the glorious throne from his father Dawud, Sulayman prayed for a dominion unlike any other. Allah granted him breathtaking control over the fierce winds, commanded massive, unseen Jinn to dive and build for him, and gifted him the miraculous, intimate understanding of the languages of all birds and creatures.',
                themeColor: 'emerald',
                imageHint: '👑',
                choices: [
                    { text: 'Use this power for absolute, tyrannical dominion.', nextSceneId: 'ants', wisdomAdded: 0, feedback: 'His prayer was: "Lord, inspire me to be grateful for Your favor."' },
                    { text: 'Be deeply grateful and march with humble majesty.', nextSceneId: 'ants', wisdomAdded: 3 }
                ]
            },
            {
                id: 'ants',
                title: 'The Valley of Ants',
                text: 'Marching his majestic, terrifyingly vast multi-species army of men, giant jinn, and swooping birds, they approached a bustling valley. Sulayman\'s miraculous hearing picked up the tiny, brave voice of a female ant screaming: "O ants! Retreat into your homes, lest Sulayman and his unstoppable army crush you without perceiving!"',
                themeColor: 'amber',
                imageHint: '🐜',
                choices: [
                    { text: 'Ignore such a tiny creature\'s voice.', nextSceneId: 'sheba', wisdomAdded: 0, feedback: 'He could hear her perfectly due to his miraculous gift.' },
                    { text: 'Smile, stop the army, and thank Allah.', nextSceneId: 'sheba', wisdomAdded: 4, feedback: 'He smiled in amusement and intense gratitude to his Creator.' }
                ]
            },
            {
                id: 'sheba',
                title: 'Queen of Sheba',
                text: 'His fiercely sharp scout, the Hoopoe bird, urgently returned reporting a magnificently wealthy Queen of Sheba (Bilqis), whose entire nation tragically prostrated to the blinding sun instead of the Creator. Sulayman swiftly sent an authoritative letter: "In the Name of Allah... come to me in completely pure submission."',
                themeColor: 'purple',
                imageHint: '🏰',
                choices: [
                    { text: 'Demand her gold, subjugating her kingdom.', nextSceneId: 'floor', wisdomAdded: 0, feedback: 'He demanded: "Do not exalt yourselves against me, and come in submission [as Muslims]."' },
                    { text: 'Send an honorable, firm invitation to Tawheed.', nextSceneId: 'floor', wisdomAdded: 4 }
                ]
            },
            {
                id: 'floor',
                title: 'The Glass Floor',
                text: 'To profoundly demonstrate absolute Divine Power before her arrival, Sulayman demanded her heavily guarded, jewel-encrusted throne. Delivered literally in the blink of an eye by a scholar with knowledge of the Scripture, he then invited her into his palace. Stepping onto an incredibly polished, crystalline glass floor rushing over water, the highly intelligent Queen realized her power was nothing before Allah.',
                themeColor: 'cyan',
                imageHint: '💎',
                choices: [
                    { text: 'Trick her to humiliate her.', nextSceneId: 'finish', wisdomAdded: 0, feedback: 'It was a demonstration of overwhelming technological and spiritual majesty.' },
                    { text: 'Show her that true glory belongs to Allah alone.', nextSceneId: 'finish', wisdomAdded: 4, feedback: 'She folded her dress, then realized her error: "I have submitted with Sulayman to the Lord of the Worlds."' }
                ]
            },
            {
                id: 'finish',
                title: 'Death on the Staff',
                text: 'His death was a profound, final lesson shattering the arrogant myth of the Jinn. Sulayman passed away silently while standing, leaning heavily on his strong wooden staff overseeing their exhausting forced labor. The terrified Jinn toiled desperately for a very long time, utterly unaware of his passing until a tiny earthworm ate entirely through his staff. As it snapped and the great king fell, it shattered the illusion that the Jinn knew the Unseen.',
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
                text: 'To deeply test a fiercely legalistic society, Allah commanded a reality-defying miracle. The dazzling Archangel Jibril approached the profoundly pure, heavily devoted virgin Maryam, announcing a holy son. Astonished, she cried, "How? No man has ever touched me!" The decree was absolute: "It is easy for your Lord."',
                themeColor: 'cyan',
                imageHint: '👼',
                choices: [
                    { text: 'She submits to the profound decree of her Lord.', nextSceneId: 'cradle', wisdomAdded: 3 }
                ]
            },
            {
                id: 'cradle',
                title: 'Speech in Cradle',
                text: 'Carrying her tiny, newborn infant into the fiercely judgmental town square, Maryam faced a brutal barrage of vicious accusations against her pristine honor. Bound by a strict vow of total silence, she merely pointed to the baby. In an absolutely jaw-dropping miracle, the newborn infant powerfully opened his mouth and spoke with immense, mature prophetic eloquence.',
                themeColor: 'primary',
                imageHint: '🗣️',
                choices: [
                    { text: 'Claim to be a deity.', nextSceneId: 'table', wisdomAdded: 0, feedback: '"I am the slave of Allah. He made me a Prophet and dutiful to my mother."' },
                    { text: 'Speak the absolute truth: "I am a slave of Allah."', nextSceneId: 'table', wisdomAdded: 5, feedback: 'This miraculous speech cleared his mother\'s name instantly.' }
                ]
            },
            {
                id: 'table',
                title: 'The Heavenly Table Spread (Al-Ma\'idah)',
                text: 'Seeking ultimate, incontrovertible reassurance to bind their hearts absolutely, his closest disciples pleaded for an unprecedented miracle: "O Isa! Can your deeply Powerful Lord send down directly from the heavens a lavish table spread?" This grand feast would be a joyous, majestic festival for the first and the last of them.',
                themeColor: 'amber',
                imageHint: '🍱',
                choices: [
                    { text: 'Pray for it purely as a sign to firmly reassure their hearts.', nextSceneId: 'ascension', wisdomAdded: 4, feedback: 'It descended as a majestic feast, a festival for the first and last of them.' },
                    { text: 'Deny them, saying it is testing Allah.', nextSceneId: 'ascension', wisdomAdded: 0, feedback: 'Allah answered his prayer, warning of severe punishment for any who disbelieve afterward.' }
                ]
            },
            {
                id: 'ascension',
                title: 'Raised Up',
                text: 'Furious over his stinging critiques of their massive religious corruption, elite, ruthless authorities plotted a vicious, humiliating public crucifixion. But they planned darkly, and Allah planned perfectly. Flawlessly casting Isa\'s likeness onto a treacherous impostor who was dragged to the cross, Allah miraculously rescued His beloved Messenger, raising him alive securely to the highest heavens.',
                themeColor: 'indigo',
                imageHint: '☁️',
                choices: [
                    { text: 'Surrender to the unjust mob.', nextSceneId: 'finish', wisdomAdded: 0, feedback: '"They killed him not, nor crucified him, but it appeared so to them."' },
                    { text: 'Ascend to the heavens by Allah\'s immense power.', nextSceneId: 'finish', wisdomAdded: 4, feedback: 'Allah brilliantly took him up, saving him bodily from his enemies.' }
                ]
            },
            {
                id: 'finish',
                title: 'The Victorious Return',
                text: 'His incredible, beautifully profound earthly journey is powerfully not over. Muslims passionately hold the deep belief that Isa will physically, visibly descend from the heavens near the terrifying End of Time. He will valiantly slay the tyrannical Dajjal (Antichrist) and restore massive, perfect serene justice across the entire earth.',
                themeColor: 'emerald',
                imageHint: '⚔️',
                choices: []
            }
        ]
    }
];
