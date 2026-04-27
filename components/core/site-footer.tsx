import { Github, Instagram, Mail, Phone, Send } from "lucide-react"

import { getFooterContactCountry } from "@/lib/contact-routing"
import { getSiteCopy, type Locale } from "@/lib/site-content"
import { MinimalWhatsappIcon } from "@/components/icons/minimal-whatsapp-icon"

type SiteFooterProps = {
  locale: Locale
}

// MIXED: footer content is client-facing, while the contact chip system is reusable chrome.
export function SiteFooter({ locale }: SiteFooterProps) {
  // CLIENTE_OWNED: footer contact data and outbound profiles are sourced from the site copy model.
  const copy = getSiteCopy(locale)
  const contactCountry = getFooterContactCountry(locale)
  const emailIndex = contactCountry === "canada" ? 0 : 1
  const telegramIndex = contactCountry === "canada" ? 0 : 1
  const selectedEmail = copy.contact.emails[emailIndex] ?? copy.contact.emails[0]
  const selectedTelegram = copy.contact.telegrams[telegramIndex] ?? copy.contact.telegrams[0]
  const selectedPhone = contactCountry === "canada" ? copy.contact.phone : "5512291607"
  const normalizeExternalHref = (href: string) => (href.startsWith("http") ? href : `https://${href}`)
  const whatsappHref = `https://wa.me/${copy.contact.whatsapp.replace(/[^+\d]/g, "").replace(/^\+/, "")}`
  // AGENCY_OWNED: reusable contact-chip layout and icon treatment.
  const contactItems = [
    {
      href: `mailto:${selectedEmail}`,
      label: `Email ${selectedEmail}`,
      icon: Mail,
      external: false,
    },
    {
      href: `tel:${selectedPhone.replace(/[^+\d]/g, "")}`,
      label: `Call ${selectedPhone}`,
      icon: Phone,
      external: false,
    },
    {
      href: whatsappHref,
      label: "WhatsApp",
      icon: MinimalWhatsappIcon,
      external: true,
    },
    {
      href: normalizeExternalHref(selectedTelegram),
      label: `Telegram ${selectedTelegram}`,
      icon: Send,
      external: true,
    },
    {
      href: copy.contact.instagram,
      label: "Instagram",
      icon: Instagram,
      external: true,
    },
    {
      href: "https://github.com/driano7",
      label: "GitHub",
      icon: Github,
      external: true,
    },
  ]

  return (
    <footer className="relative mt-8 border-t border-black/10 bg-white/75 backdrop-blur-xl dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        {/* AGENCY_OWNED: footer chrome is reusable; the visible labels are client-owned copy. */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
          {contactItems.map((item) => {
            const Icon = item.icon
            const chip = (
              <span className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white text-foreground transition-all duration-300 hover:border-[color:var(--accent)]/35 hover:text-[color:var(--accent)] hover:shadow-[0_0_0_1px_rgba(251,125,79,0.12),0_12px_24px_rgba(251,125,79,0.08)] dark:border-white/10 dark:bg-white/5 dark:text-white/90">
                <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,125,79,0.18),transparent_72%)] opacity-0 transition-opacity duration-300 content-[''] group-hover:opacity-100" />
                <Icon className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </span>
            )

            return (
              <a key={item.href} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} aria-label={item.label} title={item.label}>
                {chip}
              </a>
            )
          })}
        </div>

        <div className="flex justify-center">
          <a
            href="https://riano.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-[color:var(--accent)]"
          >
            {copy.footer.credit}
          </a>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/5 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-foreground">{copy.brand.name}</p>
          <p>© 2026 {copy.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
