'use client';

import React, { createContext, useContext, useState } from 'react';

type TalkNowContextType = {
  isOpen: boolean;
  open: (triggerRect?: DOMRect) => void;
  close: () => void;
  triggerRect: DOMRect | null;
};

const TalkNowContext = createContext<TalkNowContextType | undefined>(undefined);

export function TalkNowProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const open = (rect?: DOMRect) => {
    if (rect) setTriggerRect(rect);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Freeze scrolling
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = ''; // Unfreeze scrolling
  };

  return (
    <TalkNowContext.Provider value={{ isOpen, open, close, triggerRect }}>
      {children}
    </TalkNowContext.Provider>
  );
}

export function useTalkNow() {
  const context = useContext(TalkNowContext);
  if (!context) {
    throw new Error('useTalkNow must be used within a TalkNowProvider');
  }
  return context;
}

// Tickets Context
type TicketsModalContextType = {
  isOpen: boolean;
  selectedEventSlug: string | null;
  openTickets: (eventSlug?: string) => void;
  closeTickets: () => void;
};

const TicketsModalContext = createContext<TicketsModalContextType | undefined>(undefined);

export function TicketsModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventSlug, setSelectedEventSlug] = useState<string | null>(null);

  const openTickets = (eventSlug?: string) => {
    if (eventSlug) setSelectedEventSlug(eventSlug);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeTickets = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedEventSlug(null), 500); // clear after animation
    document.body.style.overflow = '';
  };

  return (
    <TicketsModalContext.Provider value={{ isOpen, selectedEventSlug, openTickets, closeTickets }}>
      {children}
    </TicketsModalContext.Provider>
  );
}

export function useTicketsModal() {
  const context = useContext(TicketsModalContext);
  if (!context) {
    throw new Error('useTicketsModal must be used within a TicketsModalProvider');
  }
  return context;
}
