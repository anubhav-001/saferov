import { motion } from "framer-motion";

const steps: Array<{ number: number; title: string; description: string }> = [
  { number: 1, title: "Create Your Profile", description: "Tell us about yourself in a safe, anonymous way" },
  { number: 2, title: "Tell Us How You Feel", description: "Share your current state and what you're going through" },
  { number: 3, title: "Get Matched with a Peer", description: "We connect you with someone who truly understands" },
  { number: 4, title: "Talk & Grow Together", description: "Start a conversation and build your safety network" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-foreground">How It </span>
            <span className="text-accent italic">Works</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg md:text-xl">
            Four simple steps to find your support network
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1 bg-accent/30 rounded-full" />

          <div className="space-y-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 items-center gap-8`}
              >
                <div className={`${i % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-2'} order-2 lg:order-none`}>
                  <div className="glass-card rounded-2xl p-6 border border-accent/20">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground">{s.description}</p>
                  </div>
                </div>
                <div className={`${i % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'} order-1 lg:order-none flex items-center justify-center`}> 
                  <div className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">
                    {s.number}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;


