import React from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
    children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-main p-6 md:p-10">
            <div className="bento-grid h-full max-w-[1700px] mx-auto">
                <Sidebar />
                {children}
            </div>
        </div>
    );
};
