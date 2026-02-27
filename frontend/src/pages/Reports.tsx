import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Reports: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t('reports.title')}
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#2e7d32', // Green for Reports module
                        },
                    }}
                >
                    <Tab
                        label={t('reports.tabs.financial')}
                        sx={{
                            '&.Mui-selected': { color: '#2e7d32' },
                            color: 'text.secondary'
                        }}
                    />
                    <Tab
                        label={t('reports.tabs.grades')}
                        sx={{
                            '&.Mui-selected': { color: '#2e7d32' },
                            color: 'text.secondary'
                        }}
                    />
                </Tabs>
            </Box>

            <div role="tabpanel" hidden={activeTab !== 0}>
                {activeTab === 0 && (
                    <Box>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {t('reports.tabs.financial')}
                            </Typography>
                            <Typography color="text.secondary">
                                {t('reports.messages.inDevelopment')}
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </div>

            <div role="tabpanel" hidden={activeTab !== 1}>
                {activeTab === 1 && (
                    <Box>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {t('reports.tabs.grades')}
                            </Typography>
                            <Typography color="text.secondary">
                                {t('reports.messages.inDevelopment')}
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </div>
        </Box>
    );
};

export default Reports;
