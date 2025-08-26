'use client';

import { CloudCog, Download } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

// Types for configuration
interface ColumnConfig {
    key: string;
    label: string;
    width?: number;
    formatter?: (value: any, item: any) => string | number;
}

interface HeaderConfig {
    companyName?: string;
    documentTitle: string;
    subtitle?: string;
    additionalInfo?: string[];
}

interface ExcelExportConfig {
    filename: string;
    sheetName: string;
    headers: HeaderConfig;
    columns: ColumnConfig[];
    mergeRules?: Array<{
        start: { row: number; col: number };
        end: { row: number; col: number };
    }>;
}

interface GenericExcelExportButtonProps {
    data: any[];
    config: ExcelExportConfig;
    className?: string;
    buttonText?: string;
    loading?: boolean;
    onExportStart?: () => void;
    onExportComplete?: (filename: string) => void;
    onExportError?: (error: Error) => void;
}

const GenericExcelExportButton: React.FC<GenericExcelExportButtonProps> = ({
    data,
    config,
    className = '',
    buttonText = 'Xuất Excel',
    loading = false,
    onExportStart,
    onExportComplete,
    onExportError
}) => {
    const handleExportToExcel = () => {
        try {
            onExportStart?.();
    
            console.log('Data to export:', data);

            // Tạo workbook và worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([]);

            // Xây dựng dữ liệu tiêu đề
            const headerData: any[][] = [];
            const totalColumns = config.columns.length + 1; // +1 for STT column

            if (config.headers.companyName) {
                // Tạo hàng tên công ty với thông tin bổ sung đầu tiên ở 2 cột cuối
                const companyRow = new Array(totalColumns).fill('');
                companyRow[0] = config.headers.companyName;
                if (config.headers.additionalInfo?.[0]) {
                    companyRow[totalColumns - 2] = config.headers.additionalInfo[0];
                }
                headerData.push(companyRow);

                // Tạo hàng thứ hai cho thông tin bổ sung thứ hai nếu tồn tại
                if (config.headers.additionalInfo?.[1]) {
                    const secondInfoRow = new Array(totalColumns).fill('');
                    secondInfoRow[totalColumns - 2] = config.headers.additionalInfo[1];
                    headerData.push(secondInfoRow);
                }
                
                headerData.push([]); // Empty row
            }

            // Tạo hàng tiêu đề
            const titleRow = new Array(totalColumns).fill('');
            const middleColumn = Math.floor(totalColumns / 2) - 1; // Start from middle
            titleRow[middleColumn] = config.headers.documentTitle;
            headerData.push(titleRow);

            if (config.headers.subtitle) {
                const subtitleRow = new Array(totalColumns).fill('');
                subtitleRow[middleColumn] = config.headers.subtitle;
                headerData.push(subtitleRow);
            }

            headerData.push([]); // Empty row before table headers

            // Tạo hàng tiêu đề cột
            const columnHeaders = ['STT', ...config.columns.map(col => col.label)];
            headerData.push(columnHeaders);

            // Thêm header rows vào worksheet
            XLSX.utils.sheet_add_aoa(ws, headerData, { origin: 'A1' });

            // Chuẩn bị dữ liệu hàng
            const dataRows = data.map((item, index) => {
                const row: any[] = [index + 1]; // STT column

                config.columns.forEach(column => {
                    let value = item[column.key];

                    // Apply formatter if provided
                    if (column.formatter) {
                        value = column.formatter(value, item);
                    }

                    row.push(value || '');
                });

                return row;
            });

            // Thêm dữ liệu bắt đầu từ hàng thích hợp (sau tiêu đề)
            const dataStartRow = headerData.length + 1;
            XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: `A${dataStartRow}` });

            // Set column widths
            const colWidths = [
                { wch: 5 }, // STT column
                ...config.columns.map(col => ({ wch: col.width || 15 }))
            ];
            ws['!cols'] = colWidths;

            // Apply merge rules
            if (config.mergeRules && config.mergeRules.length > 0) {
                if (!ws['!merges']) ws['!merges'] = [];
                config.mergeRules.forEach(rule => {
                    ws['!merges']!.push({
                        s: { r: rule.start.row, c: rule.start.col },
                        e: { r: rule.end.row, c: rule.end.col }
                    });
                });
            } else {
                // Default merge rules for standard layout
                if (!ws['!merges']) ws['!merges'] = [];
                const totalColumns = config.columns.length + 1; // +1 for STT column

                if (config.headers.companyName) {
                    // Merge company name row (exclude last 2 columns for additionalInfo)
                    ws['!merges'].push({
                        s: { r: 0, c: 0 },
                        e: { r: 0, c: totalColumns - 3 }
                    });
                    
                    // Merge additionalInfo[0] across last 2 columns
                    if (config.headers.additionalInfo?.[0]) {
                        ws['!merges'].push({
                            s: { r: 0, c: totalColumns - 2 },
                            e: { r: 0, c: totalColumns - 1 }
                        });
                    }
                    
                    // Merge additionalInfo[1] across last 2 columns if exists
                    if (config.headers.additionalInfo?.[1]) {
                        ws['!merges'].push({
                            s: { r: 1, c: totalColumns - 2 },
                            e: { r: 1, c: totalColumns - 1 }
                        });
                    }
                }

                // Calculate title row index based on company name and additionalInfo
                let titleRowIndex = 0;
                if (config.headers.companyName) {
                    titleRowIndex = 2; // Company row + empty row
                    if (config.headers.additionalInfo?.[1]) {
                        titleRowIndex = 3; // Company row + additionalInfo[1] row + empty row
                    }
                }
                
                // Merge document title row (2 columns starting from middle)
                const middleColumn = Math.floor(totalColumns / 2) - 1;
                ws['!merges'].push({
                    s: { r: titleRowIndex, c: middleColumn },
                    e: { r: titleRowIndex, c: middleColumn + 1 }
                });

                // Merge subtitle row if exists
                if (config.headers.subtitle) {
                    ws['!merges'].push({
                        s: { r: titleRowIndex + 1, c: middleColumn },
                        e: { r: titleRowIndex + 1, c: middleColumn + 1 }
                    });
                }
            }

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, config.sheetName);

            // Generate filename with current date
            const currentDate = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
            const filename = `${config.filename}_${currentDate}.xlsx`;

            // Save file
            XLSX.writeFile(wb, filename);

            toast.success(`Đã xuất file Excel thành công: ${filename}`);
            onExportComplete?.(filename);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            const errorMessage = 'Có lỗi xảy ra khi xuất file Excel!';
            toast.error(errorMessage);
            onExportError?.(error as Error);
        }
    };

    return (
        <button
            onClick={handleExportToExcel}
            disabled={loading || data.length === 0}
            className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            <Download className='h-5 w-5' />
            <span className='font-semibold'>
                {loading ? 'Đang xuất...' : buttonText}
            </span>
        </button>
    );
};

export default GenericExcelExportButton;

// Example usage configurations:

// Configuration for students data (original use case)
export const studentsExportConfig: ExcelExportConfig = {
    filename: 'Danh_sach_hoc_vien',
    sheetName: 'Danh sách học viên',
    headers: {
        companyName: 'TRUNG TÂM TIẾNG ANH ZENLISH',
        documentTitle: 'DANH SÁCH HỌC VIÊN',
        additionalInfo: [
            'Cộng hòa xã hội chủ nghĩa Việt Nam',
            'Độc lập - Tự do - Hạnh phúc'
        ]
    },
    columns: [
        { key: 'id', label: 'Mã học viên', width: 25 },
        { key: 'name', label: 'Tên học viên', width: 20 },
        { key: 'email', label: 'Email', width: 30 },
        {
            key: 'phone_number',
            label: 'Số điện thoại',
            width: 15,
            formatter: (value) => value || 'Chưa cập nhật'
        },
        {
            key: 'input_level',
            label: 'Trình độ đầu vào',
            width: 20,
            formatter: (value) => {
                const levels: Record<string, string> = {
                    'A1': 'A1 - Mất gốc',
                    'A2': 'A2 - Sơ cấp',
                    'B1': 'B1 - Trung cấp thấp',
                    'B2': 'B2 - Trung cấp cao',
                    'C1': 'C1 - Nâng cao'
                };
                return levels[value] || value;
            }
        },
        {
            key: 'enrollments',
            label: 'Số lớp đã tham gia',
            width: 18,
            formatter: (value) => value?.length > 0 ? value.length : 'Chưa phân lớp'
        },
        {
            key: 'status',
            label: 'Trạng thái',
            width: 15,
            formatter: (value) => {
                const statuses: Record<string, string> = {
                    'active': 'Đang học',
                    'inactive': 'Đã huỷ',
                    'graduated': 'Đã tốt nghiệp'
                };
                return statuses[value] || value;
            }
        },
        {
            key: 'created_at',
            label: 'Ngày tạo',
            width: 15,
            formatter: (value) => new Date(value).toLocaleDateString('vi-VN')
        }
    ]
};

// Configuration for teachers/instructors data
export const teachersExportConfig: ExcelExportConfig = {
  filename: 'Danh_sach_giao_vien',
  sheetName: 'Danh sách giáo viên',
  headers: {
    companyName: 'TRUNG TÂM TIẾNG ANH ZENLISH',
    documentTitle: 'DANH SÁCH GIÁO VIÊN',
    additionalInfo: [
      'Cộng hòa xã hội chủ nghĩa Việt Nam',
      'Độc lập - Tự do - Hạnh phúc'
    ]
  },
  columns: [
    { key: 'id', label: 'Mã giáo viên', width: 25 },
    { key: 'name', label: 'Tên giáo viên', width: 25 },
    { key: 'email', label: 'Email', width: 30 },
    { 
      key: 'phone', 
      label: 'Số điện thoại', 
      width: 15,
      formatter: (value) => value || 'Chưa cập nhật'
    },
    { 
      key: 'experience_years', 
      label: 'Kinh nghiệm (năm)', 
      width: 15,
      formatter: (value) => value ? `${value}` : 'Chưa cập nhật'
    },
    { 
      key: 'specialization', 
      label: 'Chuyên môn', 
      width: 20,
      formatter: (value) => value || 'Chưa cập nhật'
    },
    { 
      key: 'assignedClasses', 
      label: 'Số lớp đang dạy', 
      width: 18,
      formatter: (value) => {
        if (!value || !Array.isArray(value)) return 0;
        return value.length;
      }
    },
    { 
      key: 'address', 
      label: 'Địa chỉ', 
      width: 30,
      formatter: (value) => value || 'Chưa cập nhật'
    },
    { 
      key: 'createdAt', 
      label: 'Ngày bắt đầu', 
      width: 15,
      formatter: (value) => new Date(value).toLocaleDateString('vi-VN')
    }
  ]
};


// Configuration for classes data
export const classesExportConfig: ExcelExportConfig = {
    filename: 'Danh_sach_lop_hoc',
    sheetName: 'Danh sách lớp học',
    headers: {
        documentTitle: 'DANH SÁCH LỚP HỌC',
        subtitle: 'Báo cáo tổng hợp các lớp học'
    },
    columns: [
        { key: 'class_code', label: 'Mã lớp', width: 15 },
        { key: 'class_name', label: 'Tên lớp', width: 25 },
        { key: 'level', label: 'Trình độ', width: 15 },
        { key: 'teacher_name', label: 'Giáo viên', width: 20 },
        { key: 'student_count', label: 'Số học viên', width: 12 },
        { key: 'schedule', label: 'Lịch học', width: 20 },
        {
            key: 'status',
            label: 'Trạng thái',
            width: 15,
            formatter: (value) => {
                const statuses: Record<string, string> = {
                    'active': 'Đang học',
                    'completed': 'Đã kết thúc',
                    'pending': 'Chờ khai giảng'
                };
                return statuses[value] || value;
            }
        },
        {
            key: 'start_date',
            label: 'Ngày bắt đầu',
            width: 15,
            formatter: (value) => new Date(value).toLocaleDateString('vi-VN')
        }
    ]
};

export const staffExportConfig: ExcelExportConfig = {
    filename: 'Danh_sach_nhan_vien',
    sheetName: 'Danh sách nhân viên',
    headers: {
        companyName: 'TRUNG TÂM TIẾNG ANH ZENLISH',
        documentTitle: 'DANH SÁCH NHÂN VIÊN',
        additionalInfo: [
            'Cộng hòa xã hội chủ nghĩa Việt Nam',
            'Độc lập - Tự do - Hạnh phúc'
        ]
    },
    columns: [
        { key: 'id', label: 'Mã nhân viên', width: 25 },
        { key: 'name', label: 'Tên nhân viên', width: 20 },
        { key: 'email', label: 'Email', width: 30 },
        { key: 'phone', label: 'Số điện thoại', width: 15 },
        { key: 'bio', label: 'Tiểu sử', width: 20 },
        {
            key: 'status',
            label: 'Trạng thái',
            width: 15,
            formatter: (value) => value === 'active' ? 'Đang làm việc' : 'Ngừng làm việc'
        },
        {
            key: 'created_at',
            label: 'Ngày vào làm',
            width: 15,
            formatter: (value) => new Date(value).toLocaleDateString('vi-VN')
        }
    ]
};
