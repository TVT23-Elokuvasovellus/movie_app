import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Notifications = ({ show, handleClose, notifications }) => {
    const displayNotifications = () => {
        if (notifications.length === 0) {
            return <p>No notifications.</p>;
        } else {
            return notifications.map(notification => (
                <p key={notification.id}>{notification.message}</p>
            ));
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {displayNotifications()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Notifications;