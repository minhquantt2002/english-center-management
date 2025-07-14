'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { PersonalInfoProvider, usePersonalInfo } from './PersonalInfoContext';
import { UserInfoProvider } from './UserInfoContext';
import PersonalInfoModal from './PersonalInfoModal';

interface SessionWrapperProps {
  children: ReactNode;
}

// Component để render modal
const PersonalInfoModalRenderer = () => {
  const { isOpen, userRole, closeModal } = usePersonalInfo();

  return (
    <PersonalInfoModal
      isOpen={isOpen}
      onClose={closeModal}
      userRole={userRole}
    />
  );
};

export default function SessionWrapper({ children }: SessionWrapperProps) {
  return (
    <SessionProvider>
      <UserInfoProvider>
        <PersonalInfoProvider>
          {children}
          <PersonalInfoModalRenderer />
        </PersonalInfoProvider>
      </UserInfoProvider>
    </SessionProvider>
  );
}
