import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import EvaluationsTab from './EvaluationsTab';
import GradesTab from './GradesTab';
import AnnualGradesTab from './AnnualGradesTab';
import PrintingTab from './PrintingTab';
import ConfigurationsTab from './ConfigurationsTab';
import { useTranslation } from 'react-i18next';

const Examens: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#d32f2f', // Red color to match Exams theme
                        },
                    }}
                >
                    <Tab
                        label={t('exams.tabs.evaluations')}
                        sx={{
                            '&.Mui-selected': { color: '#d32f2f', fontWeight: 'bold' },
                            color: 'text.secondary'
                        }}
                    />
                    <Tab
                        label={t('exams.tabs.configurations')}
                        sx={{
                            '&.Mui-selected': { color: '#d32f2f', fontWeight: 'bold' },
                            color: 'text.secondary'
                        }}
                    />
                    <Tab
                        label={t('exams.tabs.grades')}
                        sx={{
                            '&.Mui-selected': { color: '#d32f2f', fontWeight: 'bold' },
                            color: 'text.secondary'
                        }}
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>IMPRESSION</Typography>
                                <Typography variant="caption" sx={{ fontStyle: 'italic', textTransform: 'none' }}>(annuelle)</Typography>
                            </Box>
                        }
                        sx={{
                            '&.Mui-selected': { color: '#d32f2f', fontWeight: 'bold' },
                            color: 'text.secondary'
                        }}
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>IMPRESSION</Typography>
                                <Typography variant="caption" sx={{ fontStyle: 'italic', textTransform: 'none' }}>(par évaluation)</Typography>
                            </Box>
                        }
                        sx={{
                            '&.Mui-selected': { color: '#d32f2f', fontWeight: 'bold' },
                            color: 'text.secondary'
                        }}
                    />
                </Tabs>
            </Box>

            <div role="tabpanel" hidden={activeTab !== 0}>
                {activeTab === 0 && <EvaluationsTab />}
            </div>
            <div role="tabpanel" hidden={activeTab !== 1}>
                {activeTab === 1 && <ConfigurationsTab />}
            </div>
            <div role="tabpanel" hidden={activeTab !== 2}>
                {activeTab === 2 && <GradesTab />}
            </div>
            <div role="tabpanel" hidden={activeTab !== 3}>
                {activeTab === 3 && <AnnualGradesTab />}
            </div>
            <div role="tabpanel" hidden={activeTab !== 4}>
                {activeTab === 4 && <PrintingTab />}
            </div>
        </Box>
    );
};

export default Examens;

