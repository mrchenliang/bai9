import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p className="kicker">酒 · 404</p>
      <h1>
        Page Not Found <span className="zh-inline">查无此页</span>
      </h1>
      <p className="sub">That bottle or distillery page is not in the archive.</p>
      <p>
        <Link className="btn" href="/">
          Back to collection
        </Link>
      </p>
    </>
  );
}
