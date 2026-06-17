import type React from 'react';

export interface LabModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  difficulty: string;
}

export interface CTFChallenge {
  id: number;
  title: string;
  category: 'web' | 'crypto' | 'misc' | 're';
  description: string;
  flag: string;
  hint: string;
  points: number;
}
