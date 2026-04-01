"use client"

const brands = [
  "BBS",
  "OZ Racing",
  "Vossen",
  "Enkei",
  "Work Wheels",
  "Rays",
  "HRE",
  "ADV.1",
  "Rotiform",
  "Forgiato",
]

export function BrandsSection() {
  return (
    <section id="brands" className="py-16 sm:py-24 bg-secondary/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
            Официальный дилер
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-marquee">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 sm:mx-12 text-2xl sm:text-3xl lg:text-4xl font-bold text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer whitespace-nowrap"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
