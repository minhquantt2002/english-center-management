import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { isTokenExpired, isTokenExpiringSoon } from '../utils/tokenUtils';

export const useTokenExpiration = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showExpirationModal, setShowExpirationModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    // Kiểm tra token expiration mỗi phút
    const checkTokenExpiration = () => {
      if (session?.accessToken) {
        try {
          const token = session.accessToken;
          
          // Kiểm tra xem token có hết hạn chưa
          if (isTokenExpired(token)) {
            console.log('Token expired, showing modal...');
            setShowExpirationModal(true);
          }
          // Kiểm tra xem token có sắp hết hạn không (dưới 5 phút)
          else if (isTokenExpiringSoon(token)) {
            console.log('Token expiring soon, showing warning...');
            setShowWarningModal(true);
          }
        } catch (error) {
          console.error('Error checking token expiration:', error);
          // Nếu không decode được token, coi như expired
          setShowExpirationModal(true);
        }
      }
    };

    // Kiểm tra ngay khi component mount
    checkTokenExpiration();
    
    // Set interval để kiểm tra định kỳ (mỗi phút)
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [session, router]);

  const handleExpirationModalClose = () => {
    setShowExpirationModal(false);
    // Tự động logout sau khi đóng modal
    signOut({ 
      callbackUrl: '/auth/login',
      redirect: true 
    });
  };

  const handleWarningModalClose = () => {
    setShowWarningModal(false);
  };

  return { 
    session, 
    status, 
    showExpirationModal, 
    showWarningModal,
    handleExpirationModalClose,
    handleWarningModalClose
  };
}; 