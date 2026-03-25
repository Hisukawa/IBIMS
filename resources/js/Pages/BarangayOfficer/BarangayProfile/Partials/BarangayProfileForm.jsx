import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";
import { Building2, ImagePlus, MapPinned, Save } from "lucide-react";

export default function BarangayProfileForm({
    className = "",
    data,
    setData,
    errors,
    submit,
    processing,
    recentlySuccessful,
}) {
    return (
        <section
            className={`min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 ${className}`}
        >
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page Header */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                            <Building2 className="h-7 w-7 text-blue-600" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Barangay Profile
                            </h1>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                                Update your barangay’s official profile,
                                location details, contact information, and logo.
                                Keep this information accurate for reports,
                                documents, and system-wide records.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* General Information */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-slate-900">
                                General Information
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Maintain the basic identity and profile details
                                of the barangay.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-4">
                            {/* Logo Panel */}
                            <div className="lg:col-span-1">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="rounded-lg bg-blue-100 p-2">
                                            <ImagePlus className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Barangay Logo
                                        </h3>
                                    </div>

                                    <div className="flex flex-col items-center text-center">
                                        <img
                                            src={
                                                data.preview_logo
                                                    ? data.preview_logo.startsWith(
                                                          "blob:",
                                                      )
                                                        ? data.preview_logo
                                                        : `/storage/${data.preview_logo}`
                                                    : "/images/default-avatar.jpg"
                                            }
                                            alt="Barangay Logo"
                                            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md ring-1 ring-slate-200"
                                        />

                                        <label
                                            htmlFor="logo"
                                            className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            Choose Logo
                                        </label>

                                        <input
                                            type="file"
                                            id="logo"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setData("logo_path", file);
                                                    setData(
                                                        "preview_logo",
                                                        URL.createObjectURL(
                                                            file,
                                                        ),
                                                    );
                                                }
                                            }}
                                            className="hidden"
                                        />

                                        {errors.logo_path && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.logo_path}
                                            </p>
                                        )}

                                        <p className="mt-3 text-xs leading-5 text-slate-500">
                                            Upload an official barangay logo.
                                            The preview updates automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Fields */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <InputLabel
                                        htmlFor="barangay_name"
                                        value="Barangay Name"
                                    />
                                    <TextInput
                                        id="barangay_name"
                                        className="mt-2 block w-full"
                                        value={data.barangay_name || ""}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_name",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Official name of the barangay.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.barangay_name}
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <InputLabel
                                        htmlFor="barangay_type"
                                        value="Barangay Type"
                                    />
                                    <select
                                        id="barangay_type"
                                        className="mt-2 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        value={data.barangay_type || ""}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_type",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="urban">Urban</option>
                                        <option value="rural">Rural</option>
                                    </select>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Classify the barangay as urban or rural.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.barangay_type}
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <InputLabel
                                        htmlFor="founded_year"
                                        value="Founded Year"
                                    />
                                    <TextInput
                                        id="founded_year"
                                        type="number"
                                        className="mt-2 block w-full"
                                        value={data.founded_year || ""}
                                        onChange={(e) =>
                                            setData(
                                                "founded_year",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Year the barangay was established.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.founded_year}
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <InputLabel
                                        htmlFor="area_sq_km"
                                        value="Area (sq. km)"
                                    />
                                    <TextInput
                                        id="area_sq_km"
                                        type="number"
                                        step="0.01"
                                        className="mt-2 block w-full"
                                        value={data.area_sq_km || ""}
                                        onChange={(e) =>
                                            setData(
                                                "area_sq_km",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Total land area covered by the barangay.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.area_sq_km}
                                    />
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                                    <InputLabel
                                        htmlFor="barangay_code"
                                        value="Barangay Code"
                                    />
                                    <TextInput
                                        id="barangay_code"
                                        className="mt-2 block w-full"
                                        value={data.barangay_code || ""}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_code",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Optional internal or official reference
                                        code.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.barangay_code}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-emerald-100 p-2">
                                    <MapPinned className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Contact Information
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Update address and communication details
                                        for the barangay office.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputLabel htmlFor="city" value="City" />
                                <TextInput
                                    id="city"
                                    className="mt-2 block w-full"
                                    value={data.city || ""}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    City where the barangay is located.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.city}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputLabel
                                    htmlFor="province"
                                    value="Province"
                                />
                                <TextInput
                                    id="province"
                                    className="mt-2 block w-full"
                                    value={data.province || ""}
                                    onChange={(e) =>
                                        setData("province", e.target.value)
                                    }
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Province of the barangay.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.province}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputLabel
                                    htmlFor="zip_code"
                                    value="ZIP Code"
                                />
                                <TextInput
                                    id="zip_code"
                                    className="mt-2 block w-full"
                                    value={data.zip_code || ""}
                                    onChange={(e) =>
                                        setData("zip_code", e.target.value)
                                    }
                                    required
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Postal or ZIP code.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.zip_code}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <InputLabel
                                    htmlFor="contact_number"
                                    value="Contact Number"
                                />
                                <TextInput
                                    id="contact_number"
                                    className="mt-2 block w-full"
                                    value={data.contact_number || ""}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value,
                                        )
                                    }
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Contact number of the barangay office.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.contact_number}
                                />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-2 block w-full"
                                    value={data.email || ""}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Official email address for notices and
                                    correspondence.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-4 z-10">
                        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-800">
                                    Save Barangay Profile
                                </p>
                                <p className="text-xs text-slate-500">
                                    Review the information before saving your
                                    changes.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? "Saving..." : "Save Changes"}
                                </PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm font-medium text-emerald-600">
                                        Saved successfully.
                                    </p>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
