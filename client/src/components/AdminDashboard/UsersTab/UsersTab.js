import React, { useState } from 'react';
import UserCard from './UserCard/UserCard';
import UserSearch from './UserSearch/UserSearch';
import EmptyState from '../common/EmptyState/EmptyState';
import './UsersTab.css'

const UsersTab = ({ users, onDeleteUser, isMobile }) => {
  console.log("usertab", users)
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u._id.toLowerCase().includes(userSearch.toLowerCase())
  );

  // SVG as data URL
  const emptyUsersSvgDataUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxZDVkYiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xNyAyMXYtMmE0IDQgMCAwIDAtNC00SDUuMDAyYTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjkiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNMjMgMjF2LTJhNCA0IDAgMCAwLTMtMy44NyI+PC9wYXRoPjxwYXRoIGQ9Ik0xNiAzLjEzYTQgNCAwIDAgMSAwIDcuNzUiPjwvcGF0aD48L3N2Zz4=";

  return (
    <div className="tab-content">
      <UserSearch value={userSearch} onChange={setUserSearch} />
      
      {filteredUsers.length === 0 ? (
        <EmptyState 
          imageSrc={emptyUsersSvgDataUrl}
          title="No users found"
          description="Try adjusting your search query"
        />
      ) : (
        <div className="user-cards">
          {filteredUsers.map(user => (
            <UserCard 
              key={user._id} 
              user={user} 
              onDelete={onDeleteUser}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersTab;