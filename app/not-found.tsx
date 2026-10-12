import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        Let’s get you
        <br />
        back on track.
      </h1>
      <Link className="button amber" href="/">
        VIEW EQUIPMENT ↗
      </Link>
    </section>
  );
}
