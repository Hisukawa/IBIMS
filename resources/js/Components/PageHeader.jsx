export default function PageHeader({
    title,
    description,
    icon: Icon,
    badge = null,
    actions = null,
    children = null,
    className = "",
    containerClassName = "",
    iconWrapperClassName = "bg-blue-100 text-blue-600",
    contentClassName = "",
    titleClassName = "",
    descriptionClassName = "",
}) {
    return (
        <div className={`mb-6 ${className}`}>
            <div
                className={`flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-start md:justify-between ${containerClassName}`}
            >
                <div className="flex min-w-0 items-start gap-3">
                    {Icon && (
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconWrapperClassName}`}
                        >
                            <Icon className="h-6 w-6" />
                        </div>
                    )}

                    <div className={`min-w-0 ${contentClassName}`}>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1
                                className={`text-xl font-semibold text-slate-900 md:text-2xl ${titleClassName}`}
                            >
                                {title}
                            </h1>

                            {badge && <div>{badge}</div>}
                        </div>

                        {description && (
                            <div
                                className={`mt-1 text-sm leading-6 text-slate-600 ${descriptionClassName}`}
                            >
                                {description}
                            </div>
                        )}

                        {children && <div className="mt-3">{children}</div>}
                    </div>
                </div>

                {actions && (
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
