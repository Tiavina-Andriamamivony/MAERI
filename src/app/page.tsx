import React from 'react'
import { InteractiveGridPatternDemo } from '@/components/background-box'
import { Services } from '@/components/SeviceSection'
import Link from 'next/link'
export default function Home() {
  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-background text-foreground">
      {/* Hero */}
      <InteractiveGridPatternDemo />

      {/* Intro + CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Solutions industrielles et services professionnels</h2>
          <p className="text-lg text-muted-foreground mb-6">
            MA-ERI accompagne les entreprises avec des fournitures industrielles, des formations professionnelles et des services digitaux.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95">
              Contactez-nous
            </Link>
            <Link href="/services" className="inline-flex items-center rounded-md border border-input px-5 py-3 text-sm font-medium">
              Nos services
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-transparent">
        <Services />
      </section>

      {/* Footer */}
      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MA-ERI — Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
