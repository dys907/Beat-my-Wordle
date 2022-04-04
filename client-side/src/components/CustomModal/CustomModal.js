import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 280,
  bgcolor: '#3A3A3C',
  border: '2px double black',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  color: "#3A3A3C",
  fontSize: '50px'
};

const CustomModal = ({openModal, title, text, handleOpen}) => {
    const [open, setOpen] = React.useState(openModal);
    const handleClose = () => {
      setOpen(false);
      handleOpen(false);
    }

    React.useEffect(() => {
      setOpen(openModal)

    })
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {text}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomModal;