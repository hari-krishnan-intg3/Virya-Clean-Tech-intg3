import { lazy, Suspense, useEffect } from 'react';
import { NavbarContainer } from '@/components/layout/NavbarContainer';
import { FooterContainer } from '@/components/layout/FooterContainer';
import { HeroSliderContainer } from '@/components/sections/HeroSliderContainer';
import { AboutContainer } from '@/components/sections/AboutContainer';
import { ServicesContainer } from '@/components/sections/ServicesContainer';

// Below-the-fold sections are code-split to keep the initial bundle light.
const EnergyEcosystemContainer = lazy(() =>
  import('@/components/sections/EnergyEcosystemContainer').then((m) => ({
    default: m.EnergyEcosystemContainer,
  })),
);
const WhyViryaContainer = lazy(() =>
  import('@/components/sections/WhyViryaContainer').then((m) => ({
    default: m.WhyViryaContainer,
  })),
);
const ProcessContainer = lazy(() =>
  import('@/components/sections/ProcessContainer').then((m) => ({
    default: m.ProcessContainer,
  })),
);
const ApplicationsContainer = lazy(() =>
  import('@/components/sections/ApplicationsContainer').then((m) => ({
    default: m.ApplicationsContainer,
  })),
);
const BookingFormContainer = lazy(() =>
  import('@/components/sections/BookingFormContainer').then((m) => ({
    default: m.BookingFormContainer,
  })),
);
const ContactContainer = lazy(() =>
  import('@/components/sections/ContactContainer').then((m) => ({
    default: m.ContactContainer,
  })),
);
const ChatAssistantContainer = lazy(() =>
  import('@/components/assistant/ChatAssistantContainer').then((m) => ({
    default: m.ChatAssistantContainer,
  })),
);

function SectionFallback() {
  return (
    <div className="section" aria-hidden="true">
      <div className="shell">
        <div className="h-8 w-40 rounded-full bg-mist" />
        <div className="mt-5 h-12 w-full max-w-2xl rounded-xl bg-mist" />
      </div>
    </div>
  );
}

export default function App() {
  // Keep the document title in sync if the tab is restored from cache.
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  return (
    <>
      <a
        href="#about"
        className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-lg bg-emerald-500 px-4 py-2 font-heading text-sm font-semibold text-white"
      >
        Skip to content
      </a>

      <NavbarContainer />

      <main id="main">
        <HeroSliderContainer />
        <AboutContainer />
        <ServicesContainer />

        <Suspense fallback={<SectionFallback />}>
          <EnergyEcosystemContainer />
          <WhyViryaContainer />
          <ProcessContainer />
          <ApplicationsContainer />
          <BookingFormContainer />
          <ContactContainer />
        </Suspense>
      </main>

      <FooterContainer />

      <Suspense fallback={null}>
        <ChatAssistantContainer />
      </Suspense>
    </>
  );
}