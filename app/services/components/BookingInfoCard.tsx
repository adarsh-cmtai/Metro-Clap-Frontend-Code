import React from 'react';

interface BookingInfoCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

export function BookingInfoCard({ icon, title, children, action }: BookingInfoCardProps) {
    return (
        <div className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
            <div className="text-red-600 mr-4">{icon}</div>
            <div className="flex-grow">
                <h3 className="text-sm text-gray-500">{title}</h3>
                <div>{children}</div>
            </div>
            {action && <div className="ml-4">{action}</div>}
        </div>
    );
}