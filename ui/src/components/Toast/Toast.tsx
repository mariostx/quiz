import React, { FC } from "react";
import { toast } from "react-toastify";
import ToastBody from "./ToastBody";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastMessage = {
  successful: {
    get: "Successfully retrieved data!",
    put: "Successfully updated!",
    post: "Successfully added data!",
    delete: "Successfully deleted!",
  },
  unsuccessful: {
    get: "Unsuccessful data retrieve!",
    put: "Unsuccessful data update!",
    post: "Unsuccessful data add!",
    delete: "Unsuccessful data remove!",
    login: "Login failed, an error has occured!",
  },
};

export const showSuccessToast = (message: string): void => {
  toast.success(<ToastBody icon='icon icon-check-small' message={message} />);
};

export const showErrorToast = (message: string): void => {
  toast.error(<ToastBody icon='icon icon-triangle-warning' message={message} />);
};

export const showInfoToast = (message: string): void => {
  toast.info(<ToastBody message={message} />);
};

export const showWarningToast = (message: string): void => {
  toast.warning(<ToastBody message={message} />);
};
const Toast: FC = () => {
  return (
    <div>
      <ToastContainer position='top-center' hideProgressBar={true} />
    </div>
  );
};

export default Toast;
