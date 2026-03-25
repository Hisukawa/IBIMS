import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, KeyRound, ShieldAlert } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import InputField from "@/Components/InputField";
import PasswordValidationChecklist from "@/Components/PasswordValidationChecklist";

export default function ResetPasswordModal({
    open,
    onClose,
    selectedUser,
    onSuccess,
}) {
    const { data, setData, reset, processing, errors, setError, clearErrors } =
        useForm({
            password: "",
            password_confirmation: "",
        });

    useEffect(() => {
        if (!open) {
            reset();
            clearErrors();
        }
    }, [open, reset, clearErrors]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();

        try {
            const res = await axios.patch(
                route("user.reset-password", selectedUser?.id),
                {
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                },
            );

            toast.success(res.data.message || "Password reset successfully.", {
                duration: 3000,
                closeButton: true,
            });

            reset();
            onClose();
            onSuccess?.();
        } catch (err) {
            const responseErrors = err.response?.data?.errors;

            if (responseErrors) {
                Object.entries(responseErrors).forEach(([field, messages]) => {
                    setError(field, messages[0]);
                });
            }

            toast.error(
                err.response?.data?.message || "Failed to reset password.",
                {
                    duration: 3000,
                    closeButton: true,
                },
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="mb-2 flex items-center gap-3">
                        <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                            <KeyRound className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                                Set a new password for this user account.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="rounded-lg border bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-800">
                        {selectedUser?.name ||
                            selectedUser?.username ||
                            selectedUser?.email ||
                            "Selected User"}
                    </p>
                    <p className="text-slate-500">
                        {selectedUser?.email || "No email available"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="New Password"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                    />

                    <InputField
                        label="Confirm New Password"
                        name="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        error={errors.password_confirmation}
                    />

                    <PasswordValidationChecklist data={data} />

                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                        <div className="flex items-start gap-2">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>
                                This will replace the user’s current password.
                                Share the new password securely if needed.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                processing ||
                                !data.password ||
                                !data.password_confirmation
                            }
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-600 px-4 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
                        >
                            {processing && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {processing ? "Updating..." : "Reset Password"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
