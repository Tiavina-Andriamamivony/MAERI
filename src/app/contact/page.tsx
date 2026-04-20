"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowUpRight, Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Kicker } from "@/components/brand";

type FormData = {
  name: string;
  company: string;
  contact: string;
  location: string;
  services: string[];
  message: string;
};

const serviceOptions = [
  "Approvisionnement industriel",
  "Matières premières",
  "Réseau fournisseurs",
  "Formation professionnelle",
  "Conseil informatique",
  "Autre",
];

const phones = [
  "+261 (0)38 36 925 29",
  "+261 (0)32 56 803 88",
  "+261 (0)32 07 079 97",
];

const emails = [
  { label: "Commercial", value: "commercial-maeri@telma.net" },
  { label: "Général", value: "contact-maeri@telma.net" },
];

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({ defaultValues: { services: [] } });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedServices = watch("services");

  const onServiceChange = (service: string, checked: boolean) => {
    if (checked) setValue("services", [...selectedServices, service]);
    else setValue("services", selectedServices.filter((s) => s !== service));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("send failed");
      toast.success("Votre demande a bien été envoyée. Nous revenons vers vous sous 24 h.");
      reset();
    } catch (error) {
      toast.error("Une erreur est survenue. Merci de réessayer.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="relative border-b border-border bg-background bg-grain">
        <div className="container mx-auto px-6 lg:px-10 py-20 md:py-28">
          <Kicker accent index="→">Contact · Demande de devis</Kicker>
          <h1 className="mt-8 display font-display text-display-lg font-medium text-balance max-w-[18ch] animate-rise leading-[0.95]">
            Parlons de <span className="italic text-muted-foreground">votre projet.</span>
          </h1>
          <p
            className="mt-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-snug animate-rise"
            style={{ animationDelay: "120ms" }}
          >
            Remplissez ce formulaire ou écrivez-nous directement. Un chargé de
            clientèle vous répond sous 24 heures ouvrées.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Coordinates column */}
          <aside className="lg:col-span-5 flex flex-col gap-12">
            <div>
              <Kicker accent>
                <Phone className="h-3.5 w-3.5" /> Téléphone
              </Kicker>
              <ul className="mt-6 flex flex-col divide-y divide-border border-y border-border">
                {phones.map((p) => (
                  <li key={p} className="py-4 font-display text-2xl font-medium tabular-nums">
                    <a href={`tel:${p.replace(/\s|\(|\)/g, "")}`} className="hover:text-brand transition-colors">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Lignes ouvertes du lundi au vendredi, 8h–17h.</p>
            </div>

            <div>
              <Kicker accent>
                <Mail className="h-3.5 w-3.5" /> Email
              </Kicker>
              <ul className="mt-6 flex flex-col divide-y divide-border border-y border-border">
                {emails.map((e) => (
                  <li key={e.value} className="py-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{e.label}</span>
                    <a href={`mailto:${e.value}`} className="font-medium hover:text-brand transition-colors">
                      {e.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Kicker accent>
                <MapPin className="h-3.5 w-3.5" /> Siège
              </Kicker>
              <p className="mt-6 font-display text-2xl font-medium leading-tight">
                501 Toamasina — Madagascar
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Porte industrielle et portuaire de l&apos;océan Indien.
              </p>
            </div>
          </aside>

          {/* Form column */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 flex flex-col gap-10">
            <div className="flex items-baseline justify-between pb-4 border-b border-border">
              <Kicker index="01" accent>Formulaire</Kicker>
              <span className="kicker">Réponse · 24h</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom / Prénom *</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="Votre nom" />
                {errors.name && <span className="text-xs text-destructive">Ce champ est requis</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Société</Label>
                <Input id="company" {...register("company")} placeholder="Nom de votre entreprise" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact (email / téléphone) *</Label>
                <Input id="contact" {...register("contact", { required: true })} placeholder="Email ou téléphone" />
                {errors.contact && <span className="text-xs text-destructive">Ce champ est requis</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Localisation</Label>
                <Input id="location" {...register("location")} placeholder="Ville, pays" />
              </div>
            </div>

            <div className="grid gap-4">
              <Label>Service(s) concerné(s)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {serviceOptions.map((service) => (
                  <label
                    key={service}
                    htmlFor={service}
                    className="flex items-center gap-3 px-4 py-3 border border-border hover:bg-secondary/60 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      id={service}
                      checked={selectedServices?.includes(service)}
                      onCheckedChange={(checked) =>
                        onServiceChange(service, checked as boolean)
                      }
                    />
                    <span className="text-sm font-medium">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                {...register("message", { required: true })}
                placeholder="Décrivez votre projet, votre contexte, vos volumes, vos délais…"
                className="min-h-[180px]"
              />
              {errors.message && <span className="text-xs text-destructive">Ce champ est requis</span>}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-8">
              <p className="text-xs text-muted-foreground max-w-xs">
                Les informations transmises sont utilisées uniquement pour répondre à votre demande.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center justify-between gap-6 rounded-full px-8 py-4 text-sm font-medium transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
                style={{ backgroundColor: "var(--ink)", color: "var(--paper)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                  </>
                ) : (
                  <>
                    <span>Envoyer la demande</span>
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container mx-auto px-6 lg:px-10 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="kicker">Pas encore sûr ? Commencez par explorer</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/services", label: "Services" },
              { href: "/pricing/medium-business", label: "Formules" },
              { href: "/about/mission", label: "Mission" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-foreground/60 transition-colors"
              >
                {l.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
