import { Zap, Inbox, BarChart3 } from "lucide-react"

export function ProductSection() {
  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <div className="inline-block">
          <div className="font-serif text-5xl leading-tight tracking-tight text-foreground lg:text-6xl">
            <span className="lg:inline-flex items-center justify-center gap-2 lg:gap-4 align-middle">
              Cut project planning time in {' '}
              <span className="inline-flex flex-col items-center gap-0">
                <span className="leading-none">ha</span>
                <span className="h-0.5 w-12 bg-foreground"></span>
                <span className="leading-none">lf</span>
              </span>
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
          AI-powered task automation, intelligent scheduling, and real-time insights that help teams deliver projects 2x faster.
        </p>

        {/* Feature grid */}
        <div className="mt-16 grid gap-5 text-left md:grid-cols-3">
          <div className="group relative rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Zap className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-serif text-xl text-foreground">40% faster delivery</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              AI assigns tasks to the right team member based on skills, availability, and workload.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <Inbox className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-serif text-xl text-foreground">0 context switching</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Manage tasks, timelines, and team communication from a unified project dashboard.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
            <BarChart3 className="mb-4 h-8 w-8 text-accent transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-serif text-xl text-foreground">Identify bottlenecks instantly</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Track project progress, team performance, and delivery metrics in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
