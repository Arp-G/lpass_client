import React, { FC } from 'react';
import { AlertType } from '../../Types/Types';

interface Props {
  type: AlertType,
  message: string
}

const Alert: FC<Props> = (alert) => {
  const ALERT_COLORS = {
    'SUCCESS': 'green-500',
    'INFO': 'blue-500',
    'WARNING': 'yellow-500',
    'ERROR': 'red-500'
  };

  const ALERT_SVGS = {
    'SUCCESS':
      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
      </svg>,
    'INFO':
      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
      </svg>,
    'WARNING':
      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
      </svg>,
    'ERROR':
      <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
      </svg>
  };

  return (
    <div className={`
      flex
      w-full
      max-w-sm
      mx-auto
      overflow-hidden
      bg-white
      rounded-lg
      shadow-md
      dark:bg-gray-800
      transition-opacity duration-700
      fixed bottom-6 max-w-64 left-1/2 -translate-x-1/2
      ${alert?.type ? 'opacity-80' : 'opacity-0'}`}
    >
      <div className={`flex items-center justify-center w-12 bg-${ALERT_COLORS[alert?.type]}`}> {ALERT_SVGS[alert?.type]}  </div>
      <div className="px-2 py-2 -mx-3">
        <div className="mx-3">
          <p className="text text-gray-600 dark:text-gray-200">
            {alert?.message}
          </p>
        </div>
      </div>
    </div>);
}

export default Alert;
