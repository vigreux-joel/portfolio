import { Button, Snackbar, TextField } from "@udixio/ui";
import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

function isValidEmail(email: string) {
  return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
}

const ButtonCaptcha = ({
  tokenRecaptcha,
  setRecaptchaToken,
  className,
  loading,
}: {
  loading: boolean;
  className?: string;
  tokenRecaptcha: string | null;
  setRecaptchaToken: any;
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.warn("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("yourAction");
    setRecaptchaToken(token);
  }, [executeRecaptcha]);

  return (
    <Button
      className={className}
      loading={loading}
      onClick={(e) => {
        if (!tokenRecaptcha) {
          e.preventDefault();
          handleReCaptchaVerify();
        }
      }}
      type="submit"
      label="Envoyer le message"
    />
  );
};

export const FormContact = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: (data) => {
      const errors: Record<string, string> = {};

      if (!data.name) {
        errors.name = "Votre nom est nécessaire.";
      }
      if (!data.email) {
        errors.email = "L'email est nécessaire.";
      } else if (!isValidEmail(data.email)) {
        errors.email = "Veuillez fournir un email valide.";
      }
      if (!data.message) {
        errors.message = "Veuillez entrer votre message.";
      }
      return errors;
    },
    onSubmit: async (values, formikBag) => {
      setIsSubmitting(true);
      if (formRef.current !== null && recaptchaToken !== null) {
        fetch("/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "recaptcha-token": recaptchaToken,
          },
          body: JSON.stringify(values),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 200) {
              setMessage(
                "Merci pour votre message. Je reviendrai vers vous dans les plus brefs délais.",
              );
              formik.setFieldValue("message", "");
            } else {
              if (data.errors) {
                const newErrors: Record<string, string> = {};
                Object.entries(data.errors).forEach(([key, error]) => {
                  if (typeof error === "string") {
                    newErrors[key] = error;
                  }
                });
                formik.setErrors(newErrors);
              } else {
                console.log("Error:", data);
                setMessage(data.message);
              }
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        console.warn("Recaptcha token not available");
      }
    },
  });
  const isFormFieldInvalid = (name: keyof typeof formik.values): string => {
    if (formik.touched[name]) return formik.errors[name] ?? "";
    return "";
  };

  useEffect(() => {
    if (recaptchaToken) formik.handleSubmit();
  }, [recaptchaToken]);

  const getFormErrorMessage = (name: keyof typeof formik.values) => {
    return isFormFieldInvalid(name);
  };
  return (
    <form
      ref={formRef}
      onSubmit={formik.handleSubmit}
      className="mt-8 max-w-prose relative"
    >
      <TextField
        variant={"outlined"}
        type="text"
        name="name"
        value={formik.values.name}
        label={"Nom et prénom"}
        placeholder={"Votre prénom"}
        errorText={getFormErrorMessage("name")}
        onChange={(e) => {
          formik.setFieldValue("name", e);
        }}
        supportingText={"\u00A0"}
        showSupportingText
      ></TextField>
      <TextField
        variant={"outlined"}
        type="text"
        name="email"
        label={"E-mail"}
        value={formik.values.email}
        placeholder={"Votre e-mail"}
        errorText={getFormErrorMessage("email")}
        onChange={(e) => {
          formik.setFieldValue("email", e);
        }}
        supportingText={"\u00A0"}
        showSupportingText
      ></TextField>
      <TextField
        textLine="multiLine"
        variant={"outlined"}
        type="text"
        name="message"
        label={"Message"}
        value={formik.values.message}
        onChange={(e) => {
          formik.setFieldValue("message", e);
        }}
        placeholder={"Votre message"}
        errorText={getFormErrorMessage("message")}
        supportingText="Parlez-nous un peu de votre projet"
        showSupportingText
      ></TextField>
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.PUBLIC_RECAPTCHA_KEY}
      >
        <p className={"text-body-small text-outline mt-8 mb-4"}>
          Ce site est protégé par reCAPTCHA et la{" "}
          <a
            className={"text-secondary"}
            href="https://policies.google.com/privacy"
          >
            politique de confidentialité
          </a>{" "}
          et les{" "}
          <a
            className={"text-secondary"}
            href="https://policies.google.com/terms"
          >
            conditions d’utilisation
          </a>{" "}
          de Google s’appliquent.
        </p>
        <ButtonCaptcha
          tokenRecaptcha={recaptchaToken}
          setRecaptchaToken={setRecaptchaToken}
          loading={isSubmitting}
        />
      </GoogleReCaptchaProvider>
      {message && (
        <Snackbar
          key={message}
          className={"!absolute -bottom-20"}
          duration={5000}
          supportingText={message}
          onClose={() => setMessage(null)}
        />
      )}
    </form>
  );
};
