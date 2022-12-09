class AlertsService {

  private onChangedAlertsCallbacks: Function[] = [];
  private doOnChangedAlerts() {
    this.onChangedAlertsCallbacks.forEach(callback => callback(this.alerts));
  }

  public onChangedAlerts(callback: Function) {
    this.onChangedAlertsCallbacks.push(callback);
  }

  private alerts: Alert[] = [];

  public getAlerts(): Alert[] {
    return this.alerts;
  }

  public addAlert(alert: Alert) {
    this.alerts.push(alert);
    if (alert.lifeTimeMs) {
      setTimeout(() => {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
        this.doOnChangedAlerts();
      }, alert.lifeTimeMs);
    }
    this.doOnChangedAlerts();
  }

}

export class Alert {
  public type: 'success'|'info'|'warning'|'error';
  public text: string;
  public lifeTimeMs: number;

  constructor(type: "success" | "info" | "warning" | "error", text: string, lifeTimeMs?: number) {
    this.type = type;
    this.text = text;
    this.lifeTimeMs = lifeTimeMs || 2000;
  }
}

let alertsService = new AlertsService();
export default alertsService;
