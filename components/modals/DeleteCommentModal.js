import React from 'react';
import styled from 'styled-components';
import {Button} from '../styled';
import {Modal} from './index';

const DeleteCommentModal = ({onDelete, onClose}) => {
    return (
        <Modal
            title="Delete comment?"
            subtitle="It cannot be undeleted later"
        >
            <Button onClick={onDelete}>Delete</Button>
            <Button secondary onClick={onClose}>Close</Button>
        </Modal>
    )
}

export default DeleteCommentModal;