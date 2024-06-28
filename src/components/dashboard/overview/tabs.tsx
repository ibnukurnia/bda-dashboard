// components/Tabs.tsx
'use client';

import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';



interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel({ children, value, index }: TabPanelProps): React.ReactElement {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index.toString()}`}
            aria-labelledby={`tab-${index.toString()}`}
        >
            {value === index && (
                <Box sx={{ marginTop: 4 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

interface TabsProps {
    tabs: { id: string; label: string; content: React.ReactNode }[];
}

const TabsComponent: React.FC<TabsProps> = ({ tabs }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
        setValue(newValue);
    };

    return (
        <Box sx={{ p: 0 }}>
            <Tabs value={value} onChange={handleChange} aria-label="tabs" sx={{
                backgroundColor: 'transparent',
                padding: '6px',
                width: 'fit-content',
                border: '2px solid #004889',
                borderRadius: 50,
                '& .MuiTabs-indicator': {
                    backgroundColor: 'transparent', // Remove bottom border color
                },
            }}>
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        label={tab.label}
                        id={`tab-${tab.id}`}
                        aria-controls={`tabpanel-${tab.id}`}
                        sx={{
                            width: '200px',
                            height: '48px',
                            padding: '9px 78px',
                            gap: '10px',
                            borderRadius: '50px',
                            background: 'transparent',
                            color: 'white',
                            '&.Mui-selected': {
                                color: 'white', // Text color when selected
                                background: 'linear-gradient(99.22deg, #F28E0F 34.1%, #FFFFFF 189.57%)',
                            },

                        }}
                    />
                ))}
            </Tabs>
            {tabs.map((tab, index) => (
                <TabPanel key={tab.id} value={value} index={index}>
                    {tab.content}
                </TabPanel>
            ))}
        </Box>
    );
};

export default TabsComponent;
