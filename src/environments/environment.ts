const s3Bucket = import.meta.env.NG_APP_S3_BUCKET
const openStreetUrl = import.meta.env.NG_APP_OPEN_STREET_URL;

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const environment = {
    production: false,
    s3Bucket: s3Bucket,
    github: {
        pdfUri: 'raw.githubusercontent.com/ezazulhaq/library/master/taqwa_tracker',
    },
    api: {
        map: openStreetUrl
    },
    supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey
    }
};