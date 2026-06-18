import Navbar from './components/Navbar'
import HeroAssembly from './components/HeroAssembly'
import ImageSection from './components/ImageSection'
import EngineeringSection from './components/EngineeringSection'
import BuiltForDriverSection from './components/BuiltForDriverSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      
      <HeroAssembly />

      <ImageSection
        id="exterior"
        number="01"
        label="EXTERIOR DESIGN"
        heading="SCULPTED BY THE WIND."
        description="A silhouette that commands attention. Every curve and intake is meticulously crafted to slice through the air while remaining undeniably beautiful."
        imageSrc="/assets/car-full-reveal.png"
        altText="Exterior Reveal"
      />

      <ImageSection
        id="aerodynamics"
        number="02"
        label="AERODYNAMICS"
        heading="DOWNFORCE. REDEFINED."
        description="The active rear wing and underbody diffuser work in perfect harmony to generate over 800kg of downforce at top speed, pinning the PARFMAN to the tarmac."
        imageSrc="/assets/car-rear-action.png"
        altText="Rear Action"
      />

      <ImageSection
        id="cockpit"
        number="03"
        label="COCKPIT"
        heading="COMMAND CENTER."
        description="An interior stripped of distraction. Carbon fiber, Alcantara, and perfectly placed tactile controls create an environment where the driver and machine become one."
        imageSrc="/assets/cockpit-interior.png"
        altText="Cockpit Interior"
      />

      <EngineeringSection />

      <BuiltForDriverSection />

      <ImageSection
        id="materials"
        number="06"
        label="MATERIALS & FINISH"
        heading="ROSSO CORSA."
        description="Our signature paint process involves six individual coats, hand-polished between applications, resulting in a depth and luster that captures the essence of speed."
        imageSrc="/assets/car-rosso-corsa.png"
        altText="Rosso Corsa Finish"
      />

      <ImageSection
        id="color"
        number="07"
        label="COLOR & CONFIGURATION"
        heading="YOUR MASTERPIECE."
        description="With our bespoke Tailor Made program, every PARFMAN is a unique expression of its owner. Select from infinite combinations to craft your perfect configuration."
        imageSrc="/assets/extra1.png"
        altText="Configuration"
      />

      <Footer />
    </>
  )
}
