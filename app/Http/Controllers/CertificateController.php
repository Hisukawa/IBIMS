<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficial;
use App\Models\Certificate;
use App\Models\Document;
use App\Models\Resident;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use PhpOffice\PhpWord\TemplateProcessor;

class CertificateController extends Controller
{
    public function index()
    {
        $barangay_id = auth()->user()->resident->barangay_id;
        $query = Document::where('barangay_id',  $barangay_id);
        $documents = $query->get();
        $residents = Resident::whereBarangayId($barangay_id)->with('latestHousehold')->get();

        $query = Certificate::where('barangay_id', $barangay_id)
        ->with('resident:id,firstname,middlename,lastname,suffix,purok_number', 'document:id,name', 'issuedBy:id,position')
        ->select('id', 'resident_id', 'document_id', 'barangay_id', 'request_status', 'purpose', 'issued_at', 'issued_by', 'docx_path', 'pdf_path', 'control_number');

        // Filter by certificate_type (assuming it's on the documents table)
        if ($type = request('certificate_type') && request('certificate_type') !== 'All') {
            $query->whereHas('document', function ($q) use ($type) {
                $q->where('name', $type);
            });
        }

        // Filter by request_status
        if (request('request_status') && request('request_status') !== 'All') {
            $query->where('request_status', request('request_status'));
        }

        // Filter by issued_by
        if (request('issued_by') && request('issued_by') !== 'All') {
            $query->where('issued_by', request('issued_by'));
        }

        if ($issuedAt = request('issued_at')) {
            try {
                $date = \Carbon\Carbon::parse($issuedAt)->toDateString();
                $query->whereDate('issued_at', $date);
            } catch (\Exception $e) {
                // Ignore invalid date filter
            }
        }

        $search = trim(request('name', ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($r) use ($search) {
                    $r->where(function ($rr) use ($search) {
                        $rr->where('firstname', 'like', "%{$search}%")
                        ->orWhere('middlename', 'like', "%{$search}%")
                        ->orWhere('lastname', 'like', "%{$search}%")
                        ->orWhere('suffix', 'like', "%{$search}%");
                    });
                })
                ->orWhere('purpose', 'like', "%{$search}%")
                ->orWhereHas('document', function ($d) use ($search) {
                    $d->where('name', 'like', "%{$search}%");
                });
            });
        }

        $certificates = $query->get();

        if (request()->boolean('success')) {
            session()->flash('success', 'Certificate issued successfully.');
        }
        return Inertia::render('BarangayOfficer/Document/CertificateIssuance', [
            'documents' => $documents,
            'residents' => $residents,
            'queryParams' => request()->query() ?: null,
            'certificates' => $certificates,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }
    public function storeFromPost(Request $request)
    {
        $validated = $request->validate([
            'document_id' => 'required|exists:documents,id',
            'resident_id' => 'required|exists:residents,id',
            'purpose' => 'required|string',
        ]);

        $template = Document::findOrFail($validated['document_id']);
        $resident = Resident::findOrFail($validated['resident_id']);

        return $this->store($template, $resident, $request->all());
    }

    // public function store(Document $template, Resident $resident, array $data)
    // {
    //     $barangay_id = auth()->user()->resident->barangay_id;
    //     $officer = BarangayOfficial::findOrFail(auth()->user()->resident->id);
    //     $barangay_name = auth()->user()->resident->barangay->barangay_name;

    //     if (!isset($data['purpose'])) {
    //         throw new \InvalidArgumentException('Purpose is required.');
    //     }

    //     DB::beginTransaction();

    //     try {
    //         $templatePath = storage_path("app/public/{$template->template_path}");

    //         if (!file_exists($templatePath)) {
    //             throw new \Exception('Template file not found.');
    //         }

    //         $templateProcessor = new TemplateProcessor($templatePath);
    //         $placeholders = $templateProcessor->getVariables();

    //         $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
    //         $ctrlNo = 'CSA-' . now()->format('YmdHis');

    //         $systemValues = collect([
    //             'fullname' => $fullName,
    //             'day' => now()->format('j'),
    //             'month' => now()->format('F'),
    //             'year' => now()->format('Y'),
    //             'civil_status' => $resident->civil_status,
    //             'gender' => $resident->gender,
    //             'purpose' => $data['purpose'],
    //             'ctrl_no' => $ctrlNo,
    //             'purok' => $resident->purok_number,
    //         ]);

    //         $customValues = collect($data)->except([
    //             'document_id',
    //             'resident_id',
    //             'purpose',
    //         ]);

    //         $values = $systemValues->merge($customValues);

    //         foreach ($placeholders as $placeholder) {
    //             $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
    //         }

    //         // Build filename and storage path
    //         $filename = 'certificate_' . Str::slug($fullName) . '_' . now()->format('Ymd_His') . '.docx';
    //         $tempPath = storage_path("app/temp/{$filename}");

    //         // Ensure temp directory exists
    //         if (!is_dir(dirname($tempPath))) {
    //             mkdir(dirname($tempPath), 0755, true);
    //         }

    //         // Save to temp then move to persistent public disk
    //         $templateProcessor->saveAs($tempPath);

    //         // Store permanently in public storage under certificates/
    //         $barangaySlug = Str::slug($barangay_name);
    //         $storedRelativePath = "certificates/{$barangaySlug}/{$filename}";
    //         Storage::disk('public')->putFileAs("certificates/{$barangaySlug}", new File($tempPath), $filename);

    //         // Create certificate record with file_path
    //         $certificate = Certificate::create([
    //             'resident_id' => $resident->id,
    //             'document_id' => $template->id,
    //             'barangay_id' => $barangay_id,
    //             'request_status' => 'issued',
    //             'purpose' => $data['purpose'],
    //             'issued_at' => now(), // assuming column is date or datetime
    //             'issued_by' => $officer->id,
    //             'docx_path' => $storedRelativePath,
    //         ]);

    //         DB::commit();

    //         // Return download response from the stored file (keeps copy)
    //         return Storage::disk('public')->download($storedRelativePath, $filename);

    //     } catch (\Throwable $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'error' => 'Certificate generation failed.',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    // public function download($id)
    // {
    //     $certificate = Certificate::findOrFail($id);

    //     // Optional: authorize access
    //     // $this->authorize('view', $certificate);

    //     if (!$certificate->file_path || !Storage::disk('public')->exists($certificate->file_path)) {
    //         $message = 'Certificate file not found.';

    //         if (request()->wantsJson() || request()->ajax()) {
    //             return response()->json(['error' => $message], 404);
    //         }

    //         return redirect()->back()->with('error', $message);
    //     }

    //     try {
    //         return Storage::disk('public')->download($certificate->file_path);
    //     } catch (\Throwable $e) {
    //         // log if you want: \Log::error("Certificate download failed: ".$e->getMessage());

    //         $fallback = 'Failed to download certificate.';
    //         if (request()->wantsJson() || request()->ajax()) {
    //             return response()->json([
    //                 'error' => $fallback,
    //                 'message' => $e->getMessage(),
    //             ], 500);
    //         }

    //         return redirect()->back()->with('error', $fallback);
    //     }
    // }



    public function store(Document $template, Resident $resident, array $data)
    {
        $barangay_id = auth()->user()->resident->barangay_id;
        $officer = BarangayOfficial::findOrFail(auth()->user()->resident->id);
        $barangay_name = auth()->user()->resident->barangay->barangay_name;

        if (!isset($data['purpose'])) {
            throw new \InvalidArgumentException('Purpose is required.');
        }

        DB::beginTransaction();

        try {
            $templatePath = storage_path("app/public/{$template->file_path}");
            if (!file_exists($templatePath)) {
                throw new \Exception('Template file not found.');
            }

            $templateProcessor = new TemplateProcessor($templatePath);
            $placeholders = $templateProcessor->getVariables();

            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
            $ctrlNo = 'CSA-' . now()->format('YmdHis');

            $systemValues = collect([
                'fullname' => $fullName,
                'day' => now()->format('j'),
                'month' => now()->format('F'),
                'year' => now()->format('Y'),
                'civil_status' => $resident->civil_status,
                'gender' => $resident->gender,
                'purpose' => $data['purpose'],
                'ctrl_no' => $ctrlNo,
                'purok' => $resident->purok_number,
            ]);

            $customValues = collect($data)->except(['document_id', 'resident_id', 'purpose']);
            $values = $systemValues->merge($customValues);

            foreach ($placeholders as $placeholder) {
                $templateProcessor->setValue($placeholder, $values->get($placeholder, ''));
            }

            // File names and temp paths
            $baseName = 'certificate_' . Str::slug($fullName) . '_' . now()->format('Ymd_His');
            $docxFilename = "{$baseName}.docx";
            $pdfFilename  = "{$baseName}.pdf";

            $tempDocxPath = storage_path("app/temp/{$docxFilename}");
            $tempPdfPath  = storage_path("app/temp/{$pdfFilename}");

            if (!is_dir(dirname($tempDocxPath))) {
                mkdir(dirname($tempDocxPath), 0755, true);
            }

            // Save DOCX to temp
            $templateProcessor->saveAs($tempDocxPath);

            // Convert to PDF
            if (!$this->convertDocxToPdf($tempDocxPath, $tempPdfPath)) {
                throw new \Exception('Failed to convert certificate to PDF.');
            }

            // Store in public storage
            $barangaySlug = Str::slug($barangay_name);
            $docxRelative = "certificates/{$barangaySlug}/docx/{$docxFilename}";
            $pdfRelative  = "certificates/{$barangaySlug}/pdf/{$pdfFilename}";

            Storage::disk('public')->putFileAs("certificates/{$barangaySlug}/docx", new File($tempDocxPath), $docxFilename);
            Storage::disk('public')->putFileAs("certificates/{$barangaySlug}/pdf", new File($tempPdfPath), $pdfFilename);

            // Remove temp files
            @unlink($tempDocxPath);
            @unlink($tempPdfPath);

            // Save record with both paths
            $certificate = Certificate::create([
                'resident_id' => $resident->id,
                'document_id' => $template->id,
                'barangay_id' => $barangay_id,
                'request_status' => 'issued',
                'purpose' => $data['purpose'],
                'issued_at' => now(),
                'issued_by' => $officer->id,
                'docx_path' => $docxRelative,
                'pdf_path' => $pdfRelative,
                'control_number' => $ctrlNo,
            ]);

            DB::commit();

            // Return DOCX download (or PDF if you prefer)
            return Storage::disk('public')->download($docxRelative, $docxFilename);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Certificate generation failed.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Convert DOCX to PDF using LibreOffice / soffice
     */
    protected function convertDocxToPdf(string $docxPath, string $outputPdfPath): bool
    {
        if (!is_dir(dirname($outputPdfPath))) {
            mkdir(dirname($outputPdfPath), 0755, true);
        }

        $escapedInput = escapeshellarg($docxPath);
        $escapedOutputDir = escapeshellarg(dirname($outputPdfPath));

        // Detect Windows vs Linux/Mac
        $cmd = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN'
            ? "soffice --headless --convert-to pdf {$escapedInput} --outdir {$escapedOutputDir}"
            : "libreoffice --headless --convert-to pdf {$escapedInput} --outdir {$escapedOutputDir}";

        exec($cmd . ' 2>&1', $outputLines, $returnVar);

        $expectedPdf = dirname($outputPdfPath) . DIRECTORY_SEPARATOR . pathinfo($docxPath, PATHINFO_FILENAME) . '.pdf';

        if (!file_exists($expectedPdf)) {
            \Log::error("LibreOffice conversion failed: " . implode("\n", $outputLines));
            return false;
        }

        if ($expectedPdf !== $outputPdfPath) {
            rename($expectedPdf, $outputPdfPath);
        }

        return file_exists($outputPdfPath);
    }

    public function print($id)
    {
        $certificate = Certificate::findOrFail($id);

        if (!$certificate->pdf_path || !Storage::disk('public')->exists($certificate->pdf_path)) {
            return response()->json(['error' => 'PDF file not found.'], 404);
        }

        // Return the PDF file as a binary stream
        return response()->file(Storage::disk('public')->path($certificate->pdf_path), [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function download($id)
    {
        $certificate = Certificate::findOrFail($id);

        if (!$certificate->docx_path || !Storage::disk('public')->exists($certificate->docx_path)) {
            return response()->json(['error' => 'DOCX file not found.'], 404);
        }

        // for docx
        //return Storage::disk('public')->download($certificate->docx_path);

        // for pdf
        return Storage::disk('public')->download($certificate->pdf_path, basename($certificate->pdf_path));
    }

}
