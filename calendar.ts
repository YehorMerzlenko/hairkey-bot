import {calendar_v3} from '@googleapis/calendar';
import { GoogleAuth } from './auth';

export const GoogleCalendar = new calendar_v3.Calendar({auth: GoogleAuth});