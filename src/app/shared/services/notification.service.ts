import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  // Array of 7 different daily messages
  private readonly DAILY_TEXTS = [
    { title: "Day 1", body: "Take a deep breath. Your meditation session is ready." },
    { title: "Day 2", body: "Clear your mind. It's time for yourself." },
    { title: "Day 3", body: "Consistency is key. Let's meditate." },
    { title: "Day 4", body: "Find your center today." },
    { title: "Day 5", body: "A calm mind brings a calm life. Ready?" },
    { title: "Day 6", body: "Step away from the noise. It's meditation time." },
    { title: "Day 7", body: "You're doing great! Keep up the habit." }
  ];

  private readonly INACTIVE_TEXT = { 
    title: "We miss you", 
    body: "It's been a while since your last session. Come back and find your peace." 
  };

    async requestPermissions(): Promise<boolean> {
    let permStatus = await LocalNotifications.checkPermissions();

    if (permStatus.display === 'prompt') {
      permStatus = await LocalNotifications.requestPermissions();
    }

    if (permStatus.display !== 'granted') {
      console.warn('User denied notification permissions');
      return false;
    }

    return true;
  }

  constructor() {}

  async scheduleMeditationReminder(preferredTime: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;
    await this.cancelAllReminders();

    const [hour, minute] = preferredTime.split(':').map(Number);
    const notificationsToSchedule = [];

    // 3. Schedule the next 7 days of unique messages
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      // Calculate the specific date and time for each of the next 7 days
      const scheduledDate = new Date();
      scheduledDate.setDate(now.getDate() + i); // Today + i days
      scheduledDate.setHours(hour, minute, 0, 0);

      // If the time for *today* has already passed, push everything by 1 day
      if (i === 0 && scheduledDate.getTime() <= now.getTime()) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      notificationsToSchedule.push({
        id: i + 1, // IDs 1 through 7
        title: this.DAILY_TEXTS[i].title,
        body: this.DAILY_TEXTS[i].body,
        schedule: { at: scheduledDate, allowWhileIdle: true },
        sound: 'default',
        smallIcon: 'ic_stat_icon_config_sample',
      });
    }

    // 4. Schedule the "Inactive" notification (e.g., 14 days from now)
    const inactiveDate = new Date();
    inactiveDate.setDate(now.getDate() + 14); // 14 days in the future
    inactiveDate.setHours(hour, minute, 0, 0);

    notificationsToSchedule.push({
      id: 99, // Unique ID for the inactive notification
      title: this.INACTIVE_TEXT.title,
      body: this.INACTIVE_TEXT.body,
      schedule: { at: inactiveDate, allowWhileIdle: true },
      sound: 'default',
      smallIcon: 'ic_stat_icon_config_sample',
    });

    // 5. Send the whole batch to the OS
    await LocalNotifications.schedule({
      notifications: notificationsToSchedule
    });

    console.log('Scheduled 7 rolling notifications + 1 inactivity notification.');
  }

  async cancelAllReminders() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }
  }

}
