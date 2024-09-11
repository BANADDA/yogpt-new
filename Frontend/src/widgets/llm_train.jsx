import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

export function CustomTrainingDialog({handleClose, modelInfo, fineTuneData }) {
  return (
    <Dialog o handler={handleClose}>
      <DialogHeader>{modelInfo.name}</DialogHeader>
      <DialogBody>
        <img src={modelInfo.imageUrl} alt={modelInfo.name}
                                                className="w-full h-full object-cover" />
        <p className="text-center">Model ID: {modelInfo.id}</p>
        <p className="text-center">Fine-Tune Data:</p>
        <ul>
          <li>Model Name: {fineTuneData.modelName}</li>
          <li>Huggingface Dataset ID: {fineTuneData.huggingFaceDatasetID}</li>
          <li>Train Hardware: {fineTuneData.spaceHardware}</li>
          <li>License: {fineTuneData.license}</li>
        </ul>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleClose}
          className="mr-1"
        >
          <span>Back</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleClose}>
          <span>Confirm Training</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

CustomTrainingDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  modelInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  fineTuneData: PropTypes.shape({
    modelName: PropTypes.string.isRequired,
    huggingFaceDatasetID: PropTypes.string.isRequired,
    spaceHardware: PropTypes.string.isRequired,
    license: PropTypes.string.isRequired,
  }).isRequired,
};
