import {FormContact} from "./FormContact"
import {faComments} from "@fortawesome/pro-light-svg-icons";
import {Card, Icon} from "@udixio/ui-react";
import Obfuscate from "react-obfuscate";

export const Contact = () => {
    return <Card variant={"filled"} className="lg:flex rounded-3xl overflow-hidden">
        <div className="left flex-1 padding !pb-12 pt-8">
            <div className="flex gap-4 group rounded-xl mt-2">
                <div
                    className="transition-all duration-300 flex items-center  justify-center rounded-lg  h-12 w-12 border border-outline-variant">
                    <Icon className="h-6 w-6 fill-on-surface-variant" icon={faComments}></Icon>
                </div>
                <div><p className="text-title-small mt-0.5">Discuter avec moi</p>
                    <div className="text-on-surface-variant max-w-prose text-body-small">
                        <p className="mt-1">Je suis là pour vous aider.</p>
                        <Obfuscate
                            className="mt-4 inline-block underline-offset-4 underline !text-bold text-secondary focus-visible:text-primary hover:text-primary"
                            email={import.meta.env.PUBLIC_EMAIL_TO}
                            headers={{
                                body: `Bonjour,

Je m'appelle [Nom], et je souhaiterais vous parler d'un projet. Voici quelques détails :

Projet : [Brève description]
Objectifs : [Principaux objectifs]
Délai : [Délai souhaité]
Budget : [Budget estimé]
Je suis disponible pour en parler. Vous pouvez me contacter par email à [Votre Email] ou au [Votre Numéro].

Cordialement,

[Nom]`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="right padding bg-surface-container-low flex-2 m-2 pt-8 rounded-2xl">
            <h2 className="text-display-small max-w-prose"><span
                className="text-gradient">Restons en contact</span><br/>
                pour
                donner vie à votre projet !</h2>
            <p className="mt-4 max-w-prose">Partagez les détails de votre projet, vos idées et découvrons
                ensemble comment
                je
                peux vous
                accompagner
                dans sa réalisation.</p>
            <FormContact client:visible/>
        </div>
    </Card>
}