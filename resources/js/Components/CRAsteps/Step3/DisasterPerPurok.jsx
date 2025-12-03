import React, { useContext, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { StepperContext } from "@/context/StepperContext";

const DEFAULT_ROWS = [
    { value: "Number of Informal Settler Families", count: "" },
    { value: "Number of Employed Individuals", count: "" },
    { value: "Number of Families Aware of the Effects of Risks and Hazards", count: "" },
    { value: "Number of Families with Access to Information (radio/TV/newspaper/social media, etc.)", count: "" },
    { value: "Number of Families who received Financial Assistance", count: "" },
    { value: "Number of Families with Access to Early Warning System", count: "" },
];

const FamilyAtRiskTable = () => {
    const { craData, setCraData } = useContext(StepperContext);

    console.log(craData);
    // Initialize family_at_risk if empty
    useEffect(() => {
        setCraData(prev => {
            if (!prev.family_at_risk || !prev.family_at_risk.length) {
                return {
                    ...prev,
                    family_at_risk: [
                        { purok: "1", rowsValue: DEFAULT_ROWS.map(r => ({ ...r })) }
                    ]
                };
            }
            return prev;
        });
    }, [setCraData]);

    const familyList = Array.isArray(craData?.family_at_risk)
        ? craData.family_at_risk.map(item => ({
            ...item,
            rowsValue: item.rowsValue || DEFAULT_ROWS.map(r => ({ ...r })),
        }))
        : [{ purok: "1", rowsValue: DEFAULT_ROWS.map(r => ({ ...r })) }];

    const updateRow = (index, rowIndex, value) => {
        setCraData(prev => {
            const updated = prev.family_at_risk.map((item, i) => {
                if (i !== index) return item;
                const newRows = item.rowsValue.map((row, rIdx) =>
                    rIdx === rowIndex ? { ...row, count: value.replace(/\D/g, "") } : row
                );
                return { ...item, rowsValue: newRows };
            });
            return { ...prev, family_at_risk: updated };
        });
    };

    const addPurok = () => {
        setCraData(prev => {
            const current = prev.family_at_risk || [];
            const newPurok = {
                purok: `${current.length + 1}`,
                rowsValue: DEFAULT_ROWS.map(r => ({ ...r })),
            };
            return { ...prev, family_at_risk: [...current, newPurok] };
        });
        toast.success("Purok added successfully!");
    };

    const removePurok = (index) => {
        if (index === 0) {
            toast.error("Default Purok cannot be removed.");
            return;
        }
        setCraData(prev => ({
            ...prev,
            family_at_risk: (prev.family_at_risk || []).filter((_, i) => i !== index)
        }));
        toast.error("Purok removed!");
    };

    const calculateTotals = () =>
        DEFAULT_ROWS.map((_, idx) =>
            familyList.reduce((sum, item) => sum + Number(item.rowsValue?.[idx]?.count || 0), 0)
        );

    const familyTotals = calculateTotals();

    return (
        <div className="p-4">
            <Toaster position="top-right" />
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-1 text-center">Purok</th>
                            {DEFAULT_ROWS.map((row, idx) => (
                                <th key={idx} className="border p-1 text-center">{row.value}</th>
                            ))}
                            <th className="border p-1 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {familyList.map((purok, pIdx) => (
                            <tr key={pIdx} className="hover:bg-gray-50">
                                <td className="border p-1 text-center">{purok.purok}</td>
                                {purok.rowsValue.map((row, rIdx) => (
                                    <td key={rIdx} className="border p-1">
                                        <input
                                            type="text"
                                            value={row.count || ""}
                                            onChange={e => updateRow(pIdx, rIdx, e.target.value)}
                                            className="w-full text-center text-xs p-1 border rounded"
                                        />
                                    </td>
                                ))}
                                <td className="text-center">
                                    {pIdx !== 0 && (
                                        <button
                                            className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 mx-auto"
                                            onClick={() => removePurok(pIdx)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                            <td className="border p-1 text-center">Total</td>
                            {familyTotals.map((total, idx) => (
                                <td key={idx} className="border p-1 text-center">{total}</td>
                            ))}
                            <td className="border p-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button
                onClick={addPurok}
                className="inline-flex items-center gap-1 m-2 px-2 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                + Add Purok
            </button>
        </div>
    );
};

export default FamilyAtRiskTable;
