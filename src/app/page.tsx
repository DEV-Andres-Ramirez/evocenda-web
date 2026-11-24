import { ViewTransition } from "react";
import { RevealObserver } from "@/components/fx/reveal-observer";
import { ScrollSpy } from "@/components/home/scroll-spy";
import { SendaRail } from "@/components/home/senda-rail";
import { Contacto } from "@/components/sections/contacto";
import { Credenciales } from "@/components/sections/credenciales";
import { Docencia } from "@/components/sections/docencia";
import { Evidencia } from "@/components/sections/evidencia";
import { Hero } from "@/components/sections/hero";
import { Perfil } from "@/components/sections/perfil";
import { Proyectos } from "@/components/sections/proyectos";
import { Senda } from "@/components/sections/senda";
import { Stack } from "@/components/sections/stack";
import { site } from "@/content/site";

/** Datos estructurados (schema.org) para buscadores. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: site.name,
  url: site.url,
  inLanguage: "es",
  mainEntity: {
    "@type": "Person",
    name: site.author,
    alternateName: site.displayName,
    jobTitle: site.roles.join(" · "),
    description: site.description,
    url: site.url,
    sameAs: [site.contact.linkedinUrl],
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
    knowsLanguage: ["es", "en", "it"],
    knowsAbout: [
      "Inteligencia artificial generativa",
      "Automatización de procesos",
      "Transformación digital",
      "Desarrollo full-stack",
      "Formación empresarial",
    ],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Universidad Pedagógica y Tecnológica de Colombia" },
      { "@type": "EducationalOrganization", name: "Instituto Europeo de Posgrado" },
    ],
  },
};

export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <ScrollSpy />
        <RevealObserver />
        <SendaRail />
        <Hero />
        <Perfil />
        <Evidencia />
        <Docencia />
        <Senda />
        <Proyectos />
        <Stack />
        <Credenciales />
        <Contacto />
      </div>
    </ViewTransition>
  );
}
