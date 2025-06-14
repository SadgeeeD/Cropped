import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const AlertNotification = ({ open, onClose, message, severity = "warning" }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default AlertNotification;
