"use client"
import { AuthProvider } from '@/context/auth';
import React from 'react'
import HomeInside from '@/components/Home';

export default function Home() {
  return (
    <AuthProvider>
      <HomeInside />
    </AuthProvider>
  );
}
