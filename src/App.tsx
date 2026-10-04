/**
 * EcoGuía3R - Plataforma Educativa de Reciclaje en Colombia
 * Versión Beta con Base de Datos Embebida (IndexedDB)
 * Foro abierto al público con sección de información camuflada como creación de perfil
 */

import React, { useState, useEffect, useCallback } from 'react';
import { embeddedDb, ReviewComment, DbMetrics } from './db/embeddedDb';
import { WasteItem } from './data/wasteData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EcoGallery } from './components/EcoGallery';
import { WhyRecycle } from './components/WhyRecycle';
import { ContainersSection } from './components/ContainersSection';
import { EducationalGuides } from './components/EducationalGuides';
import { SourceSeparationGuide } from './components/SourceSeparationGuide';
import { RecyclingImpactCalculator } from './components/RecyclingImpactCalculator';
import { WasteSortingGame } from './components/WasteSortingGame';
import { VideoGallery } from './components/VideoGallery';
import { CommentForumAndRatings } from './components/CommentForumAndRatings';
import { UserProfileModal } from './components/UserProfileModal';
import { PythonArchitectureModal } from './components/PythonArchitectureModal';
import { Footer } from './components/Footer';
import { WasteDetailModal } from './components/WasteDetailModal';
import { exportReviewsToExcel } from './utils/excelExport';

export default function App() {
  const [reviews, setReviews] = useState<ReviewComment[]>([]);
  const [metrics, setMetrics] = useState<DbMetrics>({
    totalReviews: 0,
    averageRating: 5.0,
    recommendationRate: 100,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    subRatingAverages: { content: 5, design: 5, usability: 5 },
  });
  const [selectedWasteModalItem, setSelectedWasteModalItem] = useState<WasteItem | null>(null);
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ecoguia3r_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const loadReviewsFromDb = useCallback(async () => {
    try {
      await embeddedDb.init();
      const all = await embeddedDb.getAllReviews();
      const calculatedMetrics = embeddedDb.computeMetrics(all);
      setReviews(all);
      setMetrics(calculatedMetrics);
    } catch (err) {
      console.error('Error loading reviews from embedded DB:', err);
    }
  }, []);

  useEffect(() => {
    loadReviewsFromDb();
  }, [loadReviewsFromDb]);

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#B9E7C5] selection:text-[#174D32]">
      
      {/* Sticky Top Navbar with Perfiles button */}
      <Navbar
        onSelectWasteModal={(item) => setSelectedWasteModalItem(item)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        totalCommentsCount={metrics.totalReviews}
        averageRating={metrics.averageRating}
        isAdmin={isAdmin}
      />

      <main id="inicio" className="flex-1">
        {/* Hero Section */}
        <Hero
          onPlayClick={() => handleScrollTo('juego')}
          onRateClick={() => handleScrollTo('foro')}
          averageRating={metrics.averageRating}
          totalReviews={metrics.totalReviews}
        />

        {/* Sliding Visual Eco Gallery */}
        <EcoGallery />

        {/* Why Recycle Section */}
        <WhyRecycle />

        {/* The 3 Containers of Colombia (Resolution 2184) */}
        <ContainersSection />

        {/* Interactive Step-by-Step Educational Guides */}
        <EducationalGuides />

        {/* Deep Dive Guide: Source Separation & Circular Economy (9R) */}
        <SourceSeparationGuide />

        {/* Interactive Environmental Impact Calculator */}
        <RecyclingImpactCalculator />

        {/* Interactive Waste Sorting Drag-and-Drop / Click Mini Game */}
        <WasteSortingGame />

        {/* Educational Video Gallery */}
        <VideoGallery />

        {/* Embedded Database Forum & Community Rating System */}
        <CommentForumAndRatings
          reviews={reviews}
          metrics={metrics}
          onReviewsChange={loadReviewsFromDb}
          isDbModalOpen={isDbInspectorOpen}
          setIsDbModalOpen={setIsDbInspectorOpen}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          isAdmin={isAdmin}
        />
      </main>

      {/* Footer */}
      <Footer onOpenPythonModal={() => setIsPythonModalOpen(true)} />

      {/* Perfiles Modal (restricted to password holders to download the database) */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onExportExcel={() => exportReviewsToExcel(reviews, metrics)}
        onOpenDbInspector={() => setIsDbInspectorOpen(true)}
        metrics={metrics}
        isAdmin={isAdmin}
        onLoginSuccess={() => {
          setIsAdmin(true);
          sessionStorage.setItem('ecoguia3r_is_admin', 'true');
          sessionStorage.setItem('ecoguia3r_dl_auth', 'true');
        }}
        onLogout={() => {
          setIsAdmin(false);
          sessionStorage.removeItem('ecoguia3r_is_admin');
          sessionStorage.removeItem('ecoguia3r_dl_auth');
        }}
        onOpenPythonModal={() => setIsPythonModalOpen(true)}
      />

      {/* Python Architecture Code Modal */}
      <PythonArchitectureModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
      />

      {/* Quick Search Item Detail Modal */}
      {selectedWasteModalItem && (
        <WasteDetailModal
          item={selectedWasteModalItem}
          onClose={() => setSelectedWasteModalItem(null)}
          onNavigateToContainer={(containerKey) => {
            handleScrollTo('contenedores');
          }}
        />
      )}

    </div>
  );
}
