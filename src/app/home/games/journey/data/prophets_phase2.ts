import { Journey } from '../journey.model';

export const PROPHETS_PHASE_2: Journey[] = [
    // HUD (AS)
    {
        id: 'hud',
        prophetName: 'Hud (AS)',
        title: 'The Great Nation of \'Aad',
        description: 'Encounter the terrifyingly strong, towering giants of \'Aad who carved entire cities from solid rock, and witness their inevitable clash with absolute Divine Power.',
        icon: '🌪️',
        themeColor: 'slate',
        scenes: [
            {
                id: 'start',
                title: 'The Giants of the Earth',
                text: 'Centuries after the Great Flood wiped the earth clean, humanity repopulated the valleys of southern Arabia (Yemen). The tribe of \'Aad rose to unparalleled dominance. They were literal giants—men of towering, terrifying physical stature and immense, brute strength. They carved magnificent, colossal palaces straight out of solid mountains and erected massive pillars reaching toward the clouds (Iram of the Pillars). They believed they were invincible gods of the Earth.',
                themeColor: 'slate',
                imageHint: '🏛️',
                choices: [
                    { text: 'Look upon their majestic, unyielding mountain fortresses with deep, respectful awe.', nextSceneId: 'warnings', wisdomAdded: 0, feedback: 'Physical strength is a fleeting illusion. Allah is Al-Qawiyy (The Most Strong) and can shatter mountains in a blink.' },
                    { text: 'Recognize that such supreme physical power should instantly lead them to overwhelming gratitude, not arrogant defiance.', nextSceneId: 'warnings', wisdomAdded: 3 }
                ]
            },
            {
                id: 'warnings',
                title: 'The Voice in the Valley',
                text: 'Drunk on their own power, \'Aad turned away from the worship of Allah and began bowing to hand-carved stone idols. Hud (AS), a noble man chosen from among their own ranks, stood before the colossal crowds. "O my people! Worship Allah! You have no deity other than Him. You are merely forging lies. I do not ask you for any reward; my reward is only with the One who created me. Will you not then use your towering intellects?"',
                themeColor: 'indigo',
                imageHint: '🗣️',
                choices: [
                    { text: 'Mock him relentlessly: "Who is mightier than us in pure strength? We are the undisputed masters of this world!"', nextSceneId: 'drought', wisdomAdded: 0, feedback: 'The classic, intoxicating trap of arrogance. The Creator is infinitely mightier than His creation.' },
                    { text: 'Plead with profound wisdom: "Have you forgotten that He made you successors after the people of Nuh and vastly increased you in stature?"', nextSceneId: 'drought', wisdomAdded: 4, feedback: 'Hud constantly tried to awaken their hearts by reminding them of the catastrophic history they easily forgot.' }
                ]
            },
            {
                id: 'drought',
                title: 'The Dry Skies',
                text: 'Their arrogant mockery only intensified. "You are clearly suffering from madness, Hud. Bring upon us the very punishment you threaten us with, if you are indeed telling the truth!" As a preliminary warning, Allah sealed the heavens for three long, agonizing years. The lush green valleys of \'Aad withered, their massive crops turned to dust, and their mighty wells dried up. Desperation finally set in, choking their arrogant throats.',
                themeColor: 'amber',
                imageHint: '☀️',
                choices: [
                    { text: 'Humbly fall to your knees and beg for the desperately needed rain from the One True God.', nextSceneId: 'cloud', wisdomAdded: 3 },
                    { text: 'Stubbornly march together to your stone idols and frantically pray to the lifeless rocks for a storm.', nextSceneId: 'cloud', wisdomAdded: 0, feedback: 'Blind following (Taqlid) overrides sheer rationality even when staring death straight in the face.' }
                ]
            },
            {
                id: 'cloud',
                title: 'The Black Cloud',
                text: 'One incredibly hot, suffocating day, a massive, dense black cloud appeared aggressively on the horizon, rushing quickly toward their valley. The people of \'Aad erupted in ecstatic joy, pointing at the sky and dancing in the dry riverbeds. "This is a dense cloud bringing us heavy rain!" they shouted in triumph. Hud (AS) looked upon the unnatural, swirling darkness with deep, prophetic dread. "No!" he cried out, "It is the very thing you arrogantly asked to be hastened!"',
                themeColor: 'slate',
                imageHint: '☁️',
                choices: [
                    { text: 'Flee in abject terror, realizing suddenly that this is a catastrophic, apocalyptic storm of pure vengeance.', nextSceneId: 'wind', wisdomAdded: 4, feedback: 'It was a howling wind containing a profoundly painful torment, far beyond any natural storm.' }
                ]
            },
            {
                id: 'wind',
                title: 'The Roaring Destruction',
                text: 'The cloud unleashed a screaming, absolutely terrifying, and freezing barren wind (Sarsar). It roared without a single pause for seven horrific nights and eight devastating days. The wind was so violently powerful it plucked the massive giants of \'Aad clean off the ground like hollow palm trunks, violently smashing them headfirst onto the rocks. It tore right through their "invincible" stone palaces. Only Hud and a small band of weeping believers were miraculously spared.',
                themeColor: 'red',
                imageHint: '🌪️',
                choices: [
                    { text: 'Leave the devastated, hollow ruins of Iram as a terrifying, timeless warning for all future generations.', nextSceneId: 'finish', wisdomAdded: 3 }
                ]
            },
            {
                id: 'finish',
                title: 'The Silenced Valley',
                text: 'When the horrific roaring finally ceased on the eighth day, an eerie, dead silence blanketed the valley. Nothing at all could be seen except the empty, shattered ruins of their once-great dwellings. The giant bodies of \'Aad lay scattered and broken across the sand like discarded, hollow date-palm trunks. The story of Hud (AS) etched the ultimate lesson into the earth: Absolute Power belongs to Allah alone.',
                themeColor: 'orange',
                imageHint: '🏜️',
                choices: []
            }
        ]
    },
    // SALIH (AS)
    {
        id: 'salih',
        prophetName: 'Salih (AS)',
        title: 'The She-Camel of Allah',
        description: 'Journey to Al-Hijr, where the masterful stone-carvers of Thamud demanded an utterly impossible miracle right before their eyes.',
        icon: '🐪',
        themeColor: 'amber',
        scenes: [
            {
                id: 'start',
                title: 'The Successors of \'Aad',
                text: 'Centuries passed, and the tribe of Thamud rose to prominence in Al-Hijr (Madain Salih). Learning from the destruction of \'Aad, they arrogantly believed the problem was simply structural engineering. So, they masterfully carved their luxurious, towering mansions directly into the faces of solid, immovable mountains, believing these fortresses were completely safe from any divine wind or storm. In their wealth, they completely abandoned Tawheed and worshipped lifeless stones.',
                themeColor: 'orange',
                imageHint: '🏛️',
                choices: [
                    { text: 'Admire their masterful architecture as the pinnacle of human security and achievement.', nextSceneId: 'miracle', wisdomAdded: 0, feedback: 'No fortress, no matter how deep inside a mountain, can ever protect someone from the decree of Allah.' },
                    { text: 'Recognize instantly that technological advancement without faith is a hollow, dangerous illusion.', nextSceneId: 'miracle', wisdomAdded: 3 }
                ]
            },
            {
                id: 'miracle',
                title: 'The Impossible Demand',
                text: 'Salih (AS), highly respected for his great wisdom and nobility, began preaching monotheism. The arrogant elite felt deeply threatened. To silence him decisively, they arrogantly gathered around a massive, solid boulder. "If you are truly a Prophet," they challenged with mocking smiles, "Pray to your Lord to bring forth from this solid, unyielding rock a colossal, pregnant she-camel, fully formed, ten months into her pregnancy!"',
                themeColor: 'slate',
                imageHint: '🪨',
                choices: [
                    { text: 'Perform a cleverly disguised magical trick to temporarily fool the doubting elite.', nextSceneId: 'she_camel', wisdomAdded: 0, feedback: 'Prophets never use parlor tricks or magic. Their miracles are absolute, undeniable, reality-altering signs from Allah.' },
                    { text: 'Pray intensely to Allah with absolute, unshakable faith to deliver this incredibly specific sign.', nextSceneId: 'she_camel', wisdomAdded: 4, feedback: 'Only the Creator of the heavens and the earth can birth living, breathing life from cold, dead stone.' }
                ]
            },
            {
                id: 'she_camel',
                title: 'The Miracle Unleashed',
                text: 'The massive boulder began to crack with a profoundly loud, terrifying sound. The stunned crowd watched in absolute silence as a magnificent, impossibly large, ten-month pregnant she-camel emerged smoothly from the solid stone. It was a flawless, living masterpiece. Salih warned them solemnly: "O my people! This is the extremely sacred She-Camel of Allah: an undeniable sign for you. Let her graze freely on Allah\'s earth, and do her absolutely no harm, lest a swift punishment seize you!"',
                themeColor: 'amber',
                imageHint: '🐪',
                choices: [
                    { text: 'Humbly step back, awe-struck by the sheer majesty of this divine, living sign.', nextSceneId: 'water', wisdomAdded: 3 }
                ]
            },
            {
                id: 'water',
                title: 'The Trial of the Well',
                text: 'Salih set a strict divine rule: The magnificent She-Camel would drink all the water from the town\'s well on one specific day, and on the next day, the entire town could drink. Miraculously, on her drinking days, she produced enough incredibly sweet, rich milk to single-handedly feed the entire sprawling city. Yet, the elite leaders grew deeply resentful, viewing this divine schedule as an infuriating infringement on their absolute authority.',
                themeColor: 'blue',
                imageHint: '💧',
                choices: [
                    { text: 'Gratefully and peacefully share the precious water rights, drinking the miraculous, nourishing milk.', nextSceneId: 'plot', wisdomAdded: 3, feedback: 'The common believers joyfully embraced this test, finding immense blessing in their absolute obedience.' },
                    { text: 'Hold secret, angry meetings complaining bitterly about the sheer inconvenience of this massive beast.', nextSceneId: 'plot', wisdomAdded: 0, feedback: 'To be annoyed by a direct, undeniable sign from the Almighty is the very height of spiritual blindness.' }
                ]
            },
            {
                id: 'plot',
                title: 'The Nine Corrupt Men',
                text: 'In the heart of the city lived a gang of nine thoroughly corrupt men who constantly spread mischief. Meeting in secret under the cover of a moonless night, they forged a sinister, cowardly plot to assassinate the sacred She-Camel and rid themselves of Salih\'s annoying restrictions forever. They lay in ambush in a narrow gorge, entirely blinded to the terrifying, catastrophic consequences of their treachery.',
                themeColor: 'red',
                imageHint: '🗡️',
                choices: [
                    { text: 'Violently attack the beloved She-Camel from the shadows and hamstring her legs.', nextSceneId: 'punishment', wisdomAdded: 0, feedback: 'The most miserable wretch among them (Qudar) led the cowardly attack, sealing the tragic doom of the entire nation.' },
                    { text: 'Protect the sacred sign of Allah with your own life against the assassins.', nextSceneId: 'punishment', wisdomAdded: 4, feedback: 'Had they defended her, they would have been saved. But instead, the entire city shockingly cheered the evil deed.' }
                ]
            },
            {
                id: 'punishment',
                title: 'The Three Days',
                text: 'Salih (AS) found the magnificent She-Camel dead in a pool of blood, the entire crowd cheering the assassins. Utterly heartbroken and trembling with righteous anger, he declared the terrifying final decree: "Enjoy yourselves in your comfortable homes for only three days. That is a promise that will never be belied." The countdown to absolute annihilation began. On the first day, their faces turned sickly yellow; on the second, horrifyingly red; on the third, ash-black.',
                themeColor: 'slate',
                imageHint: '⏳',
                choices: [
                    { text: 'Desperately and frantically try to hide deep inside your heavily fortified, carved mountain mansions.', nextSceneId: 'finish', wisdomAdded: 0, feedback: 'There remains absolutely no refuge from the decree of Allah anywhere in the universe.' },
                    { text: 'Flee the doomed city into the desert immediately alongside the grieving Salih and the small band of believers.', nextSceneId: 'finish', wisdomAdded: 5 }
                ]
            },
            {
                id: 'finish',
                title: 'The Scream in the Morning',
                text: 'As the sun rose on the horrifying fourth morning, a single, unbearably loud scream (As-Sayhah) tore down from the heavens, simultaneously met with a violently massive earthquake from below. The sheer, incomprehensible sonic force ruptured their hearts instantly inside their chests. Their "indestructible" mountain fortresses became massive, silent stone tombs, leaving them prostrate strictly on their knees, completely lifeless in their own homes.',
                themeColor: 'indigo',
                imageHint: '🌋',
                choices: []
            }
        ]
    },
    // IBRAHIM (AS)
    {
        id: 'ibrahim',
        prophetName: 'Ibrahim (AS)',
        title: 'The Friend of Allah (Khalilullah)',
        description: 'Follow the epic, lifelong journey of the Patriarch of Monotheism, a young rebel in ancient Babylon who stood entirely alone against the greatest empire on Earth.',
        icon: '🔥',
        themeColor: 'red',
        scenes: [
            {
                id: 'start',
                title: 'The Starry Night',
                text: 'Young Ibrahim grew up in Babylon, an empire completely saturated with astrology and dark idol worship. His own father, Azar, was the renowned chief sculptor of the royal idols. One clear, beautiful night, attempting to awaken his people using sheer, undeniable logic, Ibrahim looked up at a bright star, then the moon, and then the blazing sun. When each set below the horizon, he firmly declared: "I completely turn my face toward the One who created the heavens and the earth. I am not of the polytheists! I love not those things that fade away."',
                themeColor: 'indigo',
                imageHint: '⭐',
                choices: [
                    { text: 'Adopt the trendy, complex astrological beliefs deeply held by the elite of your society.', nextSceneId: 'idols', wisdomAdded: 0, feedback: 'Following the blind masses into darkness, no matter how popular, is never the path to truth.' },
                    { text: 'Use sharp, pristine logic and clear observation to seek out the Ultimate, Unseen Creator.', nextSceneId: 'idols', wisdomAdded: 4, feedback: 'He demonstrated brilliantly that a True God does not set, sleep, disappear, or rely on anything else.' }
                ]
            },
            {
                id: 'idols',
                title: 'The Festival of Silence',
                text: 'The entire massive kingdom left their city for a grand, roaring annual festival. Feigning illness, Ibrahim remained entirely alone in the enormous, silent temple packed with hundreds of beautifully adorned idols. Food was laid lavishly before them. "Will you not eat?" he mocked the deaf statues. "What is the matter with you that you do not speak?" Swinging a massive axe, he systematically smashed every single idol to absolute pieces, leaving only the very largest one intact, carefully hanging the heavy axe around its stone neck.',
                themeColor: 'orange',
                imageHint: '🪓',
                choices: [
                    { text: 'Sneak away quickly under the cover of darkness to desperately avoid brutal execution.', nextSceneId: 'nimrod', wisdomAdded: 0, feedback: 'His incredibly bold goal was to shock them into a sudden, deep realization of their own utter foolishness, not to just commit petty vandalism.' },
                    { text: 'Calmly stand your ground in the center of the ruins, eagerly waiting to deliver the incredibly powerful punchline.', nextSceneId: 'nimrod', wisdomAdded: 5, feedback: '"Ask the biggest one, if it is able to speak!" he boldly challenged the horrified priests when they returned.' }
                ]
            },
            {
                id: 'nimrod',
                title: 'Face to Face with the Tyrant',
                text: 'The furious townspeople dragged him straight before Nimrod, the ruthless, bloodthirsty tyrant king who actively claimed to be a living god. "My Lord is the one who gives life and causes death," Ibrahim declared fearlessly. Nimrod arrogantly sneered, "I too give life and cause death!" and arbitrarily pardoned a condemned prisoner while executing an innocent man. Unfazed by this idiotic display, Ibrahim aggressively delivered the final, crushing blow: "Allah brings up the sun from the east; so bring it up from the west!" Nimrod was entirely dumbfounded, utterly defeated in logic.',
                themeColor: 'red',
                imageHint: '👑',
                choices: [
                    { text: 'Tremble and compromise in front of the absolute, terrifying political power of an empire.', nextSceneId: 'fire', wisdomAdded: 0, feedback: 'A true believer fears absolutely no one but Allah.' },
                    { text: 'Speak the absolute, unvarnished Truth to extreme power without an ounce of hesitation.', nextSceneId: 'fire', wisdomAdded: 4, feedback: 'This immense, towering courage is the defining trait of Khalilullah (The Intimate Friend of Allah).' }
                ]
            },
            {
                id: 'fire',
                title: 'The Great Inferno',
                text: 'Humiliated, furious, and utterly unable to win the argument, the priests and Nimrod violently resorted to brute force. For an entire month, the kingdom gathered an astronomical amount of wood, lighting a fire so terrifyingly massive that birds flying miles overhead were dropping dead from the sheer, intense heat. They bound Ibrahim tightly with thick ropes and had to use a massive catapult just to launch him into the roaring core of the inferno. As he flew helplessly through the blazing air, the Archangel Jibril appeared mid-air, urgently asking, "Do you have any need?"',
                themeColor: 'orange',
                imageHint: '🔥',
                choices: [
                    { text: 'Beg desperately for Jibril\'s immediate supernatural assistance to pull him away from the flames.', nextSceneId: 'hajar', wisdomAdded: 0, feedback: 'While asking angels logic is fine, Ibrahim understood this was the ultimate test of pure Tawakkul.' },
                    { text: 'Reply with perfect, supreme serenity: "From you, no. HasbunAllah wa ni\'mal-Wakeel (Allah is completely sufficient for me, and He is the best Disposer of affairs)."', nextSceneId: 'hajar', wisdomAdded: 8, feedback: 'Because of this absolutely legendary trust, Allah commanded the universe: "O Fire, be coolness and safety upon Ibrahim!"' }
                ]
            },
            {
                id: 'hajar',
                title: 'The Desert Test',
                text: 'Years later, after surviving the fire and migrating to Palestine, Ibrahim (AS) faced a severely agonizing test. Allah commanded him to take his beloved wife Hajar and their infant son Ismail (his firstborn after decades of heartbreaking barrenness) to a completely desolate, scorching, utterly barren valley in Arabia (Makkah). He was commanded to leave them there alone with only a small skin of water and a few meager dates.',
                themeColor: 'amber',
                imageHint: '🏜️',
                choices: [
                    { text: 'Argue bitterly with the Divine command, wondering how a baby could possibly survive the brutal desert.', nextSceneId: 'zamzam', wisdomAdded: 0, feedback: 'Faith is not always visually logical. It is raw obedience when everything else screams no.' },
                    { text: 'Turn away with tears absolutely streaming down your face, trusting fully that Allah will never, ever abandon them.', nextSceneId: 'zamzam', wisdomAdded: 5, feedback: 'Hajar (RA) herself asked, "Did Allah command you to do this?" When he nodded, she boldly replied, "Then He will not neglect us."' }
                ]
            },
            {
                id: 'zamzam',
                title: 'The Spring of Zamzam',
                text: 'As the water completely ran out, the infant Ismail cried terribly from severe dehydration. Hajar (RA) frantically sprinted back and forth exactly seven times between the rocky hills of Safa and Marwa. Suddenly, Jibril miraculously struck the hard desert earth with his heel (or wing), and sweet, pure water fiercely began gushing out! Makkah was miraculously born around this eternal spring, entirely through the desperate running of a profoundly faithful mother.',
                themeColor: 'blue',
                imageHint: '💦',
                choices: [
                    { text: 'Understand that true miracles often occur right after intensely agonizing human effort and deep desperation.', nextSceneId: 'sacrifice', wisdomAdded: 4 }
                ]
            },
            {
                id: 'sacrifice',
                title: 'The Ultimate Dream',
                text: 'When Ismail was old enough to walk and work beside him, Ibrahim had a recurring, terrifyingly clear vision in his sleep: he saw himself actively sacrificing his beloved son. He deeply knew the dreams of Prophets are direct, undeniable revelation. Heartbroken but resolutely obedient, he told his teenage son. Ismail replied with astonishing courage: "O my father! Do precisely as you are commanded. You will find me, if Allah wills, of the steadfast patient ones."',
                themeColor: 'rose',
                imageHint: '🗡️',
                choices: [
                    { text: 'Try to cleverly interpret the dream metaphorically to aggressively avoid the horrific, unimaginable pain.', nextSceneId: 'kaaba', wisdomAdded: 0, feedback: 'This was the ultimate, horrifying test of absolute love. Who did Ibrahim love more? The gift, or the Giver?' },
                    { text: 'Lay the knife firmly against his son\'s neck in a breathtaking display of total, absolute surrender.', nextSceneId: 'kaaba', wisdomAdded: 8, feedback: 'As he pressed down, a Heavy Voice called out: "O Ibrahim! You have fulfilled the vision!" A massive ram from Paradise was instantly substituted. The legendary test was over.' }
                ]
            },
            {
                id: 'kaaba',
                title: 'The House of Allah',
                text: 'Years later, father and son reunited to construct the very first House established for mankind—the Kaaba at the exact site of Zamzam. Lifting the heavy, rough-hewn stones under the scorching sun, they prayed intensely: "Our Lord, accept this from us! Indeed You are the Hearing, the Knowing." As the simple cubic structure rose, Ibrahim was commanded to call all of mankind to perform Hajj to this sacred, ancient house.',
                themeColor: 'slate',
                imageHint: '🕋',
                choices: [
                    { text: 'Doubt that anyone will ever hear his voice from the middle of an utterly empty, barren desert.', nextSceneId: 'finish', wisdomAdded: 0, feedback: 'Allah replied: "Your duty is simply to call; Our duty is to strictly convey the message to the ends of the earth."' },
                    { text: 'Stand atop the mountain and loudly call all of humanity, trusting Allah to carry his voice across time.', nextSceneId: 'finish', wisdomAdded: 5 }
                ]
            },
            {
                id: 'finish',
                title: 'The Father of Prophets',
                text: 'From Ibrahim (AS) sprang the greatest lineage in human history. Through his son Ishaq came Yaqub, Yusuf, Musa, and Isa. Through his son Ismail came the final, ultimate Seal, Muhammad (SAW). For his unparalleled, absolute surrender through fire, exile, and sacrifice, Allah declared him the Khalil (Intimate Friend) and an entire nation unto himself (Ummah). His legacy is the beating heart of Monotheism forever.',
                themeColor: 'primary',
                imageHint: '✨',
                choices: []
            }
        ]
    }
];
