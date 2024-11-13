"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqs } from "@/lib/api/faqs.service";
import { Faq } from "@/lib/models/faq";
import { Loader2 } from "lucide-react";

export default function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const faqData = await getFaqs();
        setFaqs(faqData.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error loading FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFaqs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 bg-muted/50">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Questions fréquentes
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-background rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
