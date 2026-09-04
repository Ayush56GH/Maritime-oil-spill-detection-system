'use client';
import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';

interface TopbarProps {
  searchPlaceholder?: string;
  filters?: React.ReactNode;
}

export default function Topbar({
  searchPlaceholder = 'Search vessels, regions, or alerts...',
  filters,
}: TopbarProps) {
  return (
    <header className="dashboard-topbar">
      {/* Search Input & Contextual Filters */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '1rem', maxWidth: '820px' }}>
        <div className="topbar-search-container">
          <Search className="topbar-search-icon" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="topbar-search-input"
          />
        </div>

        {filters && <div className="topbar-filter-group">{filters}</div>}
      </div>

      {/* Quick Action Icons */}
      <div className="topbar-actions">
        <button className="topbar-icon-btn" title="Alerts & Notifications">
          <Bell size={18} />
          <span className="topbar-notification-badge" />
        </button>
        <button className="topbar-icon-btn" title="Platform Settings">
          <Settings size={18} />
        </button>
        <div className="topbar-user-avatar" title="Commander Profile">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
