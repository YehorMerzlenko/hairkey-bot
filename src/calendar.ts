import { calendar_v3 } from '@googleapis/calendar';
import { GoogleAuth } from './auth';

export const GoogleCalendar = new calendar_v3.Calendar({ auth: GoogleAuth });

export async function listEvents(calendarId: string) {
    try {
        const res = await GoogleCalendar.events.list({
            calendarId,
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const timeSlots = res.data.items?.filter(event => event.summary?.includes("Стрижка")) || [];
        return timeSlots;
    } catch (error) {
        console.error('Error listing events:', error);
        throw error;
    }
}