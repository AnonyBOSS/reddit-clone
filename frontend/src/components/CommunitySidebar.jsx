// src/components/CommunitySidebar.jsx
import React from "react";

function Card({ children }) {
  return (
    <div className="bg-reddit-card dark:bg-reddit-dark_card border border-reddit-border dark:border-reddit-dark_divider rounded-xl p-4 shadow-sm">
      {children}
    </div>
  );
}

export default function CommunitySidebar({ community }) {
  return (
    <div className="space-y-4">
      {/* small hero card with banner thumbnail */}
      <Card>
        <div className="flex items-center gap-3">
          <img
            src={community.icon}
            alt={community.name}
            className="h-12 w-12 rounded-md object-cover"
          />
          <div>
            <div className="font-semibold text-reddit-text dark:text-reddit-dark_text">
              {community.title}
            </div>
            <div className="text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
              {community.description}
            </div>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h3 className="font-semibold mb-2 text-reddit-text dark:text-reddit-dark_text">About</h3>
        <p className="text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
          {community.description}
        </p>
      </Card>

      {/* Stats */}
      <Card>
        <h3 className="font-semibold mb-2 text-reddit-text dark:text-reddit-dark_text">Stats</h3>
        <div className="text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary">
          <div className="mb-1">{community.members.toLocaleString()} members</div>
          <div>{community.active} currently online</div>
        </div>
      </Card>

      {/* Rules */}
      <Card>
        <h3 className="font-semibold mb-2 text-reddit-text dark:text-reddit-dark_text">Rules</h3>
        <ol className="list-decimal ml-5 text-sm text-reddit-text_secondary dark:text-reddit-dark_text_secondary space-y-2">
          {community.rules?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
