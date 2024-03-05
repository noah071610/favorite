import { Bounce, ToastOptions, toast } from "react-toastify"
import { errorMessage, successMessage } from "./message"

export const errorToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
} as ToastOptions<unknown>
export const toastError = (key: keyof typeof errorMessage) => toast.success(errorMessage[key], errorToastOptions)

export const successToastOptions = (id: string) =>
  ({
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    toastId: id,
  } as ToastOptions<unknown>)
export const toastSuccess = (key: keyof typeof successMessage) =>
  toast.success(successMessage[key], successToastOptions(key))
