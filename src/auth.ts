import {readFileSync} from 'fs';
import { JWT } from 'google-auth-library';
import {resolve} from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentialsPath = resolve(__dirname, '../credentials.json');
const value = readFileSync(credentialsPath, 'utf-8');
const credentials = JSON.parse(value);

export const GoogleAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar']});