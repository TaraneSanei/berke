import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

constructor() {
    this.initListeners();
  }

  private initListeners() {
    // This runs as soon as the Crisp script loads
    (window as any).$crisp.push(["on", "session:loaded", () => {
      this.hide(); // Hide it immediately on load
    }]);

    // THE MAGIC: When the user closes the panel, hide the bubble again instantly
    (window as any).$crisp.push(["on", "chat:closed", () => {
      this.hide();
    }]);
  }

  public hide() {
    (window as any).$crisp.push(["do", "chat:hide"]);
  }
public open() {
    (window as any).$crisp.push(["do", "chat:show"]);
    (window as any).$crisp.push(["do", "chat:open"]);
  }
}
