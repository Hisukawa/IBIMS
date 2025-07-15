import { IoMdEye } from "react-icons/io";
import { useRef, useEffect, useState } from "react";

const FamilyCard = ({ x, y, person, relation, onViewDetail }) => {
    const nameRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const el = nameRef.current;
        setIsOverflowing(el && el.scrollWidth > el.clientWidth);
    }, [person]);

    const fontSizeClass = isOverflowing ? "text-xs" : "text-sm";

    return (
        <foreignObject x={x} y={y} width={260} height={150}>
            <div
                className={`bg-white rounded-xl shadow-md border p-3 w-[240px] text-sm transition-all duration-200 hover:shadow-lg hover:border-2
        ${relation === "Self" ? "border-blue-400" : "border-gray-300"}`}
            >
                <div className="flex items-start space-x-3">
                    <img
                        src={
                            person?.resident_picture_path == null
                                ? "/images/default-avatar.jpg"
                                : `/storage/${person.resident_picture_path}`
                        }
                        alt={`${person?.firstname}'s photo`}
                        className="w-14 h-14 rounded-full object-cover border"
                    />
                    <div className="flex-1 space-y-1">
                        <p
                            ref={nameRef}
                            className={`m-0 leading-tight font-medium whitespace-nowrap overflow-hidden ${fontSizeClass}`}
                        >
                            {person?.lastname}, {person?.firstname}{" "}
                            {person?.middlename
                                ? person.middlename.charAt(0) + ". "
                                : ""}
                            {person?.suffix ?? ""}
                        </p>
                        <h2 className="m-0 font-semibold text-gray-800">
                            {relation}
                        </h2>
                        <button
                            onClick={() =>
                                onViewDetail({ ...person, relation })
                            }
                            className="m-0 p-0 text-xs text-blue-500 hover:underline flex items-center space-x-1"
                        >
                            <IoMdEye className="text-base" />
                            <span>View details</span>
                        </button>
                    </div>
                </div>
            </div>
        </foreignObject>
    );
};

export default FamilyCard;
