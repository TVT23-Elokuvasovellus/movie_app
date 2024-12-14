import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const Notifications = ({ show, handleClose, notifications, handleSelectInvite, selectedInvites, respondGroupInvite }) => {
    const displayNotifications = () => {
        if (notifications.length === 0) {
            return <p>No notifications.</p>;
        } else {
            return notifications.map(notification => (
                <div key={notification.id} className="notification">
                    <Form.Check 
                        type="checkbox"
                        checked={selectedInvites.includes(notification.id)}
                        onChange={() => handleSelectInvite(notification.id)}
                        label={notification.message}
                    />
                </div>
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
                <Button 
                    variant="success" 
                    onClick={() => respondGroupInvite('accept')}
                    disabled={selectedInvites.length === 0}
                >
                    Accept
                </Button>
                <Button 
                    variant="danger" 
                    onClick={() => respondGroupInvite('reject')}
                    disabled={selectedInvites.length === 0}
                >
                    Reject
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Notifications;
