"use client"

import Link from "next/link"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  catalog: [
    { name: "Литые диски", href: "#" },
    { name: "Кованые диски", href: "#" },
    { name: "Штампованные диски", href: "#" },
    { name: "Эксклюзивные модели", href: "#" },
  ],
  company: [
    { name: "О компании", href: "#about" },
    { name: "Доставка и оплата", href: "#" },
    { name: "Гарантия", href: "#" },
    { name: "Контакты", href: "#contacts" },
  ],
  support: [
    { name: "Подбор по авто", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Блог", href: "#" },
    { name: "Отзывы", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="contacts" className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                RIMZONE
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Премиальные автомобильные диски от ведущих мировых производителей. Качество, стиль и надёжность для вашего автомобиля.
            </p>

            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="icon" className="bg-foreground text-background hover:bg-foreground/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Каталог</h4>
            <ul className="space-y-3">
              {footerLinks.catalog.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Компания</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Поддержка</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 RIMZONE. Все права защищены.
          </p>
          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <Link href="#" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
