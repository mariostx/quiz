import React, { FC } from 'react';
import 'components/Toast/style.scss';

interface ToastBodyProps {
    message: string;
    icon?: string;
}

const ToastBody: FC <ToastBodyProps> = (props: ToastBodyProps) => {
    if (props.message !== '') {
        return (
            <div className='toastContent'>
                {props.icon && <i id='toastImg' className={props.icon}></i>}
                <p className='toastMessage'>
                    {props.message}
                </p>
            </div>
        );
    } else return null;
};

export default ToastBody;