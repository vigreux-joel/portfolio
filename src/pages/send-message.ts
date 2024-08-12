import sendmail from "sendmail";
import validator from "validator";
import xss from "xss";

export const prerender = false;

export const POST: ({
  request,
}: {
  request: any;
}) => Promise<Response> = async ({ request }) => {
  const { name, email, message } = await request.json();
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

  const secretKey = import.meta.env.RECAPTCHA_SECRET_KEY;

  const recaptchaToken = request.headers.get("recaptcha-token");

  const responseRecaptcha = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`,
    {
      method: "post",
    },
  );

  const recaptchaData = await responseRecaptcha.json();

  if (!recaptchaData.success) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: "reCaptcha validation failed",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  } else {
    sendmail({})(
      {
        from: "no-reply@" + import.meta.env.PUBLIC_DOMAIN,
        to: import.meta.env.PUBLIC_EMAIL_RECIPIENT,
        subject: "contact",
        html: xss(message),
      },
      (err, reply) => {
        throw new Error();
      },
    );
  }

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
};
