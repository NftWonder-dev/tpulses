import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { BUSINESS_NAME, BUSINESS_LOCATION, CONTACT_EMAIL } from "@/lib/legal";

export const metadata = {
  title: "Terms & Refund Policy | Trim Pulses",
  description:
    "Terms of sale, license and refund policy for Trim Pulses impulse responses.",
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const sections = [
  {
    title: "About these terms",
    content: (
      <p>
        These terms apply to all purchases and downloads from trimpulses.com,
        operated by {BUSINESS_NAME} ({BUSINESS_LOCATION}). By buying or
        downloading our products, you agree to these terms.
      </p>
    ),
  },
  {
    title: "Products and payment",
    content: (
      <>
        <p>
          Our products are digital impulse response (IR) files, delivered as
          downloadable ZIP archives. Prices are shown in euros.
        </p>
        <p>
          Orders are processed by our online reseller, <strong>Lemon
          Squeezy</strong>, which acts as the merchant of record. Lemon Squeezy
          handles payment, invoicing and VAT, and its own buyer terms also apply
          to the payment.
        </p>
      </>
    ),
  },
  {
    title: "Delivery and your account",
    content: (
      <>
        <p>
          After payment, you receive an email with download links, valid for 24
          hours. An account is created automatically on your first purchase,
          and you can log in at any time at{" "}
          <Link href="/account">trimpulses.com/account</Link> using the email
          address you purchased with to download your files again.
        </p>
        <p>
          Please keep a backup of your files. While we aim to keep re-downloads
          available, we cannot guarantee they will be available forever.
        </p>
      </>
    ),
  },
  {
    title: "Your license",
    content: (
      <>
        <p>
          When you buy a product, you receive a personal, non-exclusive,
          non-transferable license to use the impulse responses.
        </p>
        <p>
          <strong>You may:</strong>
        </p>
        <ul>
          <li>
            use the IRs in your own music and audio productions, including
            commercial releases, without any royalties or credit required;
          </li>
          <li>install them on any computer you personally use.</li>
        </ul>
        <p>
          <strong>You may not:</strong>
        </p>
        <ul>
          <li>
            resell, share, give away or redistribute the IR files, in their
            original or modified form;
          </li>
          <li>
            include them in sample packs, IR libraries, plugin presets or any
            product that lets others access the files;
          </li>
          <li>upload them to file-sharing services or public repositories.</li>
        </ul>
        <p>
          All rights in the impulse responses remain with {BUSINESS_NAME}.
        </p>
      </>
    ),
  },
  {
    title: "Refund policy",
    content: (
      <>
        <p>
          Because our products are digital files delivered immediately,{" "}
          <strong>
            purchases cannot be refunded once a file has been downloaded
          </strong>
          . By completing your purchase, you agree to immediate delivery of the
          digital content and acknowledge that you lose your 14-day right of
          withdrawal once the download has started.
        </p>
        <p>We will gladly offer a replacement or a full refund if:</p>
        <ul>
          <li>a file is faulty, corrupted or cannot be opened; or</li>
          <li>the product is clearly not as described on our website.</li>
        </ul>
        <p>
          To request this, write to {mail} within 14 days of your purchase,
          with your order number and a short description of the problem. We
          will first try to fix it by sending a working file. Approved refunds
          are issued through Lemon Squeezy to your original payment method.
        </p>
        <p>
          Before buying, you can try the free pack to check that our impulse
          responses work with your convolution reverb.
        </p>
      </>
    ),
  },
  {
    title: "Liability",
    content: (
      <p>
        Our products are provided as described on the website. To the extent
        permitted by law, we are not liable for indirect losses, or for issues
        caused by third-party software or hardware. Nothing in these terms
        limits your rights as a consumer under applicable law.
      </p>
    ),
  },
  {
    title: "Governing law",
    content: (
      <p>
        These terms are governed by Portuguese law. If you are a consumer, you
        also keep the protection of the mandatory laws of your country of
        residence.
      </p>
    ),
  },
  {
    title: "Contact",
    content: (
      <p>
        Questions about these terms or a purchase? Write to {mail}. See also
        our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      label="Legal"
      title="Terms & Refund Policy"
      sections={sections}
    />
  );
}
