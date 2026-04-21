import {
    FileCheck2,
    FilePlus2,
    FileText,
    UploadCloud,
    ShieldCheck,
    Info,
    MoveRight,
} from "lucide-react";
import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import SelectField from "@/Components/SelectField";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";

export default function DocumentFormModal({
    isOpen,
    onClose,
    title = "Add Document",
    handleSubmitDocument,
    fileInputRef,
    handleDivClick,
    data,
    setData,
    errors,
    processing,
}) {
    return (
        <SidebarModal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="w-full space-y-6 bg-white p-1 text-sm text-slate-800">
                <form onSubmit={handleSubmitDocument} className="space-y-6">
                    {/* Hero / Intro */}
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                    Upload New Document
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Add a new document to the system by
                                    providing the required file details,
                                    purpose, and description for easier tracking
                                    and administration.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                        {data.name || "No document name yet"}
                                    </div>

                                    <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100">
                                        {data.specific_purpose
                                            ? data.specific_purpose
                                            : "No purpose selected"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h4 className="text-base font-semibold text-slate-900">
                                File Upload
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Select the file you want to upload. You may
                                click the upload area or drag and drop a file.
                            </p>
                        </div>

                        <div className="space-y-5 p-6">
                            <input
                                id="file"
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) =>
                                    setData("file", e.target.files?.[0] || null)
                                }
                                className="hidden"
                            />

                            <div
                                onClick={handleDivClick}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.currentTarget.classList.add(
                                        "border-blue-400",
                                        "bg-blue-50",
                                    );
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.currentTarget.classList.remove(
                                        "border-blue-400",
                                        "bg-blue-50",
                                    );
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.currentTarget.classList.remove(
                                        "border-blue-400",
                                        "bg-blue-50",
                                    );

                                    if (
                                        e.dataTransfer.files &&
                                        e.dataTransfer.files.length > 0
                                    ) {
                                        const file = e.dataTransfer.files[0];
                                        setData("file", file);

                                        if (fileInputRef.current) {
                                            fileInputRef.current.files =
                                                e.dataTransfer.files;
                                        }

                                        e.dataTransfer.clearData();
                                    }
                                }}
                                className={`group flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-all ${
                                    data.file
                                        ? "border-blue-400 bg-blue-50"
                                        : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                                }`}
                            >
                                {data.file ? (
                                    <>
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-sm">
                                            <FileCheck2 className="h-8 w-8 text-blue-600" />
                                        </div>

                                        <h5 className="mt-4 text-base font-semibold text-slate-800">
                                            File Selected
                                        </h5>

                                        <p className="mt-1 max-w-md break-all text-sm text-slate-600">
                                            {data.file.name}
                                        </p>

                                        <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                                            Ready for upload
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                                            <UploadCloud className="h-8 w-8 text-blue-500" />
                                        </div>

                                        <h5 className="mt-4 text-base font-semibold text-slate-800">
                                            Upload your document
                                        </h5>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Click to browse or drag and drop
                                            your file here
                                        </p>

                                        <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                            Fast and secure upload
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="mt-0.5 h-4 w-4 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                Upload Reminder
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Make sure the selected file is
                                                the correct and latest version
                                                before submitting.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                File Integrity
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Uploaded files should be clear,
                                                complete, and properly labeled
                                                for easy system management.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {errors.file && (
                                <p className="text-xs font-medium text-red-600">
                                    {errors.file}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Document Information */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h4 className="text-base font-semibold text-slate-900">
                                Document Information
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Provide the document name, purpose, and a short
                                description to organize records properly.
                            </p>
                        </div>

                        <div className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <InputField
                                        label="Document Name"
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g., Barangay Clearance"
                                        className="w-full"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Enter a clear and recognizable document
                                        title.
                                    </p>
                                    {errors.name && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <SelectField
                                        label="Specific Purpose"
                                        name="specific_purpose"
                                        value={data.specific_purpose || ""}
                                        onChange={(e) =>
                                            setData(
                                                "specific_purpose",
                                                e.target.value,
                                            )
                                        }
                                        items={[
                                            {
                                                label: "Certification",
                                                value: "certification",
                                            },
                                            {
                                                label: "Blotter Report Form",
                                                value: "blotter",
                                            },
                                            {
                                                label: "Summon Report Form",
                                                value: "summon",
                                            },
                                            {
                                                label: "File to Action Form",
                                                value: "file_action",
                                            },
                                        ]}
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Select the purpose category to classify
                                        this document correctly.
                                    </p>
                                    {errors.specific_purpose && (
                                        <p className="mt-2 text-xs text-red-600">
                                            {errors.specific_purpose}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Provide a brief description of the document and its intended use"
                                    rows={5}
                                    className="mt-2 w-full resize-none text-slate-600"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Add helpful notes so administrators can
                                    quickly understand the content and purpose
                                    of the file.
                                </p>
                                {errors.description && (
                                    <p className="mt-2 text-xs text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs leading-5 text-slate-500">
                                Review the file details carefully before
                                submitting to make sure the uploaded document is
                                complete, categorized properly, and easy to
                                identify later.
                            </p>

                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-700 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Submit Document"}
                                    <MoveRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </SidebarModal>
    );
}
