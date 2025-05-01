"use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Montserrat } from "next/font/google";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { useEffect } from "react";
config.autoAddCss = false // предотвращает дублирование стилей

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'], // указываешь нужные тебе веса
  subsets: ['latin'], // можно указать дополнительные поднаборы
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const hoverables = Array.from(document.querySelectorAll(
      'a, button, input, [data-cursor-hover]'
    )) as HTMLElement[];
  
    let lastX = 0, lastY = 0, lastTime = Date.now();
  
    const handleMouseMove = (e: MouseEvent) => {
      // движение курсора
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Date.now() - lastTime;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
  
      // обычный масштаб
      const baseScale = 1 + Math.min(speed * 0.5, 0.5);
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top  = `${e.clientY}px`;
      cursor.style.transform = `translate(-50%, -50%) scale(${baseScale})`;
  
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = Date.now();
    };
  
    const addPulse = () => cursor.classList.add('pulse');
    const removePulse = () => cursor.classList.remove('pulse');
  
    // слушаем hover на интерактивных элементах
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', addPulse);
      el.addEventListener('mouseleave', removePulse);
    });
  
    document.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', addPulse);
        el.removeEventListener('mouseleave', removePulse);
      });
    };
  }, []);
  
  
  
  return (
    <html lang="en">
      <head>        
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <div className="custom-cursor">
        <div className="triangle"></div>
      </div>
        {children}
      </body>
    </html>
  );
}
