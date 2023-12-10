import { TicketDto } from "../transaction.dtos"
import { transporter } from "../../../config/emailconfig";
import dotenv from 'dotenv'
import { Errors } from "../../../config/error_codes";
dotenv.config();
export const sendNotification = (managerEmail: string, productName: string) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: managerEmail,
        subject: 'Advertencia de reabastecimiento',
        text: `El producto ${productName} necesita reabastecimiento urgente, se encuentra por debajo de 4 unidades.`,
    };
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo de notificación:', error.message);
            throw Error(Errors.ERROR_SENDING_EMAIL);
        } else {
            console.log('Correo electrónico de notificación enviado con éxito:', info.response);
        }
    });
}

export const sendTicket = (payload: TicketDto, creationDate: string, totalAmount: number, costumerEmail: string) => {
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
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar ticket:', error.message);
            throw Error(Errors.ERROR_SENDING_EMAIL);
        } else {
            console.log('Correo electrónico de ticket enviado con éxito:', info.response);
        }
    });
}
export const sendTicketLayaway = (payload: TicketDto, creationDate: string, totalAmount: number, costumerEmail: string) => {
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
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar ticket:', error.message);
            throw Error(Errors.ERROR_SENDING_EMAIL);
        } else {
            console.log('Correo electrónico de ticket enviado con éxito:', info.response);
        }
    });
}