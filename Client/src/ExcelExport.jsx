import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';
const ExcelExport = ({ data }) => {
    const [isExporting, setIsExporting] = useState(false);
    const exportData = async () => {
        setIsExporting(true);
        const wb = utils.book_new();
        const ws = utils.json_to_sheet(data);
        utils.book_append_sheet(wb, ws, 'Sheet 1');
        await writeFile(wb, 'data.xlsx');
        setIsExporting(false);
    };
    const handleExport = () => {
        if (!isExporting) {
            exportData();
        }
    };
    return (
        <div>
            <button style={{backgroundColor: '#E4E6EB'}} onClick={handleExport}>Export to Excel</button>
        </div>
    );
};
export default ExcelExport;