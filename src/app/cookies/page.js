import LegalLayout from "@/components/legal/LegalLayout";
import { BUSINESS_NAME, CONTACT_EMAIL } from "@/lib/legal";

export const metadata = {
  title: "Cookie Policy | Trim Pulses",
  description: "The cookies Trim Pulses uses and how to control them.",
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const sections = [
  {
    title: "What cookies are",
    content: (
      <p>
        Cookies are small text files a website stores in your browser so it can
        remember something between pages or visits, such as the fact that you
        are logged in.
      </p>
    ),
  },
  {
    title: "Cookies we use",
    content: (
      <>
        <p>
          {BUSINESS_NAME} only uses cookies that are strictly necessary for the
          site to work, so they do not require consent:
        </p>
        <ul>
          <li>
            <strong>tp_session</strong> — keeps you logged in to your account.
            Set only when you log in, lasts up to 30 days, and cannot be read by
            page scripts (httpOnly).
          </li>
          <li>
            <strong>tp_admin_auth</strong> — keeps the site administrator logged
            in to the admin area. Set only for the administrator, never for
            visitors, lasts up to 8 hours (httpOnly).
          </li>
        </ul>
        <p>
          The site also uses strictly necessary browser storage: localStorage to
          remember your cart, and sessionStorage for temporary site access
          during development. Neither is used for tracking.
        </p>
      </>
    ),
  },
  {
    title: "Third parties",
    content: (
      <>
        <p>
          Checkout is handled by Lemon Squeezy, which may set cookies needed for
          payment on its own pages, as described in its{" "}
          <a
            href="https://www.lemonsqueezy.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>
          .
        </p>
        <p>
          YouTube videos are embedded in privacy-enhanced mode and set no
          cookies until you play them.
        </p>
      </>
    ),
  },
  {
    title: "No tracking",
    content: (
      <p>
        We do not use advertising or tracking cookies, and we do not use
        analytics cookies.
      </p>
    ),
  },
  {
    title: "Controlling cookies",
    content: (
      <p>
        You can view, block or delete cookies at any time in your browser
        settings. If you block the login cookie, you will not be able to stay
        logged in to your account. For any question about cookies, contact us at{" "}
        {mail}.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Cookie Policy"
      intro="We only use the cookies needed to keep you logged in. No advertising, tracking or analytics cookies."
      sections={sections}
    />
  );
}
