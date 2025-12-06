<?php

namespace App\Exports;

use App\Models\ActivityLog;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ActivityLogsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{
    protected $barangay;
    protected $totalRecords;

    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);
    }

    public function collection()
    {
        $query = ActivityLog::with(['user:id,username', 'barangay:id,barangay_name']);

        if (auth()->user()->barangay_id) {
            $query->where('barangay_id', auth()->user()->barangay_id);
        }

        // Search filter
        if ($search = request('name')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action_type', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('username', 'like', "%{$search}%"));
            });
        }

        // Filters
        if (request()->filled('action') && request('action') !== 'All') {
            $query->where('action_type', request('action'));
        }

        if (request()->filled('role') && request('role') !== 'All') {
            $query->where('role', request('role'));
        }

        if (request()->filled('module') && request('module') !== 'All') {
            $query->where('module', request('module'));
        }

        // Date range
        if ($startDate = request('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate = request('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $logs = $query->orderBy('created_at', 'desc')->get();
        $this->totalRecords = $logs->count();

        return $logs->map(fn($log) => [
            'ID'          => $log->id,
            'User'        => $log->user?->username ?? 'N/A',
            'Role'        => $log->role,
            'Module'      => $log->module,
            'Action Type' => $log->action_type,
            'Description' => $log->description,
            'Barangay'    => $log->barangay?->barangay_name ?? 'N/A',
            'Created At'  => $log->created_at->format('Y-m-d H:i:s'),
        ]);
    }

    public function headings(): array
    {
        return [
            'ID', 'User', 'Role', 'Module', 'Action Type', 'Description', 'Barangay', 'Created At'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastColumnIndex = Coordinate::columnIndexFromString($lastColumn);

                // Insert 4 rows for titles + total records
                $sheet->insertNewRowBefore(1, 4);

                // Logos
                $barangayLogoPath = ($this->barangay && $this->barangay->logo_path)
                    ? storage_path('app/public/' . ltrim($this->barangay->logo_path, '/'))
                    : ''; // leave blank if null

                $cityLogoPath = public_path('images/city-of-ilagan.png');

                // Fallback if files don’t exist
                if ($barangayLogoPath && !file_exists($barangayLogoPath)) {
                    \Log::warning("Barangay logo not found at: {$barangayLogoPath}");
                    $barangayLogoPath = ''; // leave blank
                }

                if (!file_exists($cityLogoPath)) {
                    \Log::warning("City logo not found at: {$cityLogoPath}");
                    $cityLogoPath = ''; // leave blank
                }

                $barangayLogo = $barangayLogoPath;
                $cityLogo     = $cityLogoPath;

                $captain = '';
                $secretary = '';

                if ($this->barangay) {
                    // Get barangay officials
                    $officials = BarangayOfficial::with('resident')
                        ->whereHas('resident', fn($q) => $q->where('barangay_id', $this->barangay->id))
                        ->get();

                    $captain   = $officials->firstWhere('position', 'barangay_captain')?->resident?->fullname ?? '';
                    $secretary = $officials->firstWhere('position', 'barangay_secretary')?->resident?->fullname ?? '';
                }

                if ($barangayLogo) {
                    $logoLeft = new Drawing();
                    $logoLeft->setName('Barangay Logo');
                    $logoLeft->setDescription('Barangay Logo');
                    $logoLeft->setPath($barangayLogo);
                    $logoLeft->setHeight(80);
                    $logoLeft->setCoordinates('A1');
                    $logoLeft->setOffsetX(0);
                    $logoLeft->setOffsetY(5);
                    $logoLeft->setWorksheet($sheet);
                }

                // Right Logo
                $targetColumn = Coordinate::stringFromColumnIndex($lastColumnIndex + 1);
                $logoRight = new Drawing();
                $logoRight->setName('City Logo');
                $logoRight->setDescription('City Logo');
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($targetColumn . '1');
                $logoRight->setOffsetX(0);
                $logoRight->setOffsetY(5);
                $sheetColumnWidth = $sheet->getColumnDimension($targetColumn)->getWidth();
                $logoRight->setOffsetX($sheetColumnWidth * 7 - $logoRight->getWidth());
                $logoRight->setWorksheet($sheet);

                // Titles
                $sheet->setCellValue('A1', 'ACTIVITY LOGS REPORT');
                if ($this->barangay && $this->barangay->barangay_name) {
                    $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                } else {
                    // Optionally, leave it blank or skip setting
                    $sheet->setCellValue('A2', ''); // blank cell
                }
                $sheet->setCellValue('A3', 'Region II, Isabela, City of Ilagan 3300');
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);

                // Total records
                $sheet->setCellValue('A4', "Total Records: {$this->totalRecords}");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left');

                // Main title style
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center');

                // Header row
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);

                // Data borders
                $lastRow = $sheet->getHighestRow();
                if ($lastRow > $headerRow) {
                    $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                        ->getBorders()
                        ->getAllBorders()
                        ->setBorderStyle(Border::BORDER_THIN);
                }

                // Signatories
                $signatureStartRow = $lastRow + 3;
                $halfColumn = floor($lastColumnIndex / 2);

                // Captain - left
                if (!empty($captain)) {
                    $captainName = 'Hon. ' . ucwords(strtolower($captain));

                    $sheet->mergeCells("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . $signatureStartRow);
                    $sheet->setCellValue("A{$signatureStartRow}", "______________________________");
                    $sheet->mergeCells("A" . ($signatureStartRow + 1) . ":" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1));
                    $sheet->setCellValue("A" . ($signatureStartRow + 1), $captainName);
                    $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))
                        ->getAlignment()->setHorizontal('center');
                }

                // Secretary - right
                if (!empty($secretary)) {
                    $secretaryName = 'Hon. ' . ucwords(strtolower($secretary));

                    $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}{$signatureStartRow}");
                    $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}", "______________________________");
                    $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1) . ":{$lastColumn}" . ($signatureStartRow + 1));
                    $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1), $secretaryName);
                    $sheet->getStyle(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}" . ($signatureStartRow + 1))
                        ->getAlignment()->setHorizontal('center');
                }

                // Freeze pane
                $sheet->freezePane("A" . ($headerRow + 1));
            }
        ];
    }
}
