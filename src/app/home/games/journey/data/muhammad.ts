import { Journey } from '../journey.model';

export const MUHAMMAD_JOURNEY: Journey = {
    id: 'muhammad',
    prophetName: 'Muhammad (SAW)',
    title: 'Seal of the Prophets',
    description: 'The Final Journey. Experience the Seerah from the Cave of Hira to the heights of Sidrat-ul-Muntaha, and the magnificent establishment of Islam across the earth.',
    icon: '🕌',
    themeColor: 'emerald',
    scenes: [
        // PRE-REVELATION
        {
            id: 'start',
            title: 'The Pact of Virtues',
            text: 'Years before the monumental weight of Prophethood descended upon his shoulders, a young Muhammad fiercely witnessed the noble leaders of Mecca forge a magnificent, unbreakable pact to fiercely protect the oppressed (Hilf al-Fudul). He valued this noble commitment to raw justice above the most precious wealth of Arabia.',
            themeColor: 'indigo',
            imageHint: '🤝',
            choices: [
                { text: 'Value justice higher than wealth.', nextSceneId: 'khadijah_marriage', wisdomAdded: 3 },
                { text: 'Ignore it as a tribal affair.', nextSceneId: 'khadijah_marriage', wisdomAdded: 0, feedback: 'He always valued justice, saying he would join such a pact even in Islam.' }
            ]
        },
        {
            id: 'khadijah_marriage',
            title: 'Marriage to Khadijah',
            text: 'Widely acclaimed in Mecca as "Al-Amin" (The Trustworthy) for his flawless, stellar honesty in highly lucrative international trade, the incredibly noble and wealthy Khadijah (RA) boldly proposed marriage. It rapidly blossomed into an extraordinarily deeply blessed, passionate union defined by unwavering love and fierce, absolute support.',
            themeColor: 'rose',
            imageHint: '💍',
            choices: [
                { text: 'Enter the marriage with integrity and love.', nextSceneId: 'hira', wisdomAdded: 3 }
            ]
        },
        // PHASE 1: The Beginning of Revelation
        {
            id: 'hira',
            title: 'The Cave of Hira',
            text: 'In the deeply quiet, still year of 610 CE, aged forty, he constantly retreated to the towering, dangerously narrow Cave of Hira, desperately seeking absolute truth to escape the brutally toxic, heavily idolatrous society of Mecca. Amidst his intense spiritual solitude, an overwhelmingly massive, terrifying presence suddenly materialized.',
            themeColor: 'slate',
            imageHint: '⛰️',
            choices: [
                { text: 'Run away immediately in utter terror.', nextSceneId: 'read', wisdomAdded: 0, feedback: 'Though terrified, he stayed, and the Angel embraced him.' },
                { text: 'Wait in stillness, despite the immense weight.', nextSceneId: 'read', wisdomAdded: 4 }
            ]
        },
        {
            id: 'read',
            title: 'The First Command',
            text: 'Filling the entirely cramped cave, the colossal Archangel Jibril issued a single, reality-shattering command: "Iqra!" (Read!). The deeply terrified Prophet truthfully stammered, "I am not a reader." The immensely radiant angel violently embraced him three times, squeezing him tightly before reciting the majestic, eternal words establishing exactly who his Lord is.',
            themeColor: 'emerald',
            imageHint: '📖',
            choices: [
                { text: 'Repeat after the Angel: "Read in the name of your Lord..."', nextSceneId: 'khadijah', wisdomAdded: 4 }
            ]
        },
        {
            id: 'khadijah',
            title: 'The Comfort of Khadijah',
            text: 'Shaking violently like a frail leaf amidst an icy gale, he rushed frantically back to his sanctuary. Falling into Khadijah\'s arms, he pleaded, "Cover me! Cover me!" Overwhelmed by sheer terror, he feared he might be losing his very mind.',
            themeColor: 'rose',
            imageHint: '🏠',
            choices: [
                { text: 'Doubt his own sanity entirely.', nextSceneId: 'waraqah', wisdomAdded: 0, feedback: 'Khadijah reminded him of his noble character, proving it was a divine event.' },
                { text: 'Find solace in Khadijah\'s wise, comforting words.', nextSceneId: 'waraqah', wisdomAdded: 4, feedback: '"Allah will never disgrace you. You unite relations and help the poor."' }
            ]
        },
        {
            id: 'waraqah',
            title: 'The Prediction',
            text: 'Waraqah, an elderly, blind Christian scholar holding profound knowledge of ancient scriptures, listened intently. He astonishingly confirmed: "This is the great Namus (Angel) sent to Musa! I dearly wish I were a strong youth to support you when your people viciously drive you out." Startled deeply, the Prophet asked, "Will they truly drive me out?"',
            themeColor: 'amber',
            imageHint: '📜',
            choices: [
                { text: 'Accept the heavy burden of Prophethood.', nextSceneId: 'secret_call', wisdomAdded: 5, feedback: 'Waraqah warned that no man brings such a message without facing severe enmity.' }
            ]
        },
        // PHASE 2: The Secret and Open Call
        {
            id: 'secret_call',
            title: 'The Secret Invitation',
            text: 'For three intensely fragile, incredibly sensitive years, the revolutionary light of Islam was shared exclusively in profound secrecy. It spread cautiously, intensely targeting only the closest, most deeply trusted family and friends to safely protect the incredibly vulnerable new believers.',
            themeColor: 'slate',
            imageHint: '🤫',
            choices: [
                { text: 'Preach openly at the Kaaba immediately.', nextSceneId: 'safa', wisdomAdded: 0, feedback: 'Patience and timing were commanded by Allah to protect the fragile early community.' },
                { text: 'Be patient, build the core believers in secret.', nextSceneId: 'safa', wisdomAdded: 3 }
            ]
        },
        {
            id: 'safa',
            title: 'Mount Safa',
            text: 'Finally commanded by Allah to broadcast the majestic truth fiercely and openly, he ascended Mount Safa. Having established his flawless, legendary reputation, he asked, "If I warned you an army hides behind this mountain, would you believe me?" They affirmed perfectly. "Then I loudly warn you of a severe, terrifying punishment if you associate partners with Allah!"',
            themeColor: 'orange',
            imageHint: '⛰️',
            choices: [
                { text: 'Patiently endure Abu Lahab\'s harsh insults.', nextSceneId: 'persecution', wisdomAdded: 4, feedback: 'He remained completely silent. Allah Himself defended him by revealing Surah Al-Masad.' },
                { text: 'Curse Abu Lahab back in public anger.', nextSceneId: 'persecution', wisdomAdded: 0, feedback: 'A Prophet does not stoop to petty insults. Allah handled his defense.' }
            ]
        },
        {
            id: 'persecution',
            title: 'Era of Persecution',
            text: 'The ruling Quraish retaliated with shocking, brutal physical torture and intense psychological warfare. Powerless slaves like Bilal (RA) were violently dragged mercilessly across scorching, heavily burning desert sands under crushing boulders. Yet, his voice passionately pierced the terrible agony: "Ahad! Ahad!" (God is One! God is One!).',
            themeColor: 'red',
            imageHint: '🔥',
            choices: [
                { text: 'Fight back physically while weak.', nextSceneId: 'abyssinia', wisdomAdded: 0, feedback: 'They were commanded to withhold their hands and establish prayer during this phase.' },
                { text: 'Advise the most vulnerable to migrate to Abyssinia.', nextSceneId: 'abyssinia', wisdomAdded: 3, feedback: 'A vital strategic move to preserve the community\'s lives.' }
            ]
        },
        {
            id: 'abyssinia',
            title: 'The Just King',
            text: 'To deeply escape the violent, escalating terror, a vulnerable core of early believers migrated to the Christian kingdom of Abyssinia. Standing bravely before the just King Negus, Ja\'far recited the breathtaking verses of Surah Maryam. Hot, heavy tears streamed deeply down the king\'s beard as he recognized the identical divine source.',
            themeColor: 'blue',
            imageHint: '👑',
            choices: [
                { text: 'Rejoice in the safety of the believers in Africa.', nextSceneId: 'umar', wisdomAdded: 2 }
            ]
        },
        {
            id: 'umar',
            title: 'The Conversion of Umar',
            text: 'Fierce, immensely powerful Umar grabbed his sword fully intending to murder the Prophet and end Islam permanently. But after forcefully hearing to the mesmerizing verses of Surah Ta-Ha in his sister\'s home, his deeply hardened heart violently shattered. His dramatic, stunning conversion brought immediate, massive physical strength and bold public defense to the Muslims.',
            themeColor: 'emerald',
            imageHint: '⚔️',
            choices: [
                { text: 'Finally pray openly as a community at the Kaaba.', nextSceneId: 'search_strength', wisdomAdded: 4 }
            ]
        },
        {
            id: 'search_strength',
            title: 'The Year of Sorrow',
            text: 'Tragically subjected to a brutally agonizing, starving three-year total social and economic boycott trapped in a barren mountain pass, the Prophet emerged only to face the devastating "Year of Sorrow". His intensely beloved, endlessly comforting wife Khadijah, and his powerful, fiercely protective uncle Abu Talib, both tragically passed away.',
            themeColor: 'slate',
            imageHint: '🍂',
            choices: [
                { text: 'Travel to Taif to seek a new stronghold.', nextSceneId: 'taif', wisdomAdded: 2 }
            ]
        },
        {
            id: 'taif',
            title: 'The Trial of Taif',
            text: 'Seeking a welcoming, desperately needed sanctuary, he traveled alone to Taif. Their arrogant leaders viciously mocked him, maliciously sending mobs to stone him mercilessly until his shoes were thickly filled with heavy blood. An enraged Angel offered to violently crush the entire city securely between two mountains.',
            themeColor: 'rose',
            imageHint: '🩸',
            choices: [
                { text: '"Yes, crush them for their cruelty!"', nextSceneId: 'isra', wisdomAdded: 0, feedback: 'He was sent as a Mercy to the worlds, not a punisher.' },
                { text: '"No, perhaps Allah will raise believers from their descendants."', nextSceneId: 'isra', wisdomAdded: 8, feedback: 'One of the greatest displays of mercy in human history.' }
            ]
        },
        // PHASE 3: Isra and Mi'raj
        {
            id: 'isra',
            title: 'The Night Journey (Al-Isra wal Mi\'raj)',
            text: 'As a profoundly intimate, heavily majestic comfort after such devastating grief, Jibril awoke him for an absolutely miraculous, reality-defying night journey. Transported magically from Mecca directly to the sacred, highly revered precincts of Jerusalem, he stood majestically as the ultimate Imam, beautifully leading the souls of all past Prophets in deeply profound, unified prayer.',
            themeColor: 'indigo',
            imageHint: '🌌',
            choices: [
                { text: 'Ascend through the Heavens to the Divine Presence.', nextSceneId: 'miraj', wisdomAdded: 4 }
            ]
        },
        {
            id: 'miraj',
            title: 'The Gift of Salah',
            text: 'Ascending past the heavens in an incredibly stunning, awe-inspiring celestial ascent, he reached the dizzying, brilliant summit of Sidrat-ul-Muntaha—where even the mighty Jibril dared not tread. Brought exclusively close to the intensely majestic Divine Presence, he received the staggering, immensely valuable gift of the mandatory daily prayers.',
            themeColor: 'primary',
            imageHint: '🛐',
            choices: [
                { text: 'Accept the 50 without question.', nextSceneId: 'pledge', wisdomAdded: 0, feedback: 'Musa (AS) advised him it was too heavy for his Ummah.' },
                { text: 'Negotiate until it is reduced to 5, with the immense reward of 50.', nextSceneId: 'pledge', wisdomAdded: 5, feedback: 'Out of profound love and care for his Ummah\'s ease.' }
            ]
        },
        // PHASE 4: Hijrah
        {
            id: 'pledge',
            title: 'Pledge of Aqabah',
            text: 'In the pitch-black cover of night, secretly risking an incredibly dangerous encounter, delegates from the distant oasis city of Yathrib pledged absolute, fierce protection in Aqabah. At long last, the joyous, highly-awaited divine command to permanently sever ties and definitively migrate (Hijrah) was wonderfully granted.',
            themeColor: 'emerald',
            imageHint: '🤝',
            choices: [
                { text: 'Leave Mecca under the cover of night with Abu Bakr (RA).', nextSceneId: 'cave_thawr', wisdomAdded: 3 }
            ]
        },
        {
            id: 'cave_thawr',
            title: 'The Cave of Thawr',
            text: 'Violently pursued heavily by bloodthirsty, heavily armed assassins craving a massive bounty, he and his intensely beloved companion Abu Bakr desperately sought refuge in a tiny cave. Tracker footprints appeared literally inches away. Abu Bakr wept in raw, sheer terror.',
            themeColor: 'slate',
            imageHint: '🕸️',
            choices: [
                { text: 'Panic and try to fight.', nextSceneId: 'madinah_arrival', wisdomAdded: 0, feedback: 'Absolute trust in Allah (Tawakkul) was required here.' },
                { text: '"Do not grieve; indeed Allah is with us."', nextSceneId: 'madinah_arrival', wisdomAdded: 5, feedback: 'Allah sent a spider to spin a web, blinding the assassins to the truth.' }
            ]
        },
        {
            id: 'madinah_arrival',
            title: 'Arrival in Madinah',
            text: 'Emerging safely after an incredibly agonizing, perilous desert escape, Medina erupted in rapturous, incredibly sheer unadulterated joy. Women and children excitedly sang praises from the rooftops. Countless tribal leaders fiercely competed to host the tremendously beloved Messenger.',
            themeColor: 'green',
            imageHint: '🌴',
            choices: [
                { text: 'Pick the wealthiest host.', nextSceneId: 'brotherhood', wisdomAdded: 0, feedback: 'He avoided jealousy by letting Allah decide.' },
                { text: 'Let his camel Qaswa choose, saying: "She is commanded."', nextSceneId: 'brotherhood', wisdomAdded: 4, feedback: 'A brilliant diplomatic move ensuring perfect fairness.' }
            ]
        },
        {
            id: 'brotherhood',
            title: 'Bond of Brotherhood',
            text: 'Instantly establishing a brilliantly unprecedented, highly radical social foundation, he paired every destitute, exhausted Meccan immigrant exclusively with a wealthy, eager Medinan helper. Homes, wealth, and deep fraternity were enthusiastically split exactly in half, building a fiercely strong society utterly immune to tribal racism.',
            themeColor: 'emerald',
            imageHint: '❤️',
            choices: [
                { text: 'Draft the Constitution of Medina for all citizens.', nextSceneId: 'badr', wisdomAdded: 3 }
            ]
        },
        // PHASE 5: The Battles
        {
            id: 'badr',
            title: 'The Day of Criterion (Badr)',
            text: 'Severely outnumbered, intensely terrified, and heavily out-armed by an arrogant army completely bent on total annihilation, 313 Muslims firmly held their ground in Badr. The Prophet prayed agonizingly desperately until his cloak fell. A breathtaking, spectacular victory was miraculously secured by legions of heavily descending assisting angels.',
            themeColor: 'primary',
            imageHint: '⚔️',
            choices: [
                { text: 'Execute all seventy prisoners of war.', nextSceneId: 'uhud', wisdomAdded: 0, feedback: 'He chose a path of mercy and diplomacy instead.' },
                { text: 'Show mercy, allowing them to ransom themselves or teach literacy.', nextSceneId: 'uhud', wisdomAdded: 5, feedback: 'An unprecedented move of mercy in 7th century Arabia.' }
            ]
        },
        {
            id: 'uhud',
            title: 'The Lesson of Uhud',
            text: 'During Uhud, a tragic, highly devastating lapse in strict discipline occurred: believing the battle definitively won, archers disobeyed a critical, explicit strategic command entirely to chase worldly spoils. The enemy instantly flanked them brutally. The Prophet was horrifically and terribly injured, and a wildly terrifying false rumor forcefully declared his tragic death.',
            themeColor: 'orange',
            imageHint: '🏹',
            choices: [
                { text: 'Flee in panic from the battlefield.', nextSceneId: 'trench', wisdomAdded: 0, feedback: 'A severe test of faith. Only a few remained steadfast.' },
                { text: 'Regroup fiercely around the Prophet and endure.', nextSceneId: 'trench', wisdomAdded: 4, feedback: 'Allah revealed: "Muhammad is not but a messenger... if he dies or is killed, will you turn back?"' }
            ]
        },
        {
            id: 'trench',
            title: 'Battle of the Trench (Al-Khandaq)',
            text: 'A terrifyingly massive, unprecedentedly colossal coalition of 10,000 fiercely hostile warriors besieged helpless Medina. Following brilliant, incredibly strategic foreign advice, the Muslims desperately dug a massive, deeply impassable defensive trench. Pierced fiercely by freezing, completely unbearable cold and incredibly brutal, agonizing starvation, their very hearts jumped deeply to their throats.',
            themeColor: 'slate',
            imageHint: '🛡️',
            choices: [
                { text: 'Surrender to the massive army.', nextSceneId: 'hudaybiyyah', wisdomAdded: 0, feedback: 'Tawakkul and hard work were the keys.' },
                { text: 'Dig the trench alongside them, tying a stone to his stomach for hunger.', nextSceneId: 'hudaybiyyah', wisdomAdded: 5, feedback: 'While striking a rock, he saw the future palaces of Rome and Persia falling to Islam.' }
            ]
        },
        // PHASE 6: Victory and Peace
        {
            id: 'hudaybiyyah',
            title: 'Treaty of Hudaybiyyah',
            text: 'Setting out solely to peacefully perform the Umrah pilgrimage in pure, stark white garments, the heavily hostile Quraish permanently blocked their sacred path. The Prophet agreed fully to a deeply frustrating, intensely humiliating peace treaty that completely infuriated his fiercely boldest companions.',
            themeColor: 'white',
            imageHint: '📝',
            choices: [
                { text: 'Fight to enter Mecca out of pride.', nextSceneId: 'letters', wisdomAdded: 0, feedback: 'Prophetic insight saw past pride into the long-term benefit of peace.' },
                { text: 'Accept the treaty for peace, trusting Allah\'s revelation.', nextSceneId: 'letters', wisdomAdded: 6, feedback: 'Allah called it a "Manifest Victory"—allowing Islam to spread rapidly in peacetime.' }
            ]
        },
        {
            id: 'letters',
            title: 'Letters to Empires',
            text: 'Leveraging the brilliantly negotiated, highly secure peace treaty, the Prophet assertively sent highly dignified, incredibly brave official envoys firmly radiating pure Tawheed globally. From the massive, incredibly powerful Emperor of Rome to the incredibly arrogant King of Persia, the fierce, stunning call of Islam went vibrantly international.',
            themeColor: 'indigo',
            imageHint: '✉️',
            choices: [
                { text: 'Watch Islam\'s message go truly global.', nextSceneId: 'conquest', wisdomAdded: 3 }
            ]
        },
        {
            id: 'conquest',
            title: 'Conquest of Mecca',
            text: 'Because the Quraish foolishly broke the treaty unconditionally, ten thousand heavily armed, incredibly disciplined Muslims marched overwhelmingly into Mecca in an absolutely bloodless, stunningly triumphant final conquest. Despite thirteen long, deeply brutal years of agonizing terror, he bowed his incredibly humble, majestic head so low it practically beautifully touched his saddle.',
            themeColor: 'emerald',
            imageHint: '🕋',
            choices: [
                { text: 'Take bloody revenge for 13 years of torture.', nextSceneId: 'farewell', wisdomAdded: 0, feedback: 'Prophets do not exact personal revenge.' },
                { text: 'Smash the idols and declare: "Go, for you are free!"', nextSceneId: 'farewell', wisdomAdded: 10, feedback: 'This ultimate act of general amnesty caused thousands to accept Islam.' }
            ]
        },
        // PHASE 7: The Farewell
        {
            id: 'farewell',
            title: 'The Farewell Hajj',
            text: 'Accompanied by over one hundred thousand intensely devoted, deeply weeping companions, he delivered his incredibly profound, immensely towering Farewell Sermon on Mount Arafat. It was the absolute pinnacle, fiercely declaring the total abolition of tribal ugly racism and firmly demanding the profound respect of women\'s immensely sacred rights.',
            themeColor: 'primary',
            imageHint: '⛰️',
            choices: [
                { text: 'Bear witness that he conveyed the Message perfectly.', nextSceneId: 'illness', wisdomAdded: 5, feedback: '"This day I have perfected for you your religion..."' }
            ]
        },
        {
            id: 'illness',
            title: 'The Choice',
            text: 'Fever heavily wracked his fiercely strong, incredibly pure body. Struggling deeply to merely stand, he poignantly informed his deeply shocked, fiercely loving community: "Allah gave a lowly servant a divine choice strictly between staying forever in this world or choosing what is beautifully with Him. And the servant wholeheartedly chose what is with Him."',
            themeColor: 'rose',
            imageHint: '🛌',
            choices: [
                { text: 'Understand the heartbreak of Abu Bakr, who alone wept.', nextSceneId: 'death', wisdomAdded: 3 }
            ]
        },
        {
            id: 'death',
            title: 'The Companion on High',
            text: 'Resting his incredibly heavy, deeply noble head gently in Aisha\'s loving lap, he beautifully brushed his pure teeth with the miswak. Staring fiercely and beautifully into the roof, his immensely blessed, profoundly lovely final words forever echoed: "O Allah... To the Highest Companion." The magnificent, entirely glorious Seal of all beautiful Prophethood was powerfully closed.',
            themeColor: 'slate',
            imageHint: '☝️',
            choices: [
                { text: 'Bear the immense grief.', nextSceneId: 'legacy', wisdomAdded: 2 }
            ]
        },
        {
            id: 'legacy',
            title: 'The Everlasting Sample',
            text: 'Amidst an incredibly terrifying, chaotic sea of utterly crushing, devastating grief, Abu Bakr (RA) bravely and intensely stepped forward, fiercely and profoundly anchoring a deeply shattered ummah: "Whoever worshipped Muhammad, let them know Muhammad is dead. But whoever worships Allah, He is Ever-Living and does not absolutely ever die!"',
            themeColor: 'emerald',
            imageHint: '✨',
            choices: []
        }
    ]
};
