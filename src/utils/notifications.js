import { message } from 'antd';

export const showSuccess = (msg) => {
    message.success({
        content: msg,
        duration: 3,
    });
};

export const showError = (msg, err) => {
    console.error(err);
    message.error({
        content: msg,
        duration: 4,
    });
};

export const showInfo = (msg) => {
    message.info({
        content: msg,
        duration: 2,
    });
}; 