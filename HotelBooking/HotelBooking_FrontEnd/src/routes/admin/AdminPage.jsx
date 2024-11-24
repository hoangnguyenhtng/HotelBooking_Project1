import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "services/ApiService";
import styles from './AdminPage.module.css'; // Import CSS file

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error('Error fetching admin details:', error.message);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className={styles['admin-page']}>
            <h1 className={styles['welcome-message']}>Chào mừng quay trở lại, Admin {adminName}</h1>
            <div className={styles['admin-actions']}>
                <button className={styles['admin-button']} onClick={() => navigate('/admin/manage-rooms')}>
                    Quản lý phòng
                </button>
                <button className={styles['admin-button']} onClick={() => navigate('/admin/manage-bookings')}>
                    Quản lý đặt phòng
                </button>
                <button className={styles['admin-button']} onClick={() => navigate('/admin/manage-bookings')}>
                    Quản lý người dùng
                </button>
                <button className={styles['admin-button']} onClick={() => navigate('/admin/manage-bookings')}>
                    Quản lý khách sạn
                </button>
            </div>
        </div>
    );
}

export default AdminPage;