"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={cn(
          'relative z-50 flex w-full max-w-lg max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-xl border bg-background p-6 shadow-xl',
          className
        )}
      >
        {title && (
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
