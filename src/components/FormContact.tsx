import {Button, Snackbar, TextField} from "@udixio/ui-react";
import {useFormik} from "formik";
import {useEffect, useRef, useState} from "react";
import type {WidgetAttributes, WidgetMethods} from "altcha/types";

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
    const [message, setMessage] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
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
            }
            return errors;
        },
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await loadAltcha();
                const altcha = await altchaRef.current?.verify();

                if (!altcha?.payload) {
                    setMessage(
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
                    setMessage(
                        "Merci pour votre message. Je reviendrai vers vous dans les plus brefs délais.",
                    );
                    formik.setFieldValue("message", "");
                    formik.setTouched({...formik.touched, message: false});
                } else if (data.errors) {
                    const newErrors: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([key, error]) => {
                        if (typeof error === "string") {
                            newErrors[key] = error;
                        }
                    });
                    formik.setErrors(newErrors);
                } else {
                    setMessage(data.message);
                }
            } catch (error) {
                console.error("Error:", error);
                setMessage(
                    "L'envoi a échoué, merci de réessayer ou de m'écrire directement par e-mail.",
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
                label={"Nom & prénom"}
                placeholder={"Votre nom et votre prénom"}
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
                supportingText="Présentez-moi votre demande en quelques mots."
                showSupportingText
            ></TextField>
            <altcha-widget
                ref={altchaRef}
                configuration={altchaConfiguration}
                suppressHydrationWarning
            ></altcha-widget>
            <p className={"text-body-small text-outline mt-8 mb-4"}>
                Ce formulaire est protégé par{" "}
                <a className={"text-secondary"} href="https://altcha.org">
                    ALTCHA
                </a>
                , une alternative aux CAPTCHA qui ne dépose aucun traceur et
                n'envoie aucune donnée à un service tiers.
            </p>
            <Button
                loading={isSubmitting}
                type="submit"
                label="Envoyer le message"
            />
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
