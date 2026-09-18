'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAqua } from '@/context/AquaContext';
import { useRouter } from 'next/navigation';

interface UserAvatarDropdownProps {
  placement?: 'up' | 'down';
  align?: 'left' | 'right';
  triggerSize?: 'sm' | 'md';
  idPrefix?: string;
  onLogoutClick?: () => void;
}

export default function UserAvatarDropdown({
  placement = 'down',
  align = 'right',
  triggerSize = 'md',
  idPrefix = 'user-menu',
  onLogoutClick
}: UserAvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { logout } = useAqua();
  const router = useRouter();

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogoutClick) {
      onLogoutClick();
    }
    logout();
    router.push('/');
  };

  const sizeClasses = triggerSize === 'sm'
    ? 'w-7 h-7 text-xs'
    : 'w-8 h-8 text-xs';

  const positionClasses = placement === 'up'
    ? 'bottom-full mb-2'
    : 'top-full mt-2';

  const alignClasses = align === 'left'
    ? 'left-0'
    : 'right-0';

  return (
    <div ref={containerRef} className="relative inline-block text-left shrink-0">
      {/* Compact avatar-only trigger */}
      <button
        type="button"
        id={`${idPrefix}-avatar-btn`}
        onClick={() => setIsOpen(prev => !prev)}
        className={`${sizeClasses} rounded-full bg-[#2F6FED] text-white font-bold flex items-center justify-center cursor-pointer border border-[#2F6FED] hover:ring-2 hover:ring-[#2F6FED]/30 hover:opacity-95 transition-all shadow-xs shrink-0 select-none`}
        aria-label="User profile menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        CN
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          id={`${idPrefix}-dropdown`}
          className={`absolute ${positionClasses} ${alignClasses} w-52 bg-[#FFFFFF] rounded-xl border border-[#E4E7EC] shadow-lg p-1.5 z-50 transition-all select-none`}
          style={{ maxWidth: 'calc(100vw - 32px)' }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={`${idPrefix}-avatar-btn`}
        >
          {/* Top user info header row (non-clickable) */}
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <div className="w-8 h-8 rounded-full bg-[#2F6FED] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              CN
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#101828] truncate leading-tight">
                Complan Neeraj
              </span>
              <span className="text-[11px] text-[#667085] truncate leading-tight mt-0.5">
                Demo User
              </span>
            </div>
          </div>

          {/* Thin Divider Line */}
          <div className="h-px bg-[#E4E7EC] my-1" />

          {/* Log Out Clickable Item */}
          <button
            type="button"
            id={`${idPrefix}-logout-btn`}
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#101828] hover:bg-[#EFF4FF] hover:text-[#2F6FED] transition-colors cursor-pointer group"
            role="menuitem"
          >
            <span className="material-symbols-outlined text-[18px] text-[#667085] group-hover:text-[#2F6FED] transition-colors">
              logout
            </span>
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
