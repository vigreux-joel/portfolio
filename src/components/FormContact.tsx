import {Button, Icon, TextField} from "@udixio/ui-react";
import {useFormik} from "formik";
import {useEffect, useRef, useState} from "react";
import {iCheckCircle} from "@udixio/icons-outlined-400/check_circle";
import type {WidgetAttributes, WidgetMethods} from "altcha/types";

// Le serveur refuse les messages de moins de 20 caractères. On applique la même
// règle ici, sinon l'envoi part, calcule la preuve de travail, puis échoue.
const MESSAGE_MIN_LENGTH = 20;

const contactEmail = import.meta.env.PUBLIC_EMAIL_TO || "contact@vigreux-joel.fr";

function isValidEmail(email: string) {
    return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
}

const altchaConfiguration = JSON.stringify({
    auto: "off",
    challenge: "/altcha-challenge",
    display: "invisible",
    name: "altcha",
});

export const FormContact = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const altchaRef = useRef<WidgetAttributes & WidgetMethods & HTMLElement>(null);

    // Le widget est un composant web chargé uniquement côté client.
    const loadAltcha = async () => {
        await import("altcha");
        await customElements.whenDefined("altcha-widget");
    };

    useEffect(() => {
        loadAltcha();
    }, []);

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
            } else if (data.message.trim().length < MESSAGE_MIN_LENGTH) {
                errors.message = `Encore un peu de contexte, ${MESSAGE_MIN_LENGTH} caractères minimum.`;
            }
            return errors;
        },
        onSubmit: async (values) => {
            setIsSubmitting(true);
            setError(null);
            try {
                await loadAltcha();
                const altcha = await altchaRef.current?.verify();

                if (!altcha?.payload) {
                    setError(
                        "La vérification anti-spam a échoué, merci de réessayer dans un instant.",
                    );
                    return;
                }

                const response = await fetch("/send-message", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({...values, altcha: altcha.payload}),
                });
                const data = await response.json();

                if (data.status === 200) {
                    setIsSent(true);
                } else if (data.errors) {
                    const newErrors: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([key, error]) => {
                        if (typeof error === "string") {
                            newErrors[key] = error;
                        }
                    });
                    formik.setErrors(newErrors);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                console.error("Error:", err);
                setError(
                    "L'envoi a échoué, merci de réessayer ou de m'écrire directement.",
                );
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    const isFormFieldInvalid = (name: keyof typeof formik.values): string => {
        if (formik.touched[name]) return formik.errors[name] ?? "";
        return "";
    };

    const getFormErrorMessage = (name: keyof typeof formik.values) => {
        return isFormFieldInvalid(name);
    };

    if (isSent) {
        return (
            <div className="mt-8 flex items-start gap-4" role="status">
                <Icon
                    icon={iCheckCircle}
                    className="size-7 shrink-0 text-primary mt-0.5"
                />
                <div>
                    <p className="text-title-large">Message envoyé</p>
                    <p className="mt-2 text-body-medium text-on-surface-variant max-w-prose">
                        Je vous réponds sous 48 h ouvrées à l'adresse que vous avez
                        indiquée. Sans nouvelle de ma part, écrivez-moi à{" "}
                        <a
                            className="text-secondary underline underline-offset-4"
                            href={`mailto:${contactEmail}`}
                        >
                            {contactEmail}
                        </a>
                        .
                    </p>
                    <button
                        type="button"
                        className="mt-4 text-label-large text-secondary underline underline-offset-4"
                        onClick={() => {
                            formik.resetForm();
                            setIsSent(false);
                        }}
                    >
                        Envoyer un autre message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit} className="mt-8 max-w-prose relative">
            <TextField
                variant={"outlined"}
                type="text"
                name="name"
                autoComplete="name"
                value={formik.values.name}
                label={"Nom & prénom"}
                placeholder={"Votre nom et votre prénom"}
                errorText={getFormErrorMessage("name")}
                onChange={(e: string) => {
                    formik.setFieldValue("name", e);
                }}
                onBlur={() => formik.setFieldTouched("name", true)}
                supportingText={"\u00A0"}
                showSupportingText
            ></TextField>
            <TextField
                variant={"outlined"}
                type="email"
                name="email"
                autoComplete="email"
                label={"E-mail"}
                value={formik.values.email}
                placeholder={"Votre e-mail"}
                errorText={getFormErrorMessage("email")}
                onChange={(e: string) => {
                    formik.setFieldValue("email", e);
                }}
                onBlur={() => formik.setFieldTouched("email", true)}
                supportingText={"\u00A0"}
                showSupportingText
            ></TextField>
            <TextField
                multiline
                variant={"outlined"}
                type="text"
                name="message"
                label={"Message"}
                value={formik.values.message}
                onChange={(e: string) => {
                    formik.setFieldValue("message", e);
                }}
                onBlur={() => formik.setFieldTouched("message", true)}
                placeholder={"Votre message"}
                errorText={getFormErrorMessage("message")}
                supportingText="Le contexte, ce qui existe déjà et ce que vous cherchez à obtenir."
                showSupportingText
            ></TextField>
            <altcha-widget
                ref={altchaRef}
                configuration={altchaConfiguration}
                suppressHydrationWarning
            ></altcha-widget>

            {error && (
                <p
                    role="alert"
                    className="mt-6 rounded-2xl bg-error-container p-4 text-body-medium text-on-error-container"
                >
                    {error}
                </p>
            )}

            <p className={"text-body-small text-outline mt-8 mb-4"}>
                Vos coordonnées servent uniquement à vous répondre. Ce formulaire est
                protégé par{" "}
                <a className={"text-secondary"} href="https://altcha.org">
                    ALTCHA
                </a>
                , une alternative aux CAPTCHA qui ne dépose aucun traceur et n'envoie
                aucune donnée à un service tiers.
            </p>
            {/* `buttons` passe le CTA en pleine largeur sous 400px, comme partout ailleurs. */}
            <div className="buttons !mt-0">
                <Button
                    loading={isSubmitting}
                    type="submit"
                    label="Envoyer le message"
                />
            </div>
        </form>
    );
};
