import React from "react";
import { endPoint } from "../../api/endPoint";
import { usePut } from "../../Custom-Hooks";
import "./EditMessage.scss";
import Loading from "../Loading/Loading";
import { ToastContainer, toast } from "react-toastify";

const EditMessage = ({
  message,
  messageId,
  setShowEditMessage,
  setIsMessageEdited,
}: any) => {
  const [updatedMessage, setUpdatedMessage] = React.useState("");
  const [editMessageForm, setEditMessageForm] = React.useState({});
  const [editMessage, loading, success, errorMessage]: any = usePut(
    endPoint.editMessage + messageId,
    editMessageForm
  );

  const EditMessageFail = () => toast(errorMessage);

  React.useEffect(() => {
    setEditMessageForm({ message: updatedMessage });
  }, [updatedMessage]);

  React.useEffect(() => {
    setUpdatedMessage(message);
  }, []);

  const handleEditMessage = () => {
    editMessage();
  };

  const handleEditMessageWhenEnter = (e: any) => {
    if (e.key == "Enter") {
      editMessage();
    }
  };

  /* refresh messages when success */
  React.useEffect(() => {
    if (success) {
      setIsMessageEdited(true);
      setShowEditMessage(false);
    }
    if (errorMessage) {
      EditMessageFail();
    }
  }, [success, errorMessage]);

  const handleClose = () => {
    setShowEditMessage(false);
  };

  return (
    <div className="edit-message">
      {loading && <Loading />}
      <ToastContainer />
      <input
        value={updatedMessage}
        onChange={(e: any) => setUpdatedMessage(e.target.value)}
        onKeyDown={handleEditMessageWhenEnter}
      />
      <button onClick={handleEditMessage}>ok</button>
      <button onClick={handleClose} className="cancel-button">
        X
      </button>
    </div>
  );
};

export default EditMessage;
