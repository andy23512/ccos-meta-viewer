import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface InformationDialogProps {
  open: boolean;
  onClose: () => void;
}

function InformationDialog({ open, onClose }: InformationDialogProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>CCOS Meta Viewer</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This website serves as a unofficial data viewer for the official&nbsp;
          <a
            className="underline"
            href="https://github.com/CharaChorder/CCOS-firmware?tab=readme-ov-file#firmware-meta-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            CharaChorder Firmware Meta API
          </a>
          . It enables developers to more easily access specific types of data
          for a particular device and firmware version through a graphical user
          interface (GUI). It also includes a&nbsp;
          <a
            className="underline"
            href="https://swagger.io/tools/swagger-ui/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Swagger UI
          </a>
          . The source code can be accessed here:&nbsp;
          <a
            className="underline"
            href="https://github.com/andy23512/device-comparator"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/andy23512/device-comparator
          </a>
          .<h3 className="pt-3 pb-1 text-lg font-bold">Disclaimer</h3>
          This site is not affiliated, associated, authorized, endorsed by, or
          in any way officially connected with CharaChorder. The official
          websites can be found at&nbsp;
          <a
            className="underline"
            href="https://www.charachorder.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.charachorder.com/
          </a>
          .
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default InformationDialog;
