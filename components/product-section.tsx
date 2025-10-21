import { Code, Zap, Shield, GitBranch, Database, Lock } from "lucide-react"

export function ProductSection() {
  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <div className="inline-block">
          <div className="font-serif text-5xl leading-tight tracking-tight text-foreground lg:text-6xl">
            <span className="lg:inline-flex items-center justify-center gap-2 lg:gap-4 align-middle">
              AI agents that just work
            </span>
          </div>
          <svg className="mx-auto mt-2 w-48" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5 T 140 5 T 160 5 T 180 5 T 200 5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-accent"
            />
          </svg>
        </div>
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
          Connect to your existing tools and workflows. Deploy intelligent agents 
          that understand your business and solve customer problems.
        </p>

        {/* Feature grid */}
        <div className="mt-16 grid gap-5 text-left md:grid-cols-3">
          <div className="group relative rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Code className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-serif text-xl text-foreground">Easy Integration</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Connect to Stripe, Calendly, Zendesk, Whatsapp, Slack, Instagram, and many more with simple configuration.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Database className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-serif text-xl text-foreground">Smart Actions</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Configure actions like updating subscriptions, changing addresses, and managing orders.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Shield className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-serif text-xl text-foreground">Enterprise Security</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              SOC 2 Type II compliant with end-to-end encryption and strict data protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
