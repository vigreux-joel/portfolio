import { Button, TextField } from "@udixio/ui";
import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

function isValidEmail(email: string) {
  return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
}

const ButtonCaptcha = ({ setRecaptchaToken }: { setRecaptchaToken: any }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("yourAction");
    setRecaptchaToken(token);
  }, [executeRecaptcha]);

  return (
    <Button
      onClick={() => handleReCaptchaVerify()}
      type="submit"
      className="mt-8"
      label="Envoyer le message"
    />
  );
};

export const FormContact = ({
  apiErrors = {},
}: {
  apiErrors?: Record<string, string>;
}) => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
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
            console.log("Success:", data);
            formik.setFieldValue("message", "");
            // Traitez la réponse ici ...
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    },
  });
  const isFormFieldInvalid = (name: keyof typeof formik.values): string => {
    let result = apiErrors[name] ?? "";
    if (formik.touched[name]) result = formik.errors[name] ?? "";
    return result;
  };

  const getFormErrorMessage = (name: keyof typeof formik.values) => {
    return isFormFieldInvalid(name);
  };
  return (
    <form
      ref={formRef}
      onSubmit={formik.handleSubmit}
      className="mt-8 max-w-prose"
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
          if (apiErrors.name) delete apiErrors.name;
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
          if (apiErrors.email) delete apiErrors.email;
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
          if (apiErrors.message) delete apiErrors.message;
        }}
        placeholder={"Votre message"}
        errorText={getFormErrorMessage("message")}
        supportingText="Parlez-nous un peu de votre projet"
        showSupportingText
      ></TextField>
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.PUBLIC_RECAPTCHA_KEY}
      >
        <ButtonCaptcha setRecaptchaToken={setRecaptchaToken} />
      </GoogleReCaptchaProvider>
    </form>
  );
};
