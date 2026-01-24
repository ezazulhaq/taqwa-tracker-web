import { Rakats } from "./rakat.model";

export const rakats: Rakats[] = [
    {
        name: "tahajjud",
        before_fard: {
            sunnah: 0
        },
        fard: 0, // Tahajjud is voluntary (nafl), no fard component
        after_fard: {
            sunnah: 0,
            nafl: "2-11", // Minimum 2, commonly 8-11 rakats in sets of 2
            wajib: 0
        }
    },
    {
        name: "fajr",
        before_fard: {
            sunnah: 2
        },
        fard: 2,
        after_fard: {
            sunnah: 0,
            nafl: 0,
            wajib: 0
        }
    },
    {
        name: "dhuhr",
        before_fard: {
            sunnah: 4
        },
        fard: 4,
        after_fard: {
            sunnah: 2,
            nafl: 2,
            wajib: 0
        }
    },
    {
        name: "jummah",
        before_fard: {
            sunnah: 4
        },
        fard: 2,
        after_fard: {
            sunnah: '4+2',
            nafl: 2,
            wajib: 0
        }
    },
    {
        name: "asr",
        before_fard: {
            sunnah: 4
        },
        fard: 4,
        after_fard: {
            sunnah: 0,
            nafl: 0,
            wajib: 0
        }
    },
    {
        name: "maghrib",
        before_fard: {
            sunnah: 0
        },
        fard: 3,
        after_fard: {
            sunnah: 2,
            nafl: 2,
            wajib: 0
        }
    },
    {
        name: "isha",
        before_fard: {
            sunnah: 4
        },
        fard: 4,
        after_fard: {
            sunnah: 2,
            nafl: 2,
            wajib: 3
        }
    },
    {
        name: "jumuah",
        before_fard: {
            sunnah: 4
        },
        fard: 2,
        after_fard: {
            sunnah: "4+2",
            nafl: 2,
            wajib: 0
        }
    }
];