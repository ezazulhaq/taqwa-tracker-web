import { Tasbih } from "../../../model/tasbih.model";

export const tasbihs: Tasbih[] = [
    {
        id: '1',
        name: 'Subhan Allah',
        count: 0,
        targetCount: 33,
        arabicText: 'سُبْحَانَ ٱللَّٰهِ',
        transliteration: 'Subhan Allah',
        translation: 'Glory be to Allah',
        category: 'daily'
    },
    {
        id: '2',
        name: 'Alhamdulillah',
        count: 0,
        targetCount: 33,
        arabicText: 'ٱلْحَمْدُ لِلَّٰهِ',
        transliteration: 'Alhamdulillah',
        translation: 'Praise be to Allah',
        category: 'daily'
    },
    {
        id: '3',
        name: 'Allahu Akbar',
        count: 0,
        targetCount: 34,
        arabicText: 'اللَّٰهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest',
        category: 'daily'
    }
];