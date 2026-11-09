import {
    useRef,
    useState,
    type FormEvent,
} from 'react';

import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Plus,
    Trash2,
} from 'lucide-react';

// ==============================================
// TYPES
// ==============================================

export interface PrimaryResearcher {
    fullName: string;
    email: string;
    studentNumber: string;
    contactNumber: string;
}

export interface GroupMember {
    id: number;
    fullName: string;
    email: string;
    studentNumber: string;
}

export interface ResearchAdviser {
    fullName: string;
    email: string;
    department: string;
}

export interface TeamData {
    primary: PrimaryResearcher;
    members: GroupMember[];
    adviser: ResearchAdviser;
}

interface AuthUser {
    name?: string;
    email?: string;
    student_number?: string;
    studentNumber?: string;
}

// ==============================================
// INITIAL DATA
// ==============================================

export function initialTeam(
    user?: AuthUser,
): TeamData {
    return {
        primary: {
            fullName: user?.name || '',
            email: user?.email || '',
            studentNumber:
                user?.student_number ||
                user?.studentNumber ||
                '',
            contactNumber: '',
        },

        members: [
            {
                id: 1,
                fullName: '',
                email: '',
                studentNumber: '',
            },
        ],

        adviser: {
            fullName: '',
            email: '',
            department: '',
        },
    };
}

// ==============================================
// VALIDATION
// ==============================================

function validEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim(),
    );
}

export function teamIsComplete(
    data: TeamData,
): boolean {
    const { primary, members, adviser } = data;

    const primaryValid = Boolean(
        primary.fullName.trim() &&
        validEmail(primary.email) &&
        primary.studentNumber.trim() &&
        primary.contactNumber.trim(),
    );

    const adviserValid = Boolean(
        adviser.fullName.trim() &&
        validEmail(adviser.email) &&
        adviser.department.trim(),
    );

    // Empty rows are optional.
    // If any field is filled, complete the whole row.
    const filledMembers = members.filter(
        (member) =>
            member.fullName.trim() ||
            member.email.trim() ||
            member.studentNumber.trim(),
    );

    const membersValid = filledMembers.every(
        (member) =>
            member.fullName.trim() &&
            validEmail(member.email) &&
            member.studentNumber.trim(),
    );

    // Prevent repeated student identities.
    const emails = [
        primary.email.trim().toLowerCase(),
        ...filledMembers.map((member) =>
            member.email.trim().toLowerCase(),
        ),
    ];

    const studentNumbers = [
        primary.studentNumber.trim().toLowerCase(),
        ...filledMembers.map((member) =>
            member.studentNumber.trim().toLowerCase(),
        ),
    ];

    const uniqueEmails =
        new Set(emails).size === emails.length;

    const uniqueStudentNumbers =
        new Set(studentNumbers).size ===
        studentNumbers.length;

    return Boolean(
        primaryValid &&
        adviserValid &&
        membersValid &&
        uniqueEmails &&
        uniqueStudentNumbers,
    );
}

// ==============================================
// PROPS
// ==============================================

interface Props {
    value: TeamData;
    onChange: (value: TeamData) => void;
    onBack: () => void;
    onSaveDraft: () => void;
    onNext: () => void;
}

// ==============================================
// STYLES
// ==============================================

const inputClass =
    'h-[40px] w-full rounded-md border border-[#cdd7e8] bg-white px-4 text-[13px] text-[#171725] placeholder:text-[#8a9bb6] focus:border-[#a50021] focus:ring-1 focus:ring-[#a50021]';

const labelClass =
    'mb-1 block text-[13px] font-medium text-[#171725]';

const outlineButton =
    'inline-flex h-[44px] items-center justify-center gap-2 rounded-md border border-[#a50021] px-5 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]';

// ==============================================
// COMPONENT
// ==============================================

export default function Step2Researchers({
    value,
    onChange,
    onBack,
    onSaveDraft,
    onNext,
}: Props) {
    const [error, setError] = useState('');

    const nextMemberId = useRef(
        Math.max(
            0,
            ...value.members.map((member) => member.id),
        ) + 1,
    );

    // UPDATE PRIMARY RESEARCHER
    function updatePrimary<
        K extends keyof PrimaryResearcher
    >(
        field: K,
        newValue: PrimaryResearcher[K],
    ) {
        onChange({
            ...value,
            primary: {
                ...value.primary,
                [field]: newValue,
            },
        });

        setError('');
    }

    // UPDATE ADVISER
    function updateAdviser<
        K extends keyof ResearchAdviser
    >(
        field: K,
        newValue: ResearchAdviser[K],
    ) {
        onChange({
            ...value,
            adviser: {
                ...value.adviser,
                [field]: newValue,
            },
        });

        setError('');
    }

    // UPDATE GROUP MEMBER
    function updateMember(
        id: number,
        field: 'fullName' | 'email' | 'studentNumber',
        newValue: string,
    ) {
        onChange({
            ...value,
            members: value.members.map((member) =>
                member.id === id
                    ? {
                          ...member,
                          [field]: newValue,
                      }
                    : member,
            ),
        });

        setError('');
    }

    // ADD MEMBER
    function addMember() {
        const id = nextMemberId.current++;

        onChange({
            ...value,
            members: [
                ...value.members,
                {
                    id,
                    fullName: '',
                    email: '',
                    studentNumber: '',
                },
            ],
        });
    }

    // REMOVE MEMBER
    function removeMember(id: number) {
        onChange({
            ...value,
            members: value.members.filter(
                (member) => member.id !== id,
            ),
        });

        setError('');
    }

    // SUBMIT STEP
    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!teamIsComplete(value)) {
            setError(
                'Complete the required researcher and adviser fields. Added group members must have complete details, and duplicate student emails or student numbers are not allowed.',
            );
            return;
        }

        onNext();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white px-5 py-4 sm:px-6"
        >
            {/* FORM HEADER */}
            <div className="mb-3">
                <h2 className="text-[23px] font-extrabold tracking-tight text-[#171725]">
                    Researchers and adviser
                </h2>

                <p className="mt-0.5 text-[14px] text-[#7b8eae]">
                    Fields marked{' '}
                    <span className="font-bold text-red-600">*</span>{' '}
                    are required.
                </p>
            </div>

            {/* =====================================
                PRIMARY RESEARCHER
            ===================================== */}

            <section>
                <h3 className="text-[18px] font-extrabold text-[#171725]">
                    Primary researcher
                </h3>

                <p className="mb-2 text-[13px] text-[#7b8eae]">
                    Main contact for this application.
                </p>

                <div className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-2">

                    {/* FULL NAME */}
                    <div>
                        <label
                            htmlFor="primaryFullName"
                            className={labelClass}
                        >
                            Full name{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="primaryFullName"
                            type="text"
                            required
                            value={value.primary.fullName}
                            onChange={(e) =>
                                updatePrimary(
                                    'fullName',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter full name"
                            className={inputClass}
                        />
                    </div>

                    {/* UNIVERSITY EMAIL */}
                    <div>
                        <label
                            htmlFor="primaryEmail"
                            className={labelClass}
                        >
                            University email{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="primaryEmail"
                            type="email"
                            required
                            value={value.primary.email}
                            onChange={(e) =>
                                updatePrimary(
                                    'email',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter university email"
                            className={inputClass}
                        />
                    </div>

                    {/* STUDENT NUMBER */}
                    <div>
                        <label
                            htmlFor="primaryStudentNumber"
                            className={labelClass}
                        >
                            Student number{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="primaryStudentNumber"
                            type="text"
                            required
                            value={value.primary.studentNumber}
                            onChange={(e) =>
                                updatePrimary(
                                    'studentNumber',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter student number"
                            className={inputClass}
                        />
                    </div>

                    {/* CONTACT NUMBER */}
                    <div>
                        <label
                            htmlFor="primaryContactNumber"
                            className={labelClass}
                        >
                            Contact number{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="primaryContactNumber"
                            type="tel"
                            required
                            value={value.primary.contactNumber}
                            onChange={(e) =>
                                updatePrimary(
                                    'contactNumber',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter contact number"
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            {/* =====================================
                GROUP MEMBERS
            ===================================== */}

            <section className="mt-5 border-t border-[#dce2ec] pt-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">

                    <div>
                        <h3 className="text-[18px] font-extrabold text-[#171725]">
                            Group members
                        </h3>

                        <p className="mt-0.5 text-[13px] text-[#7b8eae]">
                            Add each co-researcher once. Do not
                            repeat the primary researcher.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={addMember}
                        className="inline-flex h-[36px] items-center gap-2 rounded-md border border-[#a50021] px-4 text-[13px] font-bold text-[#a50021] hover:bg-[#fff0f3]"
                    >
                        <Plus size={19} />
                        Add member
                    </button>
                </div>

                {/* MEMBERS TABLE */}
                <div className="overflow-x-auto rounded-md border border-[#d7dfea]">
                    <table className="w-full min-w-[750px] border-collapse text-left">

                        <thead className="bg-[#eef0f5]">
                            <tr className="text-[12px] font-bold text-[#344568]">
                                <th className="w-[30%] px-4 py-2">
                                    Full name
                                </th>

                                <th className="w-[30%] px-3 py-2">
                                    University email
                                </th>

                                <th className="w-[30%] px-3 py-2">
                                    Student number
                                </th>

                                <th className="w-[10%] px-3 py-2 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#dce2ec]">

                            {value.members.map((member) => {
                                const hasValue = Boolean(
                                    member.fullName.trim() ||
                                    member.email.trim() ||
                                    member.studentNumber.trim(),
                                );

                                return (
                                    <tr key={member.id}>

                                        {/* MEMBER NAME */}
                                        <td className="px-3 py-2">
                                            <input
                                                type="text"
                                                aria-label="Group member full name"
                                                required={hasValue}
                                                value={member.fullName}
                                                onChange={(e) =>
                                                    updateMember(
                                                        member.id,
                                                        'fullName',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter full name"
                                                className={inputClass}
                                            />
                                        </td>

                                        {/* MEMBER EMAIL */}
                                        <td className="px-2 py-2">
                                            <input
                                                type="email"
                                                aria-label="Group member university email"
                                                required={hasValue}
                                                value={member.email}
                                                onChange={(e) =>
                                                    updateMember(
                                                        member.id,
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter university email"
                                                className={inputClass}
                                            />
                                        </td>

                                        {/* MEMBER STUDENT NUMBER */}
                                        <td className="px-2 py-2">
                                            <input
                                                type="text"
                                                aria-label="Group member student number"
                                                required={hasValue}
                                                value={member.studentNumber}
                                                onChange={(e) =>
                                                    updateMember(
                                                        member.id,
                                                        'studentNumber',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter student number"
                                                className={inputClass}
                                            />
                                        </td>

                                        {/* REMOVE BUTTON */}
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeMember(member.id)
                                                }
                                                aria-label="Remove group member"
                                                className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-md text-[#d00027] hover:bg-[#fff0f3]"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {value.members.length === 0 && (
                        <p className="py-5 text-center text-[13px] text-[#8291a9]">
                            No group members added. Click Add
                            member to include a co-researcher.
                        </p>
                    )}
                </div>
            </section>

            {/* =====================================
                RESEARCH ADVISER
            ===================================== */}

            <section className="mt-4 border-t border-[#dce2ec] pt-3">

                <h3 className="mb-2 text-[18px] font-extrabold text-[#171725]">
                    Research adviser
                </h3>

                <div className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-2">

                    {/* ADVISER NAME */}
                    <div>
                        <label
                            htmlFor="adviserName"
                            className={labelClass}
                        >
                            Adviser full name{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="adviserName"
                            type="text"
                            required
                            value={value.adviser.fullName}
                            onChange={(e) =>
                                updateAdviser(
                                    'fullName',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter adviser full name"
                            className={inputClass}
                        />
                    </div>

                    {/* ADVISER EMAIL */}
                    <div>
                        <label
                            htmlFor="adviserEmail"
                            className={labelClass}
                        >
                            Adviser email{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="adviserEmail"
                            type="email"
                            required
                            value={value.adviser.email}
                            onChange={(e) =>
                                updateAdviser(
                                    'email',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter adviser email"
                            className={inputClass}
                        />
                    </div>

                    {/* ADVISER DEPARTMENT */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="adviserDepartment"
                            className={labelClass}
                        >
                            Department / Affiliation{' '}
                            <span className="text-red-600">*</span>
                        </label>

                        <input
                            id="adviserDepartment"
                            type="text"
                            required
                            value={value.adviser.department}
                            onChange={(e) =>
                                updateAdviser(
                                    'department',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter department or affiliation"
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            {/* ERROR */}
            {error && (
                <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-lg bg-[#fff0f3] px-4 py-3 text-[13px] text-[#a50021]"
                >
                    <AlertCircle
                        size={19}
                        className="shrink-0"
                    />

                    {error}
                </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#e0e5ed] pt-4 sm:flex-row sm:items-center">

                <button
                    type="button"
                    onClick={onBack}
                    className={outlineButton}
                >
                    <ArrowLeft size={19} />
                    Back: Research details
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className={outlineButton}
                    >
                        Save draft
                    </button>

                    <button
                        type="submit"
                        className="inline-flex h-[44px] items-center justify-center gap-2 rounded-md bg-[#a50021] px-5 text-[13px] font-bold text-white hover:bg-[#87001b]"
                    >
                        Next: Ethics questions
                        <ArrowRight size={19} />
                    </button>
                </div>
            </div>
        </form>
    );
}