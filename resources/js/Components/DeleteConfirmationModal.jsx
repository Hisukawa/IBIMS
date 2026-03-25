import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import { AlertTriangle, Loader2, LockKeyhole, ShieldAlert } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    residentId,
    title = "Confirm Delete",
    description = "This action requires password confirmation before proceeding.",
    message = "Are you sure you want to delete this record? This action cannot be undone.",
    buttonLabel = "I UNDERSTAND, DELETE",
    cancelLabel = "Cancel",
    processingText = "Verifying...",
    itemName = "",
    itemLabel = "Selected Record",
    note = "",
    passwordLabel = "Password",
    passwordPlaceholder = "Enter your password",
    passwordHelpText = "For security purposes, please re-enter your account password.",
    showSecurityNote = true,
    danger = true,
}) {
    const { data, setData, reset, processing, errors, setError, clearErrors } =
        useForm({
            password: "",
            id: residentId || null,
        });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, reset, clearErrors]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        clearErrors();

        try {
            const res = await axios.post(route("user.confirm"), {
                id: residentId,
                password: data.password,
            });

            if (res.data.status === "success") {
                reset();
                onClose();
                onConfirm?.();
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.errors?.password?.[0] ||
                "The password you entered is incorrect.";

            setError("password", message);

            toast.error("Password Incorrect", {
                description: message,
                duration: 3000,
                closeButton: true,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md overflow-hidden border-0 p-0 shadow-2xl">
                <div
                    className={`border-b px-6 py-5 ${
                        danger
                            ? "bg-red-50 dark:bg-red-950/30"
                            : "bg-blue-50 dark:bg-blue-950/30"
                    }`}
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                                danger
                                    ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                            }`}
                        >
                            {danger ? (
                                <AlertTriangle className="h-6 w-6" />
                            ) : (
                                <ShieldAlert className="h-6 w-6" />
                            )}
                        </div>

                        <DialogHeader className="space-y-1 text-left">
                            <DialogTitle className="text-xl font-semibold">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm leading-6 text-muted-foreground">
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 px-6 py-5">
                    {itemName && (
                        <div className="rounded-xl border bg-muted/40 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {itemLabel}
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold text-foreground">
                                {itemName}
                            </p>
                        </div>
                    )}

                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>{message}</p>
                        </div>
                    </div>

                    {note && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
                            <div className="flex items-start gap-2">
                                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                <p>{note}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {passwordLabel}
                        </label>

                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder={passwordPlaceholder}
                                autoComplete="off"
                                required
                                className={`w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition ${
                                    errors.password
                                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                        : "border-input focus:ring-2 focus:ring-ring/20"
                                }`}
                            />
                        </div>

                        {!errors.password && passwordHelpText && (
                            <p className="text-xs leading-5 text-muted-foreground">
                                {passwordHelpText}
                            </p>
                        )}

                        {errors.password && (
                            <p className="text-sm font-medium text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {showSecurityNote && (
                        <div className="rounded-xl border bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                            Your password is only used to verify that this
                            deletion is authorized.
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {cancelLabel}
                        </button>

                        <button
                            type="submit"
                            disabled={processing || !data.password}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {processing ? processingText : buttonLabel}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
