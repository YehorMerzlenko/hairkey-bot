export function generateTimeSlots(start: Date, end: Date, duration: number) {
    const slots = [];
    let currentTime = start;

    while (currentTime < end) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000); // duration in minutes
        if (slotEnd > end) break; // Якщо слот виходить за межі кінцевого часу
        slots.push({
            text: `${currentTime.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })} - ${slotEnd.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`,
            callback_data: JSON.stringify({ start: currentTime, end: slotEnd })
        });
        currentTime = slotEnd;
    }

    return slots;
}