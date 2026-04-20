import { NextResponse } from "next/server";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 });
  }

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  const marketingUrl = apiBase.includes("/api/v1")
    ? `${apiBase}/marketing/newsletter/subscriptions`
    : `${apiBase}/api/v1/marketing/newsletter/subscriptions`;

  try {
    const r = await fetch(marketingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "footer_newsletter",
      }),
    });

    const payload = (await r.json().catch(() => ({}))) as { message?: string; error?: string };
    if (!r.ok) {
      return NextResponse.json(
        { error: payload.error || payload.message || "Service newsletter temporairement indisponible" },
        { status: r.status >= 400 && r.status < 600 ? r.status : 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: payload.message || "Merci ! Vous êtes inscrit·e à la newsletter.",
    });
  } catch {
    return NextResponse.json(
      { error: "Service newsletter temporairement indisponible" },
      { status: 502 },
    );
  }
}

export async function DELETE(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 });
  }

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");
  const marketingUrl = apiBase.includes("/api/v1")
    ? `${apiBase}/marketing/newsletter/unsubscribe`
    : `${apiBase}/api/v1/marketing/newsletter/unsubscribe`;

  try {
    const r = await fetch(marketingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = (await r.json().catch(() => ({}))) as { message?: string; error?: string };
    if (!r.ok) {
      return NextResponse.json(
        { error: payload.error || payload.message || "Service de desabonnement indisponible" },
        { status: r.status >= 400 && r.status < 600 ? r.status : 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      message: payload.message || "Votre desabonnement a bien ete pris en compte.",
    });
  } catch {
    return NextResponse.json(
      { error: "Service de desabonnement indisponible" },
      { status: 502 },
    );
  }
}
