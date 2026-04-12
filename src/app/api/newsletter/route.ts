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

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "footer_newsletter",
          receivedAt: new Date().toISOString(),
        }),
      });
      if (!r.ok) {
        return NextResponse.json(
          { error: "Service newsletter temporairement indisponible" },
          { status: 502 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Service newsletter temporairement indisponible" },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[newsletter] (dev, pas de NEWSLETTER_WEBHOOK_URL):", email);
  } else {
    console.warn(
      "[newsletter] NEWSLETTER_WEBHOOK_URL non défini — configurez un webhook (Make, Zapier, backend) pour enregistrer :",
      email,
    );
  }

  return NextResponse.json({ ok: true });
}
