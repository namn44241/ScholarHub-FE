import { BecomeMentorSection, CommunitySection, CoreValueSection, HeroSection, LatestInformationSection, NetworkSection, PartnershipLogos, ReadySection, SearchSection } from "@/features/landing"
import { createFileRoute } from "@tanstack/react-router"
export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen select-none overflow-x-hidden">
      <HeroSection />
      <SearchSection />
      <CommunitySection />
      <NetworkSection />
      <LatestInformationSection />
      <PartnershipLogos />
      <BecomeMentorSection />
      <CoreValueSection />
      <ReadySection />
    </div>
  )
} 1
