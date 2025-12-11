const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const environment = {
    production: false,
    github: {
        pdfUri: 'raw.githubusercontent.com/ezazulhaq/library/master/taqwa_tracker',
    },
    api: {
        map: `https://nominatim.openstreetmap.org/reverse`
    },
    supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey
    },
    apiBaseUrl: 'https://api.thetaqwatracker.com'
};