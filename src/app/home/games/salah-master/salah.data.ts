import { Prayer, SalahStep } from './salah.model';

const WUDU_STEPS: SalahStep[] = [
    {
        id: 'w-1',
        posture: 'intent',
        name: 'Niyyah (Intention)',
        instruction: 'Have a sincere intention in your heart to perform Wudu for Allah.',
        imageHint: '/images/salah/wudu_intention.png'
    },
    {
        id: 'w-2',
        posture: 'wudu-step',
        name: 'Bismillah',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        translation: 'In the name of Allah',
        instruction: 'Say Bismillah before starting.',
        imageHint: '/images/salah/wudu.png'
    },
    {
        id: 'w-3',
        posture: 'wudu-step',
        name: 'Hands',
        instruction: 'Wash your hands up to the wrists three times, ensuring water reaches between fingers.',
        imageHint: '/images/salah/wudu_hands.png' // Start washing hands with Bismillah
    },
    {
        id: 'w-4',
        posture: 'wudu-step',
        name: 'Mouth',
        instruction: 'Rinse your mouth three times, swirling the water thoroughly.',
        imageHint: '/images/salah/wudu_mouth.png'
    },
    {
        id: 'w-5',
        posture: 'wudu-step',
        name: 'Nose',
        instruction: 'Sniff water into your nostrils and blow it out three times.',
        imageHint: '/images/salah/wudu_nose.png'
    },
    {
        id: 'w-6',
        posture: 'wudu-step',
        name: 'Face',
        instruction: 'Wash your entire face three times, from hairline to chin and ear to ear.',
        imageHint: '/images/salah/wudu_face.png'
    },
    {
        id: 'w-7',
        posture: 'wudu-step',
        name: 'Arms',
        instruction: 'Wash your right arm up to and including the elbow three times, then the left arm.',
        imageHint: '/images/salah/wudu_arms.png'
    },
    {
        id: 'w-8',
        posture: 'wudu-step',
        name: 'Head (Masah)',
        instruction: 'Wipe your wet hands over your head once, from front to back and back to front.',
        imageHint: '/images/salah/wudu_head.png'
    },
    {
        id: 'w-9',
        posture: 'wudu-step',
        name: 'Ears',
        instruction: 'Use your index fingers to wipe the inside of your ears and thumbs for the back.',
        imageHint: '/images/salah/wudu_ears.png'
    },
    {
        id: 'w-10',
        posture: 'wudu-step',
        name: 'Feet',
        instruction: 'Wash your right foot including ankles three times, then the left foot. Wash between toes.',
        imageHint: '/images/salah/wudu_feet.png'
    }
];

const COMMON_SALAH_STEPS = {
    takbir: {
        id: 's-1',
        posture: 'standing',
        name: 'Takbiratul Ihram',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest',
        instruction: 'Raise hands to ears/shoulders and start the prayer.',
        imageHint: '/images/salah/standing.png'
    } as SalahStep,
    qiyam: {
        id: 's-2',
        posture: 'standing',
        name: 'Qiyam (Sana & Fatiha)',
        instruction: 'Fold hands and recite Sana, followed by Surah Al-Fatiha and a small portion of Quran.',
        imageHint: '/images/salah/standing.png'
    } as SalahStep,
    ruku: {
        id: 's-3',
        posture: 'bowing',
        name: 'Ruku (Bowing)',
        arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
        transliteration: 'Subhana Rabbiyal Azeem',
        translation: 'Glory be to my Lord, the Almighty',
        instruction: 'Bow down with a straight back, hands on knees. Recite 3 times.',
        imageHint: '/images/salah/bowing.png'
    } as SalahStep,
    jalsah: {
        id: 's-4',
        posture: 'standing',
        name: 'Qawmah (Standing Up)',
        arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ / رَبَّنَا لَكَ الْحَمْدُ',
        transliteration: 'Sami Allahu liman hamidah / Rabbana lakal hamd',
        translation: 'Allah hears those who praise Him / Our Lord, to You be the praise',
        instruction: 'Stand up straight from bowing.',
        imageHint: '/images/salah/standing.png'
    } as SalahStep,
    sujud: {
        id: 's-5',
        posture: 'prostrating',
        name: 'Sujud (Prostration)',
        arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
        transliteration: 'Subhana Rabbiyal A\'la',
        translation: 'Glory be to my Lord, the Most High',
        instruction: 'Place forehead, nose, palms, knees, and toes on the ground. Recite 3 times.',
        imageHint: '/images/salah/prostrating.png'
    } as SalahStep,
    sitting: {
        id: 's-6',
        posture: 'sitting',
        name: 'Jalsah (Sitting)',
        arabic: 'رَبِّ اغْفِرْ لِي',
        transliteration: 'Rabbighfir li',
        translation: 'O my Lord, forgive me',
        instruction: 'Sit between the two prostrations.',
        imageHint: '/images/salah/sitting.png'
    } as SalahStep,
    tashahhud: {
        id: 's-7',
        posture: 'sitting',
        name: 'Tashahhud',
        instruction: 'Recite At-Tahiyyat, followed by Durood Ibrahim in the final sitting.',
        imageHint: '/images/salah/sitting.png'
    } as SalahStep,
    taslim: {
        id: 's-8',
        posture: 'sitting',
        name: 'Taslim (Ending)',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
        transliteration: 'Assalamu Alaikum wa Rahmatullah',
        translation: 'Peace and blessings of Allah be upon you',
        instruction: 'Turn your head to the right, then to the left.',
        imageHint: '/images/salah/sitting.png'
    } as SalahStep
};

export const PRAYERS: Prayer[] = [
    {
        id: 'wudu',
        name: 'Perform Wudu',
        type: 'wudu',
        description: 'The ritual purification before prayer.',
        icon: '🌊',
        themeColor: 'cyan',
        steps: WUDU_STEPS
    },
    {
        id: 'fajr',
        name: 'Fajr',
        type: 'fard',
        rakats: 2,
        description: 'The dawn prayer.',
        icon: '🌅',
        themeColor: 'indigo',
        steps: [
            COMMON_SALAH_STEPS.takbir,
            COMMON_SALAH_STEPS.qiyam,
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.jalsah,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.sitting,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, id: 's-2-2', name: '2nd Rakat Qiyam' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.jalsah,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.sitting,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.tashahhud,
            COMMON_SALAH_STEPS.taslim
        ]
    },
    {
        id: 'dhuhr',
        name: 'Dhuhr',
        type: 'fard',
        rakats: 4,
        description: 'The noon prayer.',
        icon: '☀️',
        themeColor: 'cyan',
        steps: [
            COMMON_SALAH_STEPS.takbir,
            { ...COMMON_SALAH_STEPS.qiyam, name: '1st Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '2nd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.tashahhud, name: 'First Tashahhud' },
            { ...COMMON_SALAH_STEPS.qiyam, name: '3rd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '4th Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.tashahhud,
            COMMON_SALAH_STEPS.taslim
        ]
    },
    {
        id: 'asr',
        name: 'Asr',
        type: 'fard',
        rakats: 4,
        description: 'The afternoon prayer.',
        icon: '🌥️',
        themeColor: 'orange',
        steps: [
            COMMON_SALAH_STEPS.takbir,
            { ...COMMON_SALAH_STEPS.qiyam, name: '1st Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '2nd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.tashahhud, name: 'First Tashahhud' },
            { ...COMMON_SALAH_STEPS.qiyam, name: '3rd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '4th Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.tashahhud,
            COMMON_SALAH_STEPS.taslim
        ]
    },
    {
        id: 'maghrib',
        name: 'Maghrib',
        type: 'fard',
        rakats: 3,
        description: 'The sunset prayer.',
        icon: '🌆',
        themeColor: 'indigo',
        steps: [
            COMMON_SALAH_STEPS.takbir,
            { ...COMMON_SALAH_STEPS.qiyam, name: '1st Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '2nd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.tashahhud, name: 'First Tashahhud' },
            { ...COMMON_SALAH_STEPS.qiyam, name: '3rd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.tashahhud,
            COMMON_SALAH_STEPS.taslim
        ]
    },
    {
        id: 'isha',
        name: 'Isha',
        type: 'fard',
        rakats: 4,
        description: 'The night prayer.',
        icon: '🌙',
        themeColor: 'emerald',
        steps: [
            COMMON_SALAH_STEPS.takbir,
            { ...COMMON_SALAH_STEPS.qiyam, name: '1st Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '2nd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.tashahhud, name: 'First Tashahhud' },
            { ...COMMON_SALAH_STEPS.qiyam, name: '3rd Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            { ...COMMON_SALAH_STEPS.qiyam, name: '4th Rakat' },
            COMMON_SALAH_STEPS.ruku,
            COMMON_SALAH_STEPS.sujud,
            COMMON_SALAH_STEPS.tashahhud,
            COMMON_SALAH_STEPS.taslim
        ]
    }
];
