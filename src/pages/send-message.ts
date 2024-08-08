export const prerender = false;

export const POST: ({
  request,
}: {
  request: any;
}) => Promise<Response> = async ({ request }) => {
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
