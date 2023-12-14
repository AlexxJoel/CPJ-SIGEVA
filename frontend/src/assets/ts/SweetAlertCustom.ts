import Swal,  { type SweetAlertIcon} from 'sweetalert2';

export default class SweetAlertCustom {
    static success(title: string, text: string) {
        return  Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    }

    static successTime(title: string, text: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
        });
    }

    static error(title: string, text: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }

    static errorTime(title: string, text: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
        });
    }

    static warning(title: string, text: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            confirmButtonText: 'Ok'
        });
    }

    static info(title: string, text: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            confirmButtonText: 'Ok',
            cancelButtonText: 'Cancelar'
        })
    }

    static question(title: string, text: string, icon:SweetAlertIcon, confirmButtonText: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
        });
    }

    static custom(title: string, text: string, icon: any, confirmButtonText: string) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: confirmButtonText
        });
    }

    static loading(title?: string, text?: string) {

        if (!title) title = 'Cargando';
        if (!text) text = 'Por favor espere...';

        return Swal.fire({
            title: title,
            text: text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    }

    static close() {
        Swal.close();
    }
}