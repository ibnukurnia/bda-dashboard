// components/Tabs.tsx
'use client';

import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';

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

interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode; // Optional icon prop
}

interface TabsProps {
    tabs: TabItem[];
}

const TabsComponent: React.FC<TabsProps> = ({ tabs }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
        setValue(newValue);
    };

    return (

        <Box >
            <div className='flex flex-row justify-between'>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="tabs"
                    sx={{
                        backgroundColor: 'transparent',
                        padding: '8px',
                        width: 'fit-content',
                        border: '2px solid #004889',
                        borderRadius: 50,
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'transparent', // Remove bottom border color
                        },
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {tab.icon && <Box component="span">{tab.icon}</Box>}
                                    {tab.label}
                                </Box>
                            }
                            id={`tab-${tab.id}`}
                            aria-controls={`tabpanel-${tab.id}`}
                            sx={{
                                // width: '200px',
                                // height: '48px',
                                padding: '9px 56px',
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
                <Typography variant="body1" component="h6" color="white" sx={{ alignSelf: 'self-end' }}>
                    Last Updated: a minute ago
                </Typography>
            </div>
            {tabs.map((tab, index) => (
                <TabPanel key={tab.id} value={value} index={index}>
                    {tab.content}
                </TabPanel>
            ))}

        </Box>

    );
};

export default TabsComponent;
