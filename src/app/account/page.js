import { cookies } from "next/headers";
import AccountLoginForm from "@/components/account/AccountLoginForm";
import AccountDashboard from "@/components/account/AccountDashboard";
import { getSessionEmail } from "@/lib/session";
import { getOrdersByEmail, getCustomerName } from "@/lib/sanityWrite";

export const dynamic = "force-dynamic";

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

export default async function AccountPage({ searchParams }) {
  const email = getSessionEmail(cookies());
  const orders = email ? await getOrdersByEmail(email) : null;
  const loggedIn = Boolean(email && orders?.length);
  // Name the customer set themselves wins; otherwise use the name from their latest order.
  const name = loggedIn
    ? (await getCustomerName(email)) || orders[0]?.customerName || ""
    : "";

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

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loggedIn ? (
            <AccountDashboard email={email} name={name} orders={orders} />
          ) : (
            <AccountLoginForm linkExpired={searchParams?.error === "expired"} />
          )}
        </div>
      </section>

      {/* Info blocks (only before login) */}
      {!loggedIn && (
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
      )}
    </main>
  );
}
