// frontend/components/DeleteModal/DeleteModal.jsx

import './DeleteModal.css';
import { useDispatch } from 'react-redux';

const DeleteModal = ({ item, itemType, deleteThunk, onClose }) => {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        try {
            await dispatch(deleteThunk(item.id));
            onClose();
        } catch (error) {
            console.error(`Error deleting ${itemType}:`, error);
        }
    };

    const itemTypeText = itemType.charAt(0).toUpperCase() + itemType.slice(1); // Capitalize item type for display

    return (
        <>
            <div className="modal_under_layer" onClick={onClose} /> 
            <div className="modal_window_all">
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this {itemType}?</p>
                <button onClick={handleDelete} className="red _button">Yes (Delete {itemTypeText})</button>
                <button onClick={onClose} className="green _button">No (Keep {itemTypeText})</button>
            </div>
        </>
    );
};

export default DeleteModal;
