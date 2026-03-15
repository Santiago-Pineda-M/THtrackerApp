/**
 * INFRASTRUCTURE LAYER - Debug Panel Component
 * Componente flotante de debugging que muestra información de la aplicación.
 * Solo se muestra en entorno de desarrollo.
 */

import React, { useState, useCallback } from 'react';
import { useDebugInfo } from '../../../Hooks/useDebugInfo';

// Verificar si estamos en desarrollo
const isDevelopment = import.meta.env.MODE === 'development';

const formatJsonString = (str: string): string => {
    try {
        const parsed = JSON.parse(str);
        return JSON.stringify(parsed, null, 2);
    } catch {
        return str;
    }
};

interface DebugPanelProps {
    className?: string;
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    copyData?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, defaultOpen = true, copyData }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (copyData) {
            try {
                await navigator.clipboard.writeText(copyData);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{
                display: 'flex',
                background: '#2d3748',
                borderRadius: '4px',
                color: '#e2e8f0',
            }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        flex: 1,
                        textAlign: 'left',
                        padding: '6px 10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                    }}
                >
                    {isOpen ? '▼' : '▶'} {title}
                </button>
                {copyData && (
                    <button
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        style={{
                            padding: '6px 10px',
                            background: 'transparent',
                            border: 'none',
                            color: copied ? '#68d391' : '#a0aec0',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                )}
            </div>
            {isOpen && (
                <div style={{
                    padding: '8px',
                    background: '#1a202c',
                    borderRadius: '0 0 4px 4px',
                    marginTop: '2px'
                }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const KeyValue: React.FC<{ label: string; value: string | number | undefined | null }> = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
        <span style={{ color: '#a0aec0', flexShrink: 0, width: '120px' }}>{label}:</span>
        <span style={{ color: '#68d391', wordBreak: 'break-all', textAlign: 'right' }}>
            {value !== undefined && value !== null ? String(value) : '-'}
        </span>
    </div>
);

const StorageItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{ marginBottom: '4px', fontSize: '10px' }}>
        <span style={{ color: '#f6ad55' }}>{label}:</span>
        <pre style={{ 
            margin: '2px 0 0 0', 
            padding: '4px', 
            background: '#0d1117', 
            borderRadius: '2px',
            overflowY: 'auto',
            maxHeight: '150px',
            fontSize: '9px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
        }}>
            {formatJsonString(value)}
        </pre>
    </div>
);

export const DebugPanel: React.FC<DebugPanelProps> = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [opacity, setOpacity] = useState(0.95);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const { debugState: debugInfo, authState, forceRefreshToken } = useDebugInfo();

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    }, [position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    }, [isDragging, dragOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    if (!isDevelopment) {
        return null;
    }

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#e53e3e',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '18px',
                    zIndex: 99999,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
                title="Show Debug Panel"
            >
                🐛
            </button>
        );
    }

    const formatDate = (date: Date | null): string => {
        if (!date) return '-';
        return date.toLocaleTimeString();
    };

    const getStatusColor = (status: string | undefined): string => {
        switch (status) {
            case 'AUTHENTICATED': return '#68d391';
            case 'UNAUTHENTICATED': return '#f6ad55';
            case 'AUTHENTICATING': return '#63b3ed';
            case 'FAILED': return '#fc8181';
            case 'LOADING': return '#cbd5e0';
            default: return '#a0aec0';
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                width: isCollapsed ? 'auto' : '350px',
                maxHeight: '80vh',
                background: `rgba(26, 32, 44, ${opacity})`,
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                zIndex: 99999,
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#e2e8f0',
                userSelect: 'none',
                border: '1px solid #4a5568',
                overflow: 'hidden'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Header - Draggable */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    padding: '10px 12px',
                    background: '#2d3748',
                    borderBottom: '1px solid #4a5568',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>🐛</span>
                    <span style={{ fontWeight: 600 }}>Debug Panel</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={headerButtonStyle}
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? '⬜' : '▼'}
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        style={headerButtonStyle}
                        title="Hide"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <>
                    {/* Opacity Control */}
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #4a5568' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                            Opacity:
                            <input
                                type="range"
                                min="0.3"
                                max="1"
                                step="0.05"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                style={{ flex: 1 }}
                            />
                            <span style={{ width: '35px', textAlign: 'right' }}>{Math.round(opacity * 100)}%</span>
                        </label>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '8px', maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
                        
                        {/* Authentication Section */}
                        <Section 
                            title="Authentication"
                            copyData={JSON.stringify({ 
                                status: authState.status, 
                                userId: authState.user?.id, 
                                userName: authState.user?.name, 
                                userEmail: authState.user?.email,
                                accessTokenExp: debugInfo.tokenExpiry.accessTokenExpiry,
                                refreshTokenExp: debugInfo.tokenExpiry.refreshTokenExpiry
                            }, null, 2)}
                        >
                            <KeyValue label="Status" value={authState.status} />
                            <KeyValue 
                                label="Status Color" 
                                value="" 
                            />
                            <div style={{ 
                                display: 'inline-block', 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%',
                                background: getStatusColor(authState.status),
                                marginRight: '5px',
                                verticalAlign: 'middle'
                            }} />
                            <KeyValue label="User ID" value={authState.user?.id} />
                            <KeyValue label="User Name" value={authState.user?.name} />
                            <KeyValue label="User Email" value={authState.user?.email} />
                            <KeyValue label="Access Token Exp" value={debugInfo.tokenExpiry.accessTokenExpiry ? debugInfo.tokenExpiry.accessTokenExpiry.toLocaleString() : '-'} />
                            <KeyValue label="Refresh Token Exp" value={debugInfo.tokenExpiry.refreshTokenExpiry ? debugInfo.tokenExpiry.refreshTokenExpiry.toLocaleString() : '-'} />
                            
                            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => forceRefreshToken()}
                                    style={{ 
                                        padding: '6px 10px',
                                        background: '#4299e1',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: 'white',
                                        fontSize: '11px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Force Refresh
                                </button>
                            </div>
                        </Section>

                        {/* API Info Section */}
                        <Section 
                            title="API Response" 
                            defaultOpen={false}
                            copyData={JSON.stringify(debugInfo.lastApiCall, null, 2)}
                        >
                            <KeyValue 
                                label="Last Call" 
                                value={formatDate(debugInfo.lastApiCall.timestamp)} 
                            />
                            <KeyValue 
                                label="Endpoint" 
                                value={debugInfo.lastApiCall.endpoint ? 
                                    debugInfo.lastApiCall.endpoint.split('/').pop() : '-'} 
                            />
                            <KeyValue 
                                label="Status" 
                                value={debugInfo.lastApiCall.status || '-'} 
                            />
                        </Section>

                        {/* Storage Section */}
                        <Section 
                            title="Local Storage" 
                            defaultOpen={false}
                            copyData={JSON.stringify(debugInfo.storageInfo, null, 2)}
                        >
                            <KeyValue label="Size" value={`${debugInfo.storageInfo.size} KB`} />
                            <KeyValue label="Keys" value={debugInfo.storageInfo.keys.length} />
                            <div style={{ marginTop: '8px' }}>
                                {debugInfo.storageInfo.keys.slice(0, 5).map((key: string) => (
                                    <StorageItem 
                                        key={key} 
                                        label={key} 
                                        value={debugInfo.storageInfo.contents[key]} 
                                    />
                                ))}
                                {debugInfo.storageInfo.keys.length > 5 && (
                                    <div style={{ fontSize: '10px', color: '#718096', marginTop: '4px' }}>
                                        ...and {debugInfo.storageInfo.keys.length - 5} more
                                    </div>
                                )}
                            </div>
                        </Section>

                        {/* App Info Section */}
                        <Section 
                            title="App Info" 
                            defaultOpen={false}
                            copyData={JSON.stringify(debugInfo.appInfo, null, 2)}
                        >
                            <KeyValue label="Version" value={debugInfo.appInfo.appVersion} />
                            <KeyValue label="Environment" value={debugInfo.appInfo.environment} />
                            <KeyValue label="Build" value={debugInfo.appInfo.buildTimestamp.split('T')[0]} />
                        </Section>

                        {/* Connection Section */}
                        <Section 
                            title="Connection" 
                            defaultOpen={false}
                            copyData={JSON.stringify(debugInfo.navigatorInfo, null, 2)}
                        >
                            <KeyValue 
                                label="Online" 
                                value={debugInfo.navigatorInfo.online ? 'Yes' : 'No'} 
                            />
                            <KeyValue 
                                label="Connection" 
                                value={debugInfo.navigatorInfo.connectionType} 
                            />
                            <div style={{ 
                                fontSize: '9px', 
                                color: '#718096', 
                                marginTop: '4px',
                                wordBreak: 'break-word' 
                            }}>
                                {debugInfo.navigatorInfo.userAgent.substring(0, 50)}...
                            </div>
                        </Section>

                        {/* Debug Info Section */}
                        <Section 
                            title="Debug Info" 
                            defaultOpen={false}
                            copyData={JSON.stringify({
                                updateCount: debugInfo.renderCount,
                                lastUpdate: debugInfo.lastUpdate,
                                authStatus: authState.status
                            }, null, 2)}
                        >
                            <KeyValue label="Update Count" value={debugInfo.renderCount} />
                            <KeyValue label="Last Update" value={debugInfo.lastUpdate.toLocaleTimeString()} />
                            <KeyValue label="Auth Status" value={authState.status} />
                        </Section>
                    </div>
                </>
            )}
        </div>
    );
};

const headerButtonStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: 'none',
    background: '#4a5568',
    color: '#e2e8f0',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default DebugPanel;
