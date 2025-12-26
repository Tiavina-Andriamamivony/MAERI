"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type FormData = {
    name: string;
    company: string;
    contact: string;
    location: string;
    services: string[];
    message: string;
}

const serviceOptions = [
    "Consultation Informatique",
    "Formation professionnelle",
    "Approvisionnement Industriel",
    "Autre"
];

export default function Contact() {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
        defaultValues: {
            services: []
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedServices = watch("services");

    const onServiceChange = (service: string, checked: boolean) => {
        if (checked) {
            setValue("services", [...selectedServices, service]);
        } else {
            setValue("services", selectedServices.filter((s) => s !== service));
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi');
            }

            toast.success("Votre demande de devis a été envoyée avec succès !");
            reset();
        } catch (error) {
            toast.error("Une erreur est survenue. Veuillez réessayer.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 mt-24">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
                    Contactez-nous
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
                    Une question ? Un projet ? Notre équipe est à votre écoute pour vous accompagner.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                {/* Contact Information */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" />
                                Téléphone
                            </CardTitle>
                            <CardDescription>
                                Nos lignes sont ouvertes du lundi au vendredi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2 text-sm">
                            <div className="font-medium">+261 (0)38 36 925 29</div>
                            <div className="font-medium">+261 (0)32 56 803 88</div>
                            <div className="font-medium">+261 (0)32 07 079 97</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Email
                            </CardTitle>
                            <CardDescription>
                                Écrivez-nous, nous vous répondrons dans les plus brefs délais.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2 text-sm">
                            <a href="mailto:commercial-maeri@telma.net" className="font-medium hover:underline">commercial-maeri@telma.net</a>
                            <a href="mailto:contact-maeri@telma.net" className="font-medium hover:underline">contact-maeri@telma.net</a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Adresse
                            </CardTitle>
                            <CardDescription>
                                Retrouvez-nous à notre siège.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm font-medium">
                            501 Toamasina – Madagascar
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Demande de Devis</CardTitle>
                        <CardDescription>
                            Remplissez le formulaire ci-dessous pour recevoir une proposition adaptée à vos besoins.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom / Prénom <span className="text-red-500">*</span></Label>
                                    <Input id="name" {...register("name", { required: true })} placeholder="Votre nom" />
                                    {errors.name && <span className="text-xs text-red-500">Ce champ est requis</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="company">Société</Label>
                                    <Input id="company" {...register("company")} placeholder="Nom de votre entreprise" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="contact">Contact (Email/Tel) <span className="text-red-500">*</span></Label>
                                    <Input id="contact" {...register("contact", { required: true })} placeholder="Votre email ou téléphone" />
                                    {errors.contact && <span className="text-xs text-red-500">Ce champ est requis</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Localisation</Label>
                                    <Input id="location" {...register("location")} placeholder="Ville, Pays" />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label>Type de service (Multiple choix possible)</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    {serviceOptions.map((service) => (
                                        <div key={service} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={service}
                                                checked={selectedServices?.includes(service)}
                                                onCheckedChange={(checked) => onServiceChange(service, checked as boolean)}
                                            />
                                            <Label htmlFor={service} className="text-sm font-normal cursor-pointer">{service}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="message"
                                    {...register("message", { required: true })}
                                    placeholder="Décrivez votre projet..."
                                    className="min-h-[150px]"
                                />
                                {errors.message && <span className="text-xs text-red-500">Ce champ est requis</span>}
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" /> Envoyer la demande
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}