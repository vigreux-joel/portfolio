import validator from "validator";
import nodemailer from "nodemailer";
import xss from "xss";
import { verifySolution } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

export const prerender = false;

export const POST: ({
  request,
}: {
  request: any;
}) => Promise<Response> = async ({ request }) => {
  const { name, email, message, altcha } = await request.json();
  let errors: Record<string, string> = {};

  if (!name) errors["name"] = "Veuillez fournir un nom";
  if (!email) errors["email"] = "Veuillez fournir un email";
  if (!message) errors["message"] = "Veuillez fournir un message";
  if (email && !validator.isEmail(email)) {
    errors["email"] = "Veuillez fournir un email valide";
  }
  if (message && !validator.isLength(message, { min: 20 })) {
    errors["message"] = "Votre message doit contenir au moins 20 caractères";
  }
  if (Object.keys(errors).length > 0) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "Il y a des erreurs dans votre requête",
        errors: errors,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }

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

  const altchaError = new Response(
    JSON.stringify({
      status: 400,
      message: "La vérification anti-spam a échoué, veuillez réessayer",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 400,
    },
  );

  let payload: { challenge?: any; solution?: any };
  try {
    payload = JSON.parse(atob(altcha));
  } catch {
    return altchaError;
  }

  if (!payload.challenge || !payload.solution) {
    return altchaError;
  }

  const altchaResult = await verifySolution({
    challenge: payload.challenge,
    solution: payload.solution,
    deriveKey,
    hmacSignatureSecret: hmacSecret,
  });

  if (!altchaResult.verified) {
    return altchaError;
  } else {
    let transporter = nodemailer.createTransport({
      host: import.meta.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: import.meta.env.EMAIL_FROM,
        pass: import.meta.env.EMAIL_PASSWORD,
      },
    });
    let mailOptions = {
      from: import.meta.env.EMAIL_FROM,
      to: import.meta.env.PUBLIC_EMAIL_TO,
      subject: "contact",
      html: `
        <h1>Nouveau message de ${xss(name)}</h1>
        <p>
            Nom: ${xss(name)}<br>
            Email: ${xss(email)}<br>
            Message: ${xss(message)}
        </p>
    `,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email envoyé avec succès !");
      return new Response(
        JSON.stringify({
          status: 200,
          message: "success",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        },
      );
    } catch (err) {
      console.warn('Une erreur est survenue lors de l"envoi de l"email', err);
    }
  }
  return new Response(
    JSON.stringify({
      status: 400,
      message: "Une erreur est survenue lors de l'envoi de l'email",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 400,
    },
  );
};
