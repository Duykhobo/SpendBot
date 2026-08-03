import React, { useEffect, useRef } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface Props {
  botName: string;
  onAuth: (user: TelegramUser) => void;
}

const TelegramLoginWidget: React.FC<Props> = ({ botName, onAuth }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Để nhận dữ liệu từ script Telegram
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    if (containerRef.current && containerRef.current.children.length === 0) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botName);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '8');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      
      containerRef.current.appendChild(script);
    }
  }, [botName, onAuth]);

  return <div ref={containerRef} className="telegram-login-container"></div>;
};

export default TelegramLoginWidget;
