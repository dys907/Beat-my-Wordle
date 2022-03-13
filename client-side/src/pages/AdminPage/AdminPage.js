import React from 'react';
import Form from '../../components/Form/Form';
// import { Button } from '../../components/Button/Button';

const AdminPage = () => {
    const formTitle = 'Admin login';
    const isAdmin = true;
    const submitTxt = 'Submit';
    return (
        <Form titleTxt={formTitle} isAdmin={isAdmin} submitTxt={submitTxt} />
    );
};

export default AdminPage;