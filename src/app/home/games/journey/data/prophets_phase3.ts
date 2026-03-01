import { Journey } from '../journey.model';

export const PROPHETS_PHASE_3: Journey[] = [
    // LUT (AS)
    {
        id: 'lut',
        prophetName: 'Lut (AS)',
        title: 'The City of Shadows',
        description: 'Stand as a lone beacon of intense purity amidst a deeply terrifying, utterly depraved society that violently inverted the natural order.',
        icon: '🌆',
        themeColor: 'indigo',
        scenes: [
            {
                id: 'start',
                title: 'The Depraved Towns',
                text: 'A devoted nephew and fierce follower of Ibrahim (AS), Lut was sent to the wicked, sprawling towns surrounding the Dead Sea, primarily Sodom. This society was not merely corrupt; they had maliciously invented horrifying sins that no human being in the history of the world had ever previously conceived. They openly engaged in rampant banditry, deeply violent assaults, and public, shameless homosexuality, completely abandoning the natural, sacred purity created by Allah.',
                themeColor: 'slate',
                imageHint: '🌑',
                choices: [
                    { text: 'Confront their unprecedented, terrifying depravity with absolute, unyielding firmness.', nextSceneId: 'mob', wisdomAdded: 3 },
                    { text: 'Try to mildly integrate to slowly reform them from the inside without angering them.', nextSceneId: 'mob', wisdomAdded: 0, feedback: 'When a disease is spreading virulently in public, radical spiritual surgery is required, not silent integration.' }
                ]
            },
            {
                id: 'mob',
                title: 'The Beautiful Guests',
                text: 'Late one evening, three impossibly handsome, glowing young men arrived at Lut\'s door as guests. They were actually the powerful angels Jibril, Mika\'il, and Israfil in human form, sent directly from the fiery destruction of Nimrod to the impending doom of Sodom. However, Lut\'s own deeply treacherous wife secretly signaled the deeply wicked townsfolk. In minutes, a massive, frenzied, violently aggressive mob surrounded his fragile home, loudly demanding the guests be handed over for their vile desires.',
                themeColor: 'red',
                imageHint: '🚪',
                choices: [
                    { text: 'Barricade the heavy wooden door alone and desperately plead with them using logic: "These are my daughters, they are purer for you."', nextSceneId: 'angels', wisdomAdded: 4, feedback: 'He exhausted every absolute diplomatic and desperate plea to protect his sacred guests, showing incredible honor.' },
                    { text: 'Surrender the mysterious guests to the crazed, violent mob to save your own family.', nextSceneId: 'angels', wisdomAdded: 0, feedback: 'A Prophet\'s sacred honor and fierce protection of a guest in his home is an absolutely unbreakable code.' }
                ]
            },
            {
                id: 'angels',
                title: 'The Blinding Strike',
                text: 'As the screaming mob violently battered against the breaking door, Lut groaned in pure despair: "If only I had the strength to resist you or a strong fortress to retreat into!" At that exact, terrifying moment, Jibril revealed his true, awe-inspiring angelic form. He simply brushed the mob with the absolute tip of his brilliant wing. Instantly, the blinding strike erased their vision completely, turning their screaming faces into smooth, featureless slates. The angels calmly instructed: "O Lut, we are messengers of your Lord. They will never reach you!"',
                themeColor: 'cyan',
                imageHint: '✨',
                choices: [
                    { text: 'Command your family to immediately flee into the dark night without ever turning back to look.', nextSceneId: 'punishment', wisdomAdded: 3 }
                ]
            },
            {
                id: 'punishment',
                title: 'The Raining Brimstone',
                text: 'Under the pitch-black cover of night, Lut and his tiny band of believers slipped out of the doomed city. The strict divine command was absolute: do not look back. Tragically, his treacherous wife, whose heart was deeply tangled with the sinners, slowed down and turned her head back to watch. As dawn broke, a terrifying, massive, roaring earthquake struck. Jibril lifted the entire sprawling city of Sodom on his wing high into the screaming sky, flipped it completely upside down, and slammed it into the earth, followed by a relentless pounding rain of baked, hard brimstone stones.',
                themeColor: 'orange',
                imageHint: '☄️',
                choices: [
                    { text: 'Look intensely forward into the pure dawn light, leaving the horrifying past of the sinners behind forever.', nextSceneId: 'finish', wisdomAdded: 4, feedback: 'Salvation lies strictly in moving forward entirely toward the pleasure and commands of Allah.' }
                ]
            },
            {
                id: 'finish',
                title: 'The Lake of Silence',
                text: 'Where the loud, vicious, deeply arrogant society of Sodom once stood, there arose only a massive, toxically salty, utterly dead body of water—the Dead Sea. The terrifying, completely inverted ruins remain fundamentally buried at the very bottom of the earth\'s lowest elevation. Lut (AS) emerged from the unimaginable horror as a profound symbol of remaining fiercely steadfast and pure when the entire surrounding world plunges into total, violent darkness.',
                themeColor: 'slate',
                imageHint: '🌊',
                choices: []
            }
        ]
    },
    // ISMAIL (AS)
    {
        id: 'ismail',
        prophetName: 'Ismail (AS)',
        title: 'The Ancestor of the Arabs',
        description: 'The first deeply devoted son of Ibrahim, miraculously saved from terrifying thirst by Zamzam, and who established a towering legacy of unimaginable patience and total sacrifice.',
        icon: '🏹',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'The Desolate Valley',
                text: 'Left as an utterly helpless, crying infant with his desperately searching mother Hajar (RA) in the completely barren, scorching valley of Makkah, his miraculous survival became legendary. As his mother ran frantically between Safa and Marwa searching for any dying sign of water, the Archangel Jibril himself violently struck the hard desert floor near the baby\'s tiny, kicking feet. A pure, sweet, endlessly flowing spring of cool water (Zamzam) fiercely erupted up through the dry Arabian sand.',
                themeColor: 'blue',
                imageHint: '💦',
                choices: [
                    { text: 'Marvel at how profound thirst in absolute desolation birthed the single most sacred well in human history.', nextSceneId: 'sacrifice', wisdomAdded: 3 }
                ]
            },
            {
                id: 'sacrifice',
                title: 'The Unimaginable Patience',
                text: 'When he finally reached his strong teenage years, his elderly father Ibrahim (AS) arrived with a terrifyingly heartbreaking vision: "O my beloved son, indeed I have seen a dream that I must sacrifice you." Instead of crying, resisting in terror, or attempting to desperately flee, Ismail displayed a level of complete, serene Tawakkul (Trust in Allah) that would echo eternally. He looked up calmly and replied: "O my father! Do exactly as you are commanded. You will find me, if Allah wills, of the steadfast patient ones."',
                themeColor: 'rose',
                imageHint: '🤲',
                choices: [
                    { text: 'Attempt to brutally fight back or run wildly away from the sharp, terrifying blade.', nextSceneId: 'kaaba', wisdomAdded: 0, feedback: 'He possessed an unbreakable, utterly beautiful submission (Islam) to whatever Allah decreed.' },
                    { text: 'Bow your head completely in perfect, serene submission, knowing the eternal reward is far greater.', nextSceneId: 'kaaba', wisdomAdded: 5, feedback: 'For this staggering, breathtaking act of sheer obedience, a massive heavenly ram was miraculously substituted by Allah.' }
                ]
            },
            {
                id: 'kaaba',
                title: 'Raising the Foundations',
                text: 'Years later, the devoted father and loving son reunited in Makkah for a monumentally sacred, immense task. Together, sweating under the harsh desert sun, they passionately built the magnificent Kaaba. Ismail would diligently haul the heavy, unhewn stones while Ibrahim meticulously laid the solid foundational courses. As they built the walls higher, they intensely prayed in unison: "Our Lord, aggressively accept this profound effort from us! Indeed, You are the eternally Hearing, the infinitely Knowing."',
                themeColor: 'slate',
                imageHint: '🕋',
                choices: [
                    { text: 'Understand that true, lasting greatness only comes firmly through incredibly hard work mixed deeply with sincere, focused prayer.', nextSceneId: 'finish', wisdomAdded: 4 }
                ]
            },
            {
                id: 'finish',
                title: 'The Noble Lineage',
                text: 'He settled permanently among the fierce Jurhum tribe, expertly learning pure Arabic, brilliantly mastering archery, and becoming a profoundly wise Prophet specifically for the sprawling tribes of Arabia. Through his direct, unbroken bloodline, many centuries later, the shining, absolute final Seal of all Prophets—Muhammad (SAW)—would miraculously emerge from the heart of Makkah.',
                themeColor: 'gold',
                imageHint: '✨',
                choices: []
            }
        ]
    },
    // ISHAQ (AS)
    {
        id: 'ishaq',
        prophetName: 'Ishaq (AS)',
        title: 'The Miraculous Son',
        description: 'Born to deeply elderly parents entirely against all natural logic, he became a profound foundational patriarch directly establishing the mighty Children of Israel.',
        icon: '🌟',
        themeColor: 'gold',
        scenes: [
            {
                id: 'start',
                title: 'The Unexpected Glad Tidings',
                text: 'Ibrahim (AS) and his fiercely faithful wife Sarah (RA) had grown incredibly old, reaching their nineties without any children together. One quiet afternoon, majestic angels suddenly appeared in human form at their tent. After intensely delivering the terrifying impending doom regarding Lut\'s city (Sodom), they unexpectedly brought shocking, joyous news. Peeling back the heavy curtain, they announced absolutely clearly: "Sarah, you shall miraculously give birth to a son named Ishaq, and after Ishaq, a deeply blessed grandson named Yaqub!"',
                themeColor: 'amber',
                imageHint: '👶',
                choices: [
                    { text: 'Laugh in utter, bewildered astonishment: "Shall I truly bear a bouncing child while I am an extremely old woman and my husband is deeply old?"', nextSceneId: 'promise', wisdomAdded: 0, feedback: 'The angels sternly reminded her: "Are you amazed at the sheer decree of Allah? The immense mercy and blessings of Allah are firmly upon you!"' },
                    { text: 'Immediately prostrate entirely on the floor in overwhelming, intensely tearful gratitude to the Absolute Master of the impossible.', nextSceneId: 'promise', wisdomAdded: 4, feedback: 'Allah is completely capable of seamlessly breaking the "solid rules" of nature whenever He profoundly wills.' }
                ]
            },
            {
                id: 'promise',
                title: 'The Blessed Covenant',
                text: 'Ishaq grew up completely enveloped in an intensely powerful atmosphere of deep, unwavering faith, passionately learning from his towering, legendary father in Palestine. Unlike his fierce desert-dwelling brother Ismail in Makkah, Ishaq beautifully established his deep Prophethood firmly in the immensely fertile, lush land of Canaan. He powerfully secured the incredibly strong, vital foundation of a mighty, profoundly blessed prophetic line deeply anchored in continuous devotion.',
                themeColor: 'green',
                imageHint: '🌿',
                choices: [
                    { text: 'Carry forward the absolutely massive, heavy spiritual torch of pure Monotheism to all your descendants.', nextSceneId: 'finish', wisdomAdded: 3 }
                ]
            },
            {
                id: 'finish',
                title: 'The Father of Bani Israel',
                text: 'From the direct, blessed lineage of Ishaq (AS) came Yaqub (also famously named Israel). From Yaqub sprang the immense twelve tribes, and from them descended a staggering, uncountable number of mighty Prophets: including Yusuf, Musa, Dawud, Sulayman, and Isa (AS). His miraculous, logic-defying birth was the profound spark for centuries of intense divine revelation specifically in the Holy Land.',
                themeColor: 'primary',
                imageHint: '📜',
                choices: []
            }
        ]
    },
    // YUSUF (AS)
    {
        id: 'yusuf',
        prophetName: 'Yusuf (AS)',
        title: 'The Most Beautiful Story',
        description: 'Navigate the stunning, intensely emotional epic of fierce betrayal, dark slavery, false accusation, years in a deep dungeon, and an absolute, astonishing rise to ultimate royal power and breathtaking forgiveness.',
        icon: '🌙',
        themeColor: 'emerald',
        scenes: [
            {
                id: 'start',
                title: 'The Heavenly Dream',
                text: 'As an incredibly handsome, deeply beloved young boy in Canaan, Yusuf rushed specifically to his ancient father Yaqub (AS) with a stunning, vivid dream: "O my father! I saw eleven bright stars, the brilliant sun, and the glowing moon all prostrating deeply to me!" Recognizing clearly the profound, heavy Prophetic destiny ahead, Yaqub held him tightly and fiercely warned: "Do not relate this vivid vision to your jealous brothers, lest they deeply scheme a terrible plot against you."',
                themeColor: 'indigo',
                imageHint: '✨',
                choices: [
                    { text: 'Naively boast loudly about this amazing dream to all eleven of your deeply resentful older brothers.', nextSceneId: 'well', wisdomAdded: 0, feedback: 'His father urgently sensed the highly dangerous, creeping toxicity of their jealousy fueled directly by Satan.' },
                    { text: 'Keep the profound secret locked tightly away, entirely trusting your ancient, incredibly wise father\'s warning.', nextSceneId: 'well', wisdomAdded: 3, feedback: 'Protecting blessings from harmful, jealous eyes is a profound, necessary prophetic wisdom.' }
                ]
            },
            {
                id: 'well',
                title: 'The Betrayal of Brothers',
                text: 'Driven to complete madness by Satan\'s whispering and intensely fiery, toxic jealousy over their father\'s vast love for him, the older brothers hatched an evil, deeply cowardly plot. Under the clever guise of taking him to aggressively play securely outside, they violently seized the terrified young boy. Ripping off his beloved colorful shirt, they ruthlessly threw him screaming down into the suffocating darkness of a deep, dry well. They brutally smeared his beautiful shirt with fake wolf\'s blood and returned weeping heavily with a completely fabricated, tragic lie.',
                themeColor: 'slate',
                imageHint: '🕳️',
                choices: [
                    { text: 'Scream endlessly in pure, absolute terror while trapped completely alone in the freezing, pitch-black waterless pit.', nextSceneId: 'slavery', wisdomAdded: 0, feedback: 'Allah instantly inspired his terrified heart: "You will certainly inform them of this horrific deed one day while they do not perceive!"' },
                    { text: 'Hold firmly onto deep, quiet hope in the terrifying dark, absolutely trusting that Allah is always watching from above.', nextSceneId: 'slavery', wisdomAdded: 4, feedback: 'As his father Yaqub responded deeply to the blatant lie: "Beautiful, incredibly beautiful patience (Sabrun Jameel) is what I must seek."' }
                ]
            },
            {
                id: 'slavery',
                title: 'Sold for a Few Dirhams',
                text: 'A wandering, heavily burdened caravan passing nearby dropped an old wooden bucket deep into the well looking for water. Instead of water, they furiously yanked up a stunning, incredibly beautiful young boy. But rather than saving him freely, they callously concealed him maliciously as mere merchandise. In the massive, bustling slave markets of Egypt, he was coldly and cruelly auctioned off for a few paltry, miserable silver coins to the vastly powerful Al-Aziz (Chief Minister) of Egypt.',
                themeColor: 'amber',
                imageHint: '🐪',
                choices: [
                    { text: 'Fall into utter, deeply crushing despair over intensely losing your profound freedom, royal family, and beautiful homeland.', nextSceneId: 'temptation', wisdomAdded: 0, feedback: 'Prophets never lose complete, pure hope. Allah was perfectly, seamlessly arranging his incredibly steep, astonishing rise.' },
                    { text: 'Work incredibly hard as a loyal, intensely dignified servant, trusting entirely that Allah firmly controls all destiny.', nextSceneId: 'temptation', wisdomAdded: 3, feedback: 'Because of his pure, spotless excellence (Ihsan), Allah actively gave him a deeply honored, majestic place in the palace.' }
                ]
            },
            {
                id: 'temptation',
                title: 'The Locked Doors',
                text: 'As Yusuf grew rapidly into a strikingly handsome, powerfully built young man, the exceedingly wealthy, intensely lonely wife of Al-Aziz (Zuleikha) became obsessively infatuated with him. One quiet day, she locked every single heavy, solid door in the vast palace tightly. In her incredibly explicit, demanding seduction, she whispered forcefully: "Come to me!" It was the ultimate, terrifyingly intense test of purity: a young, single man, far from home, facing intensely forceful pressure from a highly powerful, elite woman.',
                themeColor: 'rose',
                imageHint: '🚪',
                choices: [
                    { text: 'Yield slightly to the absolutely massive, terrifying pressure out of strict fear of her immense political power.', nextSceneId: 'prison', wisdomAdded: 0, feedback: 'A heart heavily saturated completely with pure Tawheed firmly rejects all overwhelming temptation, no matter the massive cost.' },
                    { text: 'Scream intensely: "I seek immense refuge in Allah!" and urgently sprint desperately for the locked, heavy doors.', nextSceneId: 'prison', wisdomAdded: 6, feedback: 'As she violently grabbed forcefully at him, she viciously tore his shirt directly from the back—the absolute, definitive proof of his complete innocence.' }
                ]
            },
            {
                id: 'prison',
                title: 'The Dark Dungeon',
                text: 'Despite the torn shirt conclusively proving his complete innocence, the intensely embarrassed aristocratic elite opted for a massive, corrupt cover-up. Yusuf clearly realized that remaining intensely pure outside in this highly toxic society was vastly harder than being imprisoned. He prayed deeply: "My Lord! Deep prison is much dearer to me than that which they aggressively invite me strictly to!" He was unjustly dumped into a rotting, extremely dark, and completely forgotten Egyptian dungeon.',
                themeColor: 'slate',
                imageHint: '⛓️',
                choices: [
                    { text: 'Become fiercely bitter, overwhelmingly angry, and deeply resentful against God for punishing your sheer innocence.', nextSceneId: 'king', wisdomAdded: 0, feedback: 'He never complained even once. Instead, he constantly called his fellow hopeless inmates to the profound beauty of Tawheed.' },
                    { text: 'Transform the incredibly dark, miserable dungeon into a brilliant, glowing mosque, eagerly aggressively spreading intense hope and pure faith.', nextSceneId: 'king', wisdomAdded: 5, feedback: 'His flawless character (Ihsan) caused even his fellow hardened, brutal prisoners to intensely love and deeply rely on him.' }
                ]
            },
            {
                id: 'king',
                title: 'Seven Fat Cows',
                text: 'After several grueling, deeply silent years forgotten in utter darkness, the King of Egypt woke up screaming from a terrifying, incredibly vivid nightmare: Seven extremely scrawny, sickly cows were viciously devouring seven massive, extremely fat cows, and seven totally dry, dead ears of corn were swiftly wrapping around seven brilliantly green ones. All the elite priests and incredibly wise men completely failed to interpret it. The King\'s cupbearer suddenly aggressively remembered the purely flawless, brilliant dream interpreter deeply forgotten in the cold dungeon.',
                themeColor: 'emerald',
                imageHint: '🐄',
                choices: [
                    { text: 'Refuse stubbornly to interpret it unless they completely clear your falsely ruined name entirely first.', nextSceneId: 'power', wisdomAdded: 0, feedback: 'He possessed absolutely no pettiness. He immediately and aggressively gave the crucial, life-saving advice to save the entire nation.' },
                    { text: 'Brilliantly and urgently dictate the entire profound vision: Seven incredibly lush years of massive plenty, furiously followed squarely by seven devastating, brutally harsh, absolutely deadly years of intense global famine.', nextSceneId: 'power', wisdomAdded: 4 }
                ]
            },
            {
                id: 'power',
                title: 'The Treasures of the Earth',
                text: 'Profoundly stunned by Yusuf\'s sheer, immense wisdom, absolute deep purity, and incredibly perfect, flawless character, the King ordered him dramatically brought out. His complete innocence was finally established entirely in public. Earning the King\'s absolute, towering trust, Yusuf confidently requested: "Appoint me directly over all the massive storehouses of the land. Indeed, I will be a deeply knowing guardian." He was suddenly elevated instantly from a miserable, locked dungeon slave to the absolute, supreme Treasurer of the entire, highly powerful Egyptian Empire.',
                themeColor: 'gold',
                imageHint: '👑',
                choices: [
                    { text: 'Immediately and ruthlessly exact intensely brutal revenge against all those arrogant elites who falsely imprisoned you.', nextSceneId: 'brothers', wisdomAdded: 0, feedback: 'A Prophet fiercely wields incredibly massive power solely to aggressively establish true justice and deep mercy, never petty revenge.' },
                    { text: 'Intensely implement a brilliant, staggeringly massive, perfectly honest agricultural rationing system to fiercely save thousands from certain starvation.', nextSceneId: 'brothers', wisdomAdded: 5 }
                ]
            },
            {
                id: 'brothers',
                title: 'The Stunning Reunion',
                text: 'The severe global famine eventually forcefully pushed his desperate, hungry older brothers from Canaan straight into Egypt aggressively seeking vital grain. They came desperately begging right before him, deeply bowing low. He recognized them perfectly instantly; they had absolutely no idea they were intensely staring directly at the powerful, terrifying royal brother they had viciously thrown into a dark, dry well decades ago.',
                themeColor: 'primary',
                imageHint: '🌾',
                choices: [
                    { text: 'Immediately reveal who you actually are and viciously torture them endlessly for their cruel, deep betrayal.', nextSceneId: 'forgiveness', wisdomAdded: 0, feedback: 'He masterfully engineered a brilliant, highly complex series of psychological tests to carefully bring them to true, intense repentance first.' },
                    { text: 'Test their highly corrupted hearts cleverly: deeply plant a royal cup firmly in his beloved full-brother Benjamin\'s heavy saddlebag to forcefully keep him closely nearby.', nextSceneId: 'forgiveness', wisdomAdded: 4, feedback: 'This brilliantly squeezed them to their absolute breaking point, painfully cracking open their hard hearts to intense regret.' }
                ]
            },
            {
                id: 'forgiveness',
                title: 'No Blame Today',
                text: 'When the brothers finally, deeply broke down in sheer, desperate tears, Yusuf famously pulled back all the curtains: "Do you know what you did fiercely to Yusuf?" They violently staggered back in absolute, crushing shock, staring into his extremely familiar, beautiful face. Now armed with the absolute, unstoppable, terrifying power to quickly have them all executed on the spot, Yusuf completely lowered his head and delivered history\'s greatest, most breathtaking statement of pure forgiveness.',
                themeColor: 'rose',
                imageHint: '❤️',
                choices: [
                    { text: 'Declare fiercely and loudly: "No blame will there be entirely upon you this day. May Allah deeply forgive you, and He is the most merciful of the merciful!"', nextSceneId: 'reunion', wisdomAdded: 10, feedback: 'This was an absolutely staggering, monumental mountain-peak of pure human Ihsan and incredibly profound Prophetic mercy.' }
                ]
            },
            {
                id: 'reunion',
                title: 'The Dream Fulfilled',
                text: 'He urgently instructed them to cast his incredibly fragrant, iconic shirt entirely over his fiercely mourning, entirely blinded father\'s ancient face back in Canaan, miraculously restoring his sight perfectly. Yaqub brought the entire, massive family deeply into highly prosperous Egypt. As the whole family collectively bowed deeply down to him in severe gratitude and honor, Yusuf intensely raised his tearful eyes: "O my beloved father! This is the absolute, perfect fulfillment of that ancient, starry vision!"',
                themeColor: 'emerald',
                imageHint: '✨',
                choices: []
            }
        ]
    }
];
