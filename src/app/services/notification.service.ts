import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  
  async clearAll() {
    await LocalNotifications.cancel({ notifications: [] });
  }

  async requestPermission() {
  const result = await LocalNotifications.requestPermissions();
  if (result.display === 'granted') {
    console.log('Permission granted');
  } else {
    console.log('Permission denied');
  }
}

}
