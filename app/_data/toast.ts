import { Bounce, ToastOptions, toast } from "react-toastify"

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
export const toastError = (key: string) => toast.error(key, errorToastOptions)

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
export const toastSuccess = (key: string) => toast.success(key, successToastOptions(key))
