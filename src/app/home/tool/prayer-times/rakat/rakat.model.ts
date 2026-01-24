export interface Rakats {
    name: string;
    before_fard: {
        sunnah: number;
    };
    fard: number;
    after_fard: {
        sunnah: number | string; // "4+2" for Jummah
        nafl: number | string; // Can be a range like "2-11" for Tahajjud
        wajib: number;
    };
}