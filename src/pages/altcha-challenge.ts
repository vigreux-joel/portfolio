import { createChallenge, randomInt } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

export const prerender = false;

export const GET: () => Promise<Response> = async () => {
  const hmacSecret = import.meta.env.ALTCHA_HMAC_KEY;

  if (!hmacSecret) {
    console.warn("ALTCHA_HMAC_KEY n'est pas configuré");
    return new Response(
      JSON.stringify({
        status: 500,
        message: "La protection anti-spam n'est pas configurée",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }

  // Le travail demandé au navigateur vaut cost x counter itérations PBKDF2,
  // soit environ 6 millions en moyenne (moins d'une seconde sur un appareil
  // récent, quelques secondes sur un mobile ancien).
  const challenge = await createChallenge({
    algorithm: "PBKDF2/SHA-256",
    cost: 2_000,
    counter: randomInt(5_000, 1_000),
    deriveKey,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    hmacSignatureSecret: hmacSecret,
  });

  return new Response(JSON.stringify(challenge), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    status: 200,
  });
};
