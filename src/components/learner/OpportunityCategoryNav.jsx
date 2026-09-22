import React from 'react';
import { Sparkles, Clock, DollarSign, TrendingUp, Store } from 'lucide-react';

const CATEGORY_TABS = [
  {
    id: 'priority',
    label: 'Priority',
    icon: Sparkles,
    countKey: 'priority',
  },
  {
    id: 'newest',
    label: 'New Posted',
    icon: Clock,
    countKey: 'newest',
  },
  {
    id: 'pay',
    label: 'Most Pay',
    icon: DollarSign,
    countKey: 'pay',
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: TrendingUp,
    countKey: 'trending',
  },
  {
    id: 'local_business',
    label: 'Local Businesses',
    icon: Store,
    countKey: 'local_business',
  },
];

export default function OpportunityCategoryNav({
  sortBy = 'priority',
  onSelectSort = () => {},
  counts = { priority: 0, newest: 0, pay: 0, trending: 0, local_business: 0 },
}) {
  return (
    <div className="learner-category-nav-wrap" role="tablist" aria-label="Opportunity filter modes">
      <div className="learner-category-nav-rail">
        {CATEGORY_TABS.map((tab) => {
          const isActive = sortBy === tab.id;
          const Icon = tab.icon;
          const count = counts[tab.countKey] !== undefined ? counts[tab.countKey] : 0;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="opportunity-list"
              onClick={() => onSelectSort(tab.id)}
              className={`learner-category-tab ${isActive ? 'is-active' : ''}`}
            >
              <div className="learner-category-tab-main">
                <Icon className={`learner-category-tab-icon ${isActive ? 'is-active' : ''}`} />
                <span className="learner-category-tab-label">{tab.label}</span>
              </div>
              <span className={`learner-category-tab-badge ${isActive ? 'is-active' : ''}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
