import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/cms";
import { Phone, Mail, Instagram, MessageCircle } from "lucide-react";

export function ContactLinks() {
  const { data } = useQuery(settingsQuery);
  const company = data?.company;
  if (!company) return null;
  const links = [
    { label: company.phone, href: `tel:${company.whatsapp || company.phone}`, icon: Phone },
    { label: company.email, href: `mailto:${company.email}`, icon: Mail },
    { label: "@yomi.visuals", href: data?.social?.instagram, icon: Instagram },
    { label: "WhatsApp", href: company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, "")}` : null, icon: MessageCircle },
  ];
  return <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-subtle">
    {links.filter(link => link.label && link.href).map(link => <a key={link.href} href={link.href} className="inline-flex min-h-11 min-w-0 items-center gap-2 break-all transition-colors hover:text-gold" {...(link.href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><link.icon className="h-4 w-4 shrink-0" />{link.label}</a>)}
  </div>;
}