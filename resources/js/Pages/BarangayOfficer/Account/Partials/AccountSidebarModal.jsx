import { Button } from "@/components/ui/button";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import InputField from "@/Components/InputField";
import PasswordValidationChecklist from "@/Components/PasswordValidationChecklist";
import EmailValidationInput from "@/Components/EmailValidationInput";
import SelectField from "@/Components/SelectField";
import { MoveRight, CircleUser } from "lucide-react";
import { RESIDENT_GENDER_TEXT2 } from "@/constants";

export default function AccountSidebarModal({
    isOpen,
    onClose,
    modalState,
    accountDetails,
    data,
    setData,
    errors,
    residentsList,
    handleResidentChange,
    handleAddAccountSubmit,
    handleEditAccountSubmit,
    passwordError,
    selectedResident,
}) {
    return (
        <SidebarModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                modalState === "add"
                    ? accountDetails
                        ? "Edit Account Details"
                        : "Add Account Details"
                    : "View Resident Details"
            }
        >
            {(modalState === "add" || modalState === "edit") && (
                <div className="w-full space-y-6 bg-white p-1 text-sm text-slate-800">
                    <form
                        onSubmit={
                            modalState === "add"
                                ? handleAddAccountSubmit
                                : handleEditAccountSubmit
                        }
                        className="space-y-6"
                    >
                        {/* Header / Intro */}
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-white p-5 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                    <CircleUser className="h-6 w-6 text-blue-600" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">
                                        {modalState === "add"
                                            ? "Create User Account"
                                            : "Edit User Account"}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {modalState === "add"
                                            ? "Select a resident and provide the required account credentials to create a system account."
                                            : "Update account credentials and access settings for this user account."}
                                    </p>

                                    <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                                        {data.resident_name ||
                                            "No resident selected"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resident Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h4 className="text-base font-semibold text-slate-900">
                                    Resident Information
                                </h4>
                                <p className="mt-1 text-sm text-slate-500">
                                    Select a resident and review the basic
                                    profile details before creating or updating
                                    the account.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                                {/* Profile Preview */}
                                <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                                    <div className="relative">
                                        <img
                                            src={
                                                data.resident_image
                                                    ? `/storage/${data.resident_image}`
                                                    : "/images/default-avatar.jpg"
                                            }
                                            alt="Resident Image"
                                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                                        />
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-medium text-white shadow">
                                            Profile
                                        </div>
                                    </div>

                                    <h5 className="mt-4 text-sm font-semibold text-slate-900">
                                        {data.resident_name ||
                                            "No resident selected"}
                                    </h5>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {data.resident_id
                                            ? "Preview of the selected resident profile."
                                            : "Select a resident to display profile details."}
                                    </p>
                                </div>

                                {/* Resident Form */}
                                <div className="space-y-5 lg:col-span-2">
                                    <div>
                                        <DropdownInputField
                                            label="Full Name"
                                            name="resident_name"
                                            value={data.resident_name || ""}
                                            placeholder="Select a resident"
                                            onChange={handleResidentChange}
                                            items={residentsList}
                                            disabled={modalState === "edit"}
                                        />
                                        <InputError
                                            message={errors.resident_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    {data.resident_id && (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <InputField
                                                    label="Birthdate"
                                                    name="birthdate"
                                                    value={data.birthdate || ""}
                                                    readOnly
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Resident's date of birth
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <InputField
                                                    label="Purok Number"
                                                    name="purok_number"
                                                    value={
                                                        data.purok_number || ""
                                                    }
                                                    readOnly
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Assigned purok information
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <InputField
                                                    label="Sex"
                                                    name="sex"
                                                    value={
                                                        RESIDENT_GENDER_TEXT2[
                                                            data.sex
                                                        ] || ""
                                                    }
                                                    readOnly
                                                />
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Registered resident gender
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-4">
                                <h4 className="text-base font-semibold text-slate-900">
                                    Account Settings
                                </h4>
                                <p className="mt-1 text-sm text-slate-500">
                                    Configure the login credentials and account
                                    role for this user.
                                </p>
                            </div>

                            <div className="space-y-6 p-6">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <InputField
                                            label="Username"
                                            name="username"
                                            value={data.username || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <p className="mt-2 text-xs text-slate-500">
                                            Enter a unique username for account
                                            login.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <EmailValidationInput
                                            data={data}
                                            setData={setData}
                                            originalEmail={
                                                data.originalEmail ?? null
                                            }
                                        />
                                        <p className="mt-2 text-xs text-slate-500">
                                            Provide a valid and accessible email
                                            address.
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                                        <SelectField
                                            label="Role"
                                            name="role"
                                            value={data.role || ""}
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                            items={[
                                                {
                                                    value: "barangay_officer",
                                                    label: "Barangay Officer",
                                                },
                                                {
                                                    value: "resident",
                                                    label: "Resident",
                                                },
                                            ]}
                                        />
                                        <p className="mt-2 text-xs text-slate-500">
                                            Select the system role and access
                                            level for this account.
                                        </p>
                                    </div>
                                </div>

                                {modalState === "add" && (
                                    <div className="space-y-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-900">
                                                Password Setup
                                            </h5>
                                            <p className="mt-1 text-xs text-slate-600">
                                                Set a secure password for the
                                                new user account.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <InputField
                                                    label="Password"
                                                    name="password"
                                                    type="password"
                                                    value={data.password || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <InputField
                                                    label="Confirm Password"
                                                    name="password_confirmation"
                                                    type="password"
                                                    value={
                                                        data.password_confirmation ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl bg-white p-4 ring-1 ring-blue-100">
                                            <PasswordValidationChecklist
                                                data={data}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-5 text-slate-500">
                                    {modalState === "add"
                                        ? "Review the selected resident and account credentials before creating the account."
                                        : "Make sure all account details are correct before saving changes."}
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
                                        className="bg-blue-700 hover:bg-blue-800"
                                        type="submit"
                                        disabled={
                                            modalState === "add" &&
                                            (!!passwordError ||
                                                !data.password ||
                                                !data.password_confirmation)
                                        }
                                    >
                                        {modalState === "add"
                                            ? "Create Account"
                                            : "Update Account"}
                                        <MoveRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {modalState === "view" ? (
                selectedResident ? (
                    <PersonDetailContent person={selectedResident} />
                ) : null
            ) : null}
        </SidebarModal>
    );
}
