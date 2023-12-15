import { TicketDto } from "../transaction.dtos"
import { transporter } from "../../../config/emailconfig";
import dotenv from 'dotenv'
import { Errors } from "../../../config/error_codes";
dotenv.config();
export const sendNotification = async (managerEmail: string, productName: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: managerEmail,
            subject: 'Advertencia de reabastecimiento',
            text: `El producto ${productName} necesita reabastecimiento urgente, se encuentra por debajo de 4 unidades.`,
        };
        console.log(mailOptions);        
        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error enviando correo de notificación');
        throw Error(Errors.ERROR_SENDING_EMAIL);
    }
}

export const sendTicket = async (payload: TicketDto, creationDate: string, totalAmount: number, costumerEmail: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: costumerEmail,
            subject: 'Gacias por tu compra en LORD OF RINGS Joyería',
            text: `Estimado/a ${payload.costumerName},
                En nombre de todo el equipo de THE LORD OR RINGS Joyería, queremos expresar nuestro más sincero
                agradecimiento por haber elegido nuestra joyería para hacer tus compras. Valoramos enormemente tu
                confianza en nosotros y estamos emocionados de haberte servido.
                Resumen de tu compra:
                • Fecha de compra: ${creationDate}
                • Artículos adquiridos: ${payload.charge.map((p: any) => `${p.name}, ${p.description || ``}: ${p.quantitySold}\n`)}
                • Total de compra: ${totalAmount}
                Esperamos verte de nuevo en nuestra tienda y ser parte de más momentos inolvidables contigo.
                Gracias por elegir THE LORD ORF RINGS Joyería. Tu satisfacción es nuestra prioridad.
                THE LORD OF RINGS Joyería`,
        };
        console.log(mailOptions);        
        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error enviando Ticket de compra');
        throw Error(Errors.ERROR_SENDING_EMAIL);
    }
}
export const sendTicketLayaway = async (payload: TicketDto, creationDate: string, totalAmount: number, costumerEmail: string) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: costumerEmail,
            subject: 'Gacias por realizar tu apartado en LORD OF RINGS Joyería',
            text: `Estimado/a ${payload.costumerName},
                En nombre de todo el equipo de THE LORD OR RINGS Joyería, queremos expresar nuestro más sincero
                agradecimiento por haber elegido nuestra joyería para hacer tus apartados. Valoramos enormemente tu
                confianza en nosotros y estamos emocionados de haberte servido.
                Resumen de tu compra:
                • Fecha de apartado: ${creationDate}
                • Artículos apartados: ${payload.charge.map((p: any) => `${p.name}, ${p.description || ``}: ${p.quantitySold}\n`)}
                • Total a pagar: ${totalAmount}
                Esperamos verte de nuevo en nuestra tienda y ser parte de más momentos inolvidables contigo.
                Gracias por elegir THE LORD ORF RINGS Joyería. Tu satisfacción es nuestra prioridad.
                THE LORD OF RINGS Joyería`,
        };
        console.log(mailOptions);        
        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Error enviando Ticket de apartado');
        throw Error(Errors.ERROR_SENDING_EMAIL);
    }
}