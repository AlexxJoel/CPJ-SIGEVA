import type { AxiosRequestConfig } from "axios";
import AxiosClient from "./axios";
import router from "../router";

//interceptor que manda el token en todas las peticiones
AxiosClient.interceptors.request.use(
    function (config) {
        const auth_token = localStorage.token;
        if (auth_token !== undefined) {
            if (config.url?.includes("change-password") || !config.url!.includes("auth")) {
                config.headers!.Authorization = `Bearer ${auth_token}`
            }
        }
        return config;
    },
    function (err) {
        return Promise.reject(err);
    }
);
//interceptor para manejo de errores
AxiosClient.interceptors.response.use(
    (response) => {
        if (response.status === 200 || response.status === 201) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    async (error) => {
        if (!error.response) {
            //   Vue.swal({
            //     title: "El servidor no responde",
            //     text: "Sin respuesta del servidor",
            //     icon: "error",
            //     confirmButtonColor: "#ddae23bb",
            //     showConfirmButton: false,
            //     allowOutsideClick: false,
            //     allowEscapeKey: false,
            //   });
            return Promise.reject(error);
        }
        if (error.response.status) {
            switch (error.response.status) {
                case 400: {
                    const { message } = error.response.data;
                    if (error.response.data.message) {
                        let messageAlert = "";
                        let titleAlert = "";
                        // Agregar swtich con los mensajes genéricos
                        switch (message) {
                            case "Missing fields":
                                messageAlert = "Credenciales incorrectas";
                                titleAlert = "Usuario y/o contraseña erróneos";
                                break;
                            case "Incorrect credentials":
                                messageAlert = "Credenciales incorrectas";
                                titleAlert = "Usuario y/o contraseña erróneos";
                                break;
                            case "Review request":
                                messageAlert = "Fallo en el sistema";
                                titleAlert = "Algo falló en la última operación realizada";
                                break;
                            case "Account blocked":
                                messageAlert = "La cuenta está bloqueada";
                                titleAlert =
                                    "Ha fallado en ingresar por lo que se bloqueado la cuenta por seguridad";
                                break;
                            case "empty fields":
                                messageAlert = "No puede haber campos vacios";
                                titleAlert =
                                    "Asegurese de que los campos obligatorios no se encuentren vacios";
                                break;
                            case "Duplicate skill":
                                messageAlert = "Esta habilidad ya se encuentra registrada";
                                titleAlert = "No puede registrar dos veces la misma habilidad";
                                break;
                            case "Invalid Commercial Name":
                                messageAlert = "Nombre incorrecto";
                                titleAlert = "Nombre de la empresa invalido";
                                break;
                            case "Invalid street":
                                messageAlert = "Calle incorrecta";
                                titleAlert = "Nombre de la calle invalida";
                                break;
                            case "Invalid Colony":
                                messageAlert = "Colonia Incorrecta";
                                titleAlert = "Nombre de la colonia invalida";
                                break;
                            case "Invalid Town Delegation City":
                                messageAlert = "Pueblo/Distrito/Ciudad incorrecta";
                                titleAlert = "Nombre del campo invalido";
                                break;
                            case "Invalid Company Size":
                                messageAlert = "Tamaño de la empresa invalido";
                                titleAlert = "Seleccion invalida";
                                break;
                            case "Invalid Email":
                                messageAlert = "Correo electronico invalido";
                                titleAlert = "Correo electronico incorrecto";
                                break;
                            case "Invalid Company Activity":
                                messageAlert = "Giro de la empresa invalido";
                                titleAlert = "Giro de la empresa incorrecto";
                                break;
                            case "Invalid State":
                                messageAlert = "Estado invalido";
                                titleAlert = "Nombre del estado incorrecto";
                                break;
                            case "Invalid RFC":
                                messageAlert = "RFC invalido";
                                titleAlert = "Formato del RFC incorrecto";
                                break;
                            case "Invalid ID":
                                messageAlert = "ID invalido";
                                titleAlert = "ID invalido";
                                break;
                            case "Invalid Link":
                                messageAlert = "Link invalido";
                                titleAlert = "Formato del Link incorrecto";
                                break;
                            case "Duplicate RFC":
                                messageAlert = "RFC duplicado";
                                titleAlert = "Ya existe este RFC enlazado a una cuenta";
                                break;
                            case "Duplicate Email":
                                messageAlert = "Correo duplicado";
                                titleAlert = "Ya existe este Correo enlazado a una cuenta";
                                break;
                            case "Duplicate EnterpriseID":
                                messageAlert = "Solicitud en proceso";
                                titleAlert =
                                    "Ya hay una solicitud de cambio de informacion en proceso, te pedimos paciencia";
                                break;
                            case "Invalid Full Name":
                                messageAlert = "Nombre completo invalido";
                                titleAlert = "Formato del nombre completo incorrecto";
                                break;
                            case "Invalid Position":
                                messageAlert = "Cargo de responsable invalido";
                                titleAlert = "Nombre del cargo de responsable incorrecto";
                                break;
                            case "Invalid Logo":
                                messageAlert = "Imagen Invalida";
                                titleAlert = `Solo permite imagenes en formato "PNG","JPG" "JPEG"`;
                                break;
                            case "Not postulation registered":
                                messageAlert = "Sin postulaciones";
                                titleAlert = `No hay postulaciones registradas`;
                                break;
                            case "Invalid Phone Number":
                                messageAlert = "Numero telefonico invalido";
                                titleAlert = `Formato del numero telefonico incorrecto`;
                                break;
                        }
                        if (message !== "Review request") {
                            //   Vue.swal(messageAlert, titleAlert, "warning");
                        }
                        break;
                    }
                    if (message !== "Review request") {
                        // Vue.swal("ERROR", error.response.data.message, "error");
                    }
                    break;
                }
                case 401: {
                    //   Vue.swal(
                    //     "Sesión expirada",
                    //     "Por seguridad tu sesión se ha cerrado, vuelve a iniciar sesión",
                    //     "warning"
                    //   );
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/");
                    break;
                }
                case 403: {
                    //   Vue.swal(
                    //     "Acceso restringido",
                    //     "No cuentas con permisos necesarios para acceder al recurso",
                    //     "warning"
                    //   );
                    break;
                }
                case 404: {
                    //   Vue.swal(
                    //     "Recurso no encontrado",
                    //     "El recurso solicitado no ha sido encontrado",
                    //     "warning"
                    //   );
                    break;
                }
                case 500: {
                    //   Vue.swal(
                    //     "Error interno",
                    //     "Se ha presentado un error en los servicios, vuelve a intentarlo",
                    //     "warning"
                    //   );
                    break;
                }
            }
            return Promise.reject(error.response);
        }
        return Promise.reject(error);
    }
);

export default {
    doGet(endPoint: string) {
        return AxiosClient.get(endPoint);
    },
    doPost(endPoint: string, object: object, config?: AxiosRequestConfig) {
        return AxiosClient.post(endPoint, object, config);
    },
    doPut(endPoint: string, object: object, config?: AxiosRequestConfig) {
        return AxiosClient.put(endPoint, object, config);
    },
    doPatch(endPoint: string, object: object, config?: AxiosRequestConfig) {
        return AxiosClient.patch(endPoint, object, config);
    }
};
