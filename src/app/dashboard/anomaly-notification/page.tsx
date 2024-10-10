import React from 'react';
import AnomalyNotificationPage from '@/components/dashboard/notification/main-page';
import type { Metadata } from 'next'


export const metadata = { title: `Notification` } satisfies Metadata

const NotificationPage = () => {
    return (
        <div>
            <AnomalyNotificationPage />
        </div>
    );
};

export default NotificationPage;
