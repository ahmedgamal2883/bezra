import Link from 'next/link';

// Footer link to "About the data". Uses the footer's own text style (.foot), underlined so it reads as a link.
export default function AboutLink() {
  return (
    <>
      {' '}
      <Link href="/about" style={{ color: 'var(--ink2)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        About the data
      </Link>
    </>
  );
}
