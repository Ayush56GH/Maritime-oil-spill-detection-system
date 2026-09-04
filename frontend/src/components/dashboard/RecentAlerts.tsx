import React from 'react';
import { AlertTriangle, BellOff } from 'lucide-react';
import { AlertItem } from '@/data/mock/mockAlerts';

interface RecentAlertsProps {
  alerts: AlertItem[];
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <section>
      <div className="panel-section-title">
        <span>Recent Alerts (5)</span>
      </div>
      <div>
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          return (
            <div
              key={alert.id}
              className={`alert-card-item ${isCritical ? 'critical' : 'warning'}`}
            >
              <div className="alert-card-header">
                <div className={`alert-type-label ${isCritical ? 'critical' : 'warning'}`}>
                  {isCritical ? <AlertTriangle size={13} /> : <BellOff size={13} />}
                  <span>{isCritical ? 'High Priority' : 'Medium'}</span>
                </div>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
              <div className="alert-card-title">{alert.title}</div>
              {alert.coordinates && (
                <div className="alert-card-coords">Coord: {alert.coordinates}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
