import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p className="kicker">酒</p>
      <h1>没有这一页</h1>
      <p className="en-title">That page is not in the archive.</p>
      <p>
        <Link className="btn" href="/">
          回到藏品
        </Link>
      </p>
    </>
  );
}
