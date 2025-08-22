'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { PersonalInfoProvider, usePersonalInfo } from './PersonalInfoContext';
import { UserInfoProvider } from './UserInfoContext';
import PersonalInfoModal from './PersonalInfoModal';
import TokenExpirationModal from './TokenExpirationModal';
import TokenWarningModal from './TokenWarningModal';
import ChangePasswordModal from './ChangePasswordModal';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

interface SessionWrapperProps {
  children: ReactNode;
}

// Component để xử lý token expiration
const TokenExpirationHandler = () => {
  const { useTokenExpiration } = require('../hooks/useTokenExpiration');
  const {
    showExpirationModal,
    showWarningModal,
    handleExpirationModalClose,
    handleWarningModalClose,
  } = useTokenExpiration();

  return (
    <>
      <TokenExpirationModal
        isOpen={showExpirationModal}
        onClose={handleExpirationModalClose}
      />
      <TokenWarningModal
        isOpen={showWarningModal}
        onClose={handleWarningModalClose}
      />
    </>
  );
};

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
  const ChangePasswordModalRenderer = () => {
    const { closeChangePasswordModal, isOpenChangePasswordModal } =
      usePersonalInfo();

    return isOpenChangePasswordModal ? (
      <ChangePasswordModal onClose={closeChangePasswordModal} />
    ) : (
      <></>
    );
  };

  return (
    <SessionProvider>
      <UserInfoProvider>
        <PersonalInfoProvider>
          <TokenExpirationHandler />
          {children}
          <PersonalInfoModalRenderer />
          <ChangePasswordModalRenderer />
        </PersonalInfoProvider>
      </UserInfoProvider>
    </SessionProvider>
  );
}
