import {Button, TextField} from "@udixio/ui";
import {useFormik} from "formik";
import {useRef} from "react";

function isValidEmail(email: string) {
    return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
}

export const FormContact = (
    {
        apiErrors = {},
    }: {
        apiErrors?: Record<string, string>
    }
) => {
    const formRef = useRef<HTMLFormElement>(null)
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        validate: (data) => {
            const errors: Record<string, string> = {}

            if (!data.name) {
                errors.name = 'Votre nom est nécessaire.'
            }
            if (!data.email) {
                errors.email = "L'email est nécessaire."
            } else if (!isValidEmail(data.email)) {
                errors.email = 'Veuillez fournir un email valide.'
            }
            if (!data.message) {
                errors.message = 'Veuillez entrer votre message.'
            }
            return errors
        },
        onSubmit: (values, formikBag) => {
            if (formRef.current !== null) {
                fetch("/send-message", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Success:', data);
                        // Traitez la réponse ici ...
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
        },
    })
    const isFormFieldInvalid = (name: keyof typeof formik.values): string => {
        let result = apiErrors[name] ?? ''
        if (formik.touched[name]) result = formik.errors[name] ?? ''
        return result
    }

    const getFormErrorMessage = (name: keyof typeof formik.values) => {
        return isFormFieldInvalid(name)
    }
    return (
        <form ref={formRef} onSubmit={formik.handleSubmit}
              className="mt-8 max-w-prose">
            <TextField
                variant={'outlined'}
                type="text"
                name="name"
                label={'Nom et prénom'}
                placeholder={'Votre prénom'}
                errorText={getFormErrorMessage('name')}
                onChange={(e) => {
                    formik.setFieldValue('name', e)
                    if (apiErrors.name) delete apiErrors.name
                }}
                supportingText={'\u00A0'}
                showSupportingText
            ></TextField>
            <TextField
                variant={'outlined'}
                type="text"
                name="email"
                label={'E-mail'}
                placeholder={'Votre e-mail'}
                errorText={getFormErrorMessage('email')}
                onChange={(e) => {
                    formik.setFieldValue('email', e)
                    if (apiErrors.email) delete apiErrors.email
                }}
                supportingText={'\u00A0'}
                showSupportingText
            ></TextField>
            <TextField
                textLine="multiLine"
                variant={'outlined'}
                type="text"
                name="message"
                label={'Message'}
                onChange={(e) => {
                    formik.setFieldValue('message', e)
                    if (apiErrors.message) delete apiErrors.message
                }}
                placeholder={'Votre message'}
                errorText={getFormErrorMessage('message')}
                supportingText="Parlez-nous un peu de votre projet"
                showSupportingText
            ></TextField>
            <Button type="submit" className="mt-8" label="Envoyer le message"/>
        </form>
    )
}