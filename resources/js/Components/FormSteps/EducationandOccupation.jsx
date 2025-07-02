import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '@/context/StepperContext';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import YearDropdown from '../YearDropdown';
import InputField from '../InputField';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

function EducationandOccupation() {
    const { userData, setUserData } = useContext(StepperContext);
    const members = userData.members || [];
    const [openIndex, setOpenIndex] = useState(null);

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...members];

        const newValue = name === "is_student" ? Number(value) : value;

        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: value,
        };

        const educationStatus = updatedMembers[index].education_status;

        if (name === "year_ended" || name === "education_status") {
            if (educationStatus === "graduate") {
                updatedMembers[index].year_graduated = updatedMembers[index].year_ended || '';
            } else if (educationStatus === "undergraduate") {
                updatedMembers[index].year_graduated = '';
            }
        }

        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    const handleOccupationChange = (memberIndex, occupationIndex, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...members];
        const updatedOccupations = [...(updatedMembers[memberIndex].occupations || [])];
        const occupation = { ...updatedOccupations[occupationIndex], [name]: value };

        const conversionFactors = {
            'daily': 30,
            'weekly': 4.33,    // 52 weeks / 12 months ≈ 4.33 weeks per month
            'bi-weekly': 2.17, // 26 bi-weekly periods / 12 months ≈ 2.17
            'monthly': 1       // Already monthly, no conversion needed
        };
        const income = name === 'income' ? parseFloat(value) : parseFloat(occupation.income);
        const frequency = name === 'frequency' ? value : occupation.frequency;

        if (!isNaN(income) && conversionFactors[frequency]) {
            occupation.monthly_income = (income * conversionFactors[frequency]).toFixed(2);
        } else {
            occupation.monthly_income = '';
        }

        updatedOccupations[occupationIndex] = occupation;
        updatedMembers[memberIndex].occupations = updatedOccupations;

        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };


    const addOccupation = (index) => {
        const updatedMembers = [...members];
        const occupations = updatedMembers[index].occupations || [];

        occupations.push({});
        updatedMembers[index].occupations = occupations;

        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    const removeOccupation = (memberIndex, occupationIndex) => {
        const updatedMembers = [...members];
        const updatedOccupations = [...(updatedMembers[memberIndex].occupations || [])];

        updatedOccupations.splice(occupationIndex, 1);
        updatedMembers[memberIndex].occupations = updatedOccupations;

        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    useEffect(() => {
        const totalIncome = (userData.members || []).reduce((sum, member) => {
            const memberIncome = (member.occupations || []).reduce((mSum, occ) => {
                return mSum + (parseFloat(occ.monthly_income) || 0);
            }, 0);
            return sum + memberIncome;
        }, 0);

        const brackets = [
            { min: 0, max: 5000, key: "below_5000", category: "survival" },
            { min: 5001, max: 10000, key: "5001_10000", category: "poor" },
            { min: 10001, max: 20000, key: "10001_20000", category: "low_income" },
            { min: 20001, max: 40000, key: "20001_40000", category: "lower_middle_income" },
            { min: 40001, max: 70000, key: "40001_70000", category: "middle_income" },
            { min: 70001, max: 120000, key: "70001_120000", category: "upper_middle_income" },
            { min: 120001, max: Infinity, key: "above_120001", category: "high_income" },
        ];

        const bracketData = brackets.find(b => totalIncome >= b.min && totalIncome <= b.max) || {};

        setUserData(prev => ({
            ...prev,
            family_monthly_income: totalIncome,
            income_bracket: bracketData.key || "",
            income_category: bracketData.category || "",
        }));
    }, [userData.members]);


    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">Education and Occupation</h2>
            <p className="text-sm text-gray-600 mb-3">
                Please provide education background and current occupation for each household member.
            </p>

            {members.map((member, index) => {
                const isOpen = openIndex === index;
                const displayName = `${member.firstname || ''} ${member.lastname || ''}`;

                return (
                    <div key={index} className="mb-4 border rounded shadow-sm bg-white">
                        <button
                            type="button"
                            className={`w-full text-left p-4 font-semibold flex justify-between items-center
                            ${isOpen ? 'border-t-2 border-blue-600 text-gray-900' : 'text-gray-700 hover:bg-sky-100'}
                            transition duration-300 ease-in-out`}
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                        >
                            {displayName.trim() || `Household Member ${index + 1}`}
                            {isOpen ? (
                                <IoIosArrowUp className="text-xl text-blue-600" />
                            ) : (
                                <IoIosArrowDown className="text-xl text-blue-600" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="p-4 space-y-4">
                                <p className="font-bold">Educational Background</p>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <RadioGroup
                                        label="Currently studying"
                                        name="is_student"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.is_student || ''}
                                        onChange={(e) => handleEducationChange(index, e)}
                                    />
                                </div>

                                {member.is_student == 1 && (
                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                        <InputField
                                            label="School Name"
                                            name="school_name"
                                            type="text"
                                            value={member.school_name || ''}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            placeholder="Enter school name"

                                        />

                                        <DropdownInputField
                                            label="Current Level"
                                            name="current_level"
                                            value={member.current_level || ''}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            items={[
                                                { label: "Elementary", value: "elementary" },
                                                { label: "High School", value: "high_school" },
                                                { label: "College", value: "college" },
                                                { label: "Vocational", value: "vocational" },
                                                { label: "Post Grad", value: "post_grad" },
                                            ]}

                                            placeholder="Select school level"
                                        />

                                        <RadioGroup
                                            label="School Type"
                                            name="school_type"
                                            options={[
                                                { label: 'Public', value: 'public' },
                                                { label: 'Private', value: 'private' },
                                            ]}
                                            selectedValue={member.school_type || ''}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </div>
                                )}
                                {member.is_student == 0 && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-10 mt-4">
                                            <div className="grid md:grid-cols-2 gap-2">
                                                <DropdownInputField
                                                    label="Highest Educational Attainment"
                                                    name="education"
                                                    value={member.education || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    items={[
                                                        { label: "No Formal Education", value: "no_formal_education" },
                                                        { label: "Elementary", value: "elementary" },
                                                        { label: "High School", value: "high_school" },
                                                        { label: "College", value: "college" },
                                                        { label: "Post Grad", value: "post_grad" },
                                                        { label: "Vocational", value: "vocational" },
                                                    ]}

                                                    placeholder="Select your Educational Attainment"
                                                />

                                                <RadioGroup
                                                    label="Educational Status"
                                                    name="education_status"
                                                    options={[
                                                        { label: 'Graduate', value: 'graduate' },
                                                        { label: 'Undergraduate', value: 'undergraduate' },
                                                    ]}
                                                    selectedValue={member.education_status || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    disabled={member.education === 'No Formal Education'}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {member.age >= 6 && member.age <= 14 && (
                                                    <RadioGroup
                                                        label="Out of School Children (6-14 years old)"
                                                        name="osc"
                                                        options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                        selectedValue={member.osc || ''}
                                                        onChange={(e) => handleEducationChange(index, e)}
                                                    />

                                                )}
                                                {member.age >= 15 && member.age <= 24 && (
                                                    <RadioGroup
                                                        label="Out of School Youth (15-24 years old)"
                                                        name="osy"
                                                        options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                        selectedValue={member.osy || ''}
                                                        onChange={(e) => handleEducationChange(index, e)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                                            <InputField
                                                label="School Name"
                                                name="school_name"
                                                type="text"
                                                value={member.school_name || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                placeholder="Enter school name"
                                                disabled={member.education === 'No Formal Education'}
                                            />
                                            <RadioGroup
                                                label="School Type"
                                                name="school_type"
                                                options={[
                                                    { label: 'Public', value: 'public' },
                                                    { label: 'Private', value: 'private' },
                                                ]}
                                                selectedValue={member.school_type || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                disabled={member.education === 'No Formal Education'}
                                            />
                                            <YearDropdown
                                                label="Year Started"
                                                name="year_started"
                                                value={member.year_started || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                disabled={member.education === 'No Formal Education'}

                                            />

                                            <YearDropdown
                                                label="Year Ended"
                                                name="year_ended"
                                                value={member.year_ended || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                disabled={member.education === 'No Formal Education'}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                                            {(member.education === 'college' && member.education_status === 'graduate') && (
                                                <InputField
                                                    label="Finised Course"
                                                    name="program"
                                                    type="text"
                                                    value={member.program || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    placeholder="Enter your course"
                                                    disabled={member.education === 'No Formal Education'}
                                                />
                                            )}

                                            {member.education_status === "graduate" && (
                                                <YearDropdown
                                                    label="Year Graduated"
                                                    name="year_graduated"
                                                    value={member.year_graduated || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    disabled
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                                <hr className="h-px bg-sky-500 border-0 transform scale-y-100 origin-center" />
                                <p className="font-bold">Occupation Background</p>

                                {(member.occupations || []).map((occupation, occIndex) => (
                                    <div key={occIndex} className="border p-4 mb-4 rounded-md relative bg-gray-50">
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <DropdownInputField
                                                label="Employment Status"
                                                name="employment_status"
                                                value={occupation.employment_status || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Select employment status"
                                                items={[
                                                    { label: 'Employed', value: 'employed' },
                                                    { label: 'Unemployed', value: 'unemployed' },
                                                    { label: 'Student', value: 'student' },
                                                    { label: 'Self Employed', value: 'self_employed' },
                                                    { label: 'Retired', value: 'retired' },
                                                ]}
                                            />
                                            <DropdownInputField
                                                label="Occupation"
                                                name="occupation"
                                                value={occupation.occupation || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Select or Enter Occupation"
                                                items={['Farmer', 'Nurse', 'Teacher', 'Vendor']}
                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <DropdownInputField
                                                label="Employment Type"
                                                name="employment_type"
                                                value={occupation.employment_type || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Select employment type"
                                                items={[
                                                    { label: 'Full-time', value: 'full_time' },
                                                    { label: 'Part-time', value: 'part_time' },
                                                    { label: 'Seasonal', value: 'seasonal' },
                                                    { label: 'Contractual', value: 'contractual' },
                                                    { label: 'Self-employed', value: 'self_employed' },
                                                ]}

                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <DropdownInputField
                                                label="Status" name="occupation_status"
                                                value={occupation.occupation_status || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Select employment status"
                                                items={[
                                                    { label: 'Active', value: 'active' },
                                                    { label: 'Inactive', value: 'inactive', },
                                                    { label: 'Ended', value: 'ended' },
                                                    { label: 'Retired', value: 'retired' },
                                                ]}

                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <RadioGroup
                                                label="Work Arrangement"
                                                name="work_arrangement"
                                                options={[
                                                    { label: 'Remote', value: 'remote' },
                                                    { label: 'Onsite', value: 'onsite' },
                                                    { label: 'Hybrid', value: 'hybrid' },
                                                ]}

                                                selectedValue={occupation.work_arrangement || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <InputField
                                                label="Employer name"
                                                name="employer" type="text"
                                                value={occupation.employer || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Enter employer name"
                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <YearDropdown
                                                label="Year Started"
                                                name="started_at"
                                                value={occupation.started_at || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <YearDropdown
                                                label="Year Ended"
                                                name="ended_at"
                                                value={occupation.ended_at || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                disabled={occupation.occupation_status === 'active' || occupation.occupation_status === 'inactive'}
                                            />
                                            <DropdownInputField
                                                label="Income Frequency"
                                                name="frequency"
                                                value={occupation.frequency || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                items={['daily', 'weekly', 'bi-weekly', 'monthly']}
                                                placeholder="Select Frequency"
                                                disabled={occupation.employment_status === 'Unemployed'}
                                            />
                                            <InputField
                                                type="number"
                                                label="Income"
                                                name="income"
                                                value={occupation.income || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Enter income"
                                                disabled={occupation.employment_status === 'Unemployed'} />
                                            <InputField
                                                type="number"
                                                label="Monthly Income"
                                                name="monthly_income"
                                                value={occupation.monthly_income || ''}
                                                onChange={(e) => handleOccupationChange(index, occIndex, e)}
                                                placeholder="Automatically computed"
                                                disabled={occupation.employment_status === 'Unemployed'}
                                                hidden
                                            />

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeOccupation(index, occIndex)}
                                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                        >
                                            <IoIosCloseCircleOutline className="text-2xl" />
                                        </button>
                                    </div>
                                ))}

                                {/* HIDDEN FAMILY MONTHLY INCOME + BRACKET + CATEGORY */}
                                <div className="hidden">
                                    <InputField
                                        label="Family Monthly Income"
                                        name="family_monthly_income"
                                        value={userData.family_monthly_income || ''}
                                        readOnly={true}
                                    />
                                    <DropdownInputField
                                        label="Income Bracket"
                                        name="income_bracket"
                                        value={userData.income_bracket || ''}
                                        items={[userData.income_bracket || '']}
                                        readOnly={true}
                                    />
                                    <DropdownInputField
                                        label="Income Category"
                                        name="income_category"
                                        value={userData.income_category || ''}
                                        items={[userData.income_category || '']}
                                        readOnly={true}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addOccupation(index)}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-4xl" />
                                    <span>Add Occupation</span>
                                </button>

                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default EducationandOccupation;
