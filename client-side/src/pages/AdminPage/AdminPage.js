import React from 'react';
import Form from '../../components/Form/Form';

const AdminPage = () => {
    const formTitle = 'Admin login';
    const formType = 'admin';
    const submitTxt = 'Submit';
    return (
        <Form titleTxt={formTitle} formType={formType} submitTxt={submitTxt} />
    );
};

export default AdminPage;