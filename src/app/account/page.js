import AccountLoginForm from "@/components/account/AccountLoginForm";

export const metadata = {
  title: "My Account | Trim Pulses",
  description:
    "Log in to your Trim Pulses account to access your purchased impulse responses.",
};

const infoBlocks = [
  {
    title: "Your account",
    text: "Your Trim Pulses account holds every collection you've purchased from us. We create it automatically on your first purchase, so there's nothing to sign up for. Log in at any time to re-download your files and update your details.",
  },
  {
    title: "No password needed",
    text: "Enter the email address you used at checkout and we'll send you a secure login link. Click it and you're in. There's no password to remember or reset.",
  },
  {
    title: "Can't log in?",
    text: "Make sure you use the same email address you purchased with, and check your spam folder for the login email. Still stuck? Reply to your purchase confirmation email and we'll help you out.",
  },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen pt-32 pb-24">
      {/* Header */}
      <section className="border-b border-white/5 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-space-mono text-cyan-400 text-xs uppercase tracking-widest mb-4">
            Customer Area
          </h3>
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold tracking-tighter">
            My Trim Pulses Account
          </h1>
        </div>
      </section>

      {/* Login */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <AccountLoginForm />
        </div>
      </section>

      {/* Info blocks */}
      <section className="border-t border-white/5 pt-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {infoBlocks.map((block) => (
            <div key={block.title}>
              <h2 className="font-space-grotesk text-2xl font-bold mb-4">
                {block.title}
              </h2>
              <p className="text-slate-400 leading-relaxed">{block.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
