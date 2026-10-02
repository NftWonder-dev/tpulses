import LegalLayout from "@/components/legal/LegalLayout";
import { BUSINESS_NAME, BUSINESS_LOCATION, CONTACT_EMAIL } from "@/lib/legal";

export const metadata = {
  title: "Privacy Policy | Trim Pulses",
  description: "How Trim Pulses collects, uses and protects your personal data.",
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const sections = [
  {
    title: "Who we are",
    content: (
      <>
        <p>
          {BUSINESS_NAME} ({BUSINESS_LOCATION}) sells digital impulse response
          packs through trimpulses.com. We are responsible for the personal data
          described in this policy. For any privacy question or request, contact
          us at {mail}.
        </p>
      </>
    ),
  },
  {
    title: "What data we collect",
    content: (
      <>
        <p>We only collect what we need to sell and deliver your files:</p>
        <ul>
          <li>
            <strong>Purchase details:</strong> your name, email address, the
            products you bought, the amount paid and the order date. These come
            from our payment provider when you complete a purchase.
          </li>
          <li>
            <strong>Account details:</strong> your email address and, if you
            change it, the name shown in your account.
          </li>
          <li>
            <strong>Technical data:</strong> our hosting provider automatically
            records basic request information (such as IP address, browser type
            and pages visited) in server logs, used for security and to keep the
            site running.
          </li>
        </ul>
        <p>
          We never see or store your card or bank details. Payments are handled
          entirely by Lemon Squeezy.
        </p>
        <p>
          Downloading the free pack does not require any personal data.
        </p>
      </>
    ),
  },
  {
    title: "How we use your data",
    content: (
      <>
        <ul>
          <li>
            <strong>To deliver your purchase:</strong> sending your download
            links and order confirmation (necessary to perform our contract
            with you).
          </li>
          <li>
            <strong>To run your account:</strong> creating it automatically on
            your first purchase, sending login links, and letting you
            re-download your files (contract).
          </li>
          <li>
            <strong>To keep the site secure and working</strong> (our legitimate
            interest).
          </li>
          <li>
            <strong>To tell you about new releases or promotions</strong> similar
            to what you bought (our legitimate interest). You can opt out at any
            time by replying to any of these emails or writing to {mail}, and we
            will stop immediately.
          </li>
        </ul>
        <p>We do not sell your data and we do not share it for advertising.</p>
      </>
    ),
  },
  {
    title: "Services we use",
    content: (
      <>
        <p>
          We rely on trusted providers that process data on our behalf, only for
          the purposes above:
        </p>
        <ul>
          <li>
            <strong>Lemon Squeezy</strong> — payments, invoices and VAT. Lemon
            Squeezy acts as the merchant of record for your purchase and handles
            your payment data under its own privacy policy.
          </li>
          <li>
            <strong>Vercel</strong> — website hosting.
          </li>
          <li>
            <strong>Sanity</strong> — stores product information and order
            records.
          </li>
          <li>
            <strong>Amazon Web Services (AWS)</strong> — stores and delivers the
            product files.
          </li>
          <li>
            <strong>Resend</strong> — sends order and login emails.
          </li>
        </ul>
        <p>
          Some of these providers may process data outside the European Economic
          Area. Where that happens, they protect it with safeguards recognised
          under EU law, such as the European Commission&apos;s Standard
          Contractual Clauses.
        </p>
      </>
    ),
  },
  {
    title: "Cookies",
    content: (
      <>
        <p>
          We use a single cookie, and only when you log in to your account: a
          secure login cookie that keeps you signed in for up to 30 days. It is
          strictly necessary for the account to work, so it does not require
          consent. We do not use advertising or tracking cookies.
        </p>
        <p>
          The checkout page is provided by Lemon Squeezy, which may set its own
          cookies as described in its privacy policy.
        </p>
      </>
    ),
  },
  {
    title: "How long we keep your data",
    content: (
      <>
        <p>
          We keep your order records for as long as your account exists, so you
          can always re-download what you bought. Server logs are kept for a
          short period by our hosting provider. Invoices and tax records are
          kept by Lemon Squeezy as required by law.
        </p>
        <p>
          If you ask us to delete your data, we will remove your order records
          and account. Please note you will then no longer be able to
          re-download your purchases from your account.
        </p>
      </>
    ),
  },
  {
    title: "Your rights",
    content: (
      <>
        <p>Under the GDPR, you have the right to:</p>
        <ul>
          <li>access the personal data we hold about you;</li>
          <li>correct inaccurate data (you can change your name in your account at any time);</li>
          <li>ask us to delete your data;</li>
          <li>object to marketing emails or other processing based on our legitimate interest;</li>
          <li>receive your data in a portable format.</li>
        </ul>
        <p>
          To exercise any of these rights, write to {mail}. We will reply within
          one month. If you are unhappy with how we handle your data, you can
          also complain to the Portuguese data protection authority, the
          Comissão Nacional de Proteção de Dados (
          <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">
            cnpd.pt
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy, for example when we add a new service. The
        date at the top of this page shows when it was last changed.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Privacy Policy"
      intro="We keep this simple: we only collect the data needed to sell you impulse responses and let you download them, and we never sell it."
      sections={sections}
    />
  );
}
