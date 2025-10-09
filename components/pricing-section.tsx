export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "29",
      description: "Perfect for small teams",
      features: ["Up to 3 team members", "5 active projects", "Basic AI automation", "Project analytics"],
    },
    {
      name: "Professional",
      price: "99",
      description: "For growing teams",
      features: [
        "Up to 15 team members",
        "Unlimited projects",
        "Advanced AI automation",
        "Real-time analytics",
        "Custom workflows",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited team members",
        "Dedicated success manager",
        "Custom integrations",
        "SLA guarantees",
        "24/7 priority support",
      ],
    },
  ]

  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="inline-block">
            <h2 className="font-serif text-5xl leading-tight tracking-tight text-foreground lg:text-6xl">
              <span className="text-balance">Pricing that scales</span>
            </h2>
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
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Choose the plan that fits your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-card p-10 ${plan.popular ? "ring-2 ring-accent shadow-xl" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
                  Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-serif text-3xl text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Custom" && <span className="text-lg text-muted-foreground">$</span>}
                  <span className="font-serif text-5xl text-foreground">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                </div>
              </div>

              <button className="mb-8 w-full rounded-full bg-foreground px-6 py-3 font-medium text-background transition-all hover:scale-105">
                {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 text-foreground">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
