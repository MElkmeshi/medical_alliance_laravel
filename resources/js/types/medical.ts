export type Company = {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    employees_count?: number;
    employees?: Employee[];
    examination_profiles?: ExaminationProfile[];
    created_at: string;
    updated_at: string;
};

export type Examination = {
    id: number;
    name: string;
    description: string | null;
    unit: string | null;
    min_value: string | null;
    max_value: string | null;
    is_required: boolean;
    requires_document: boolean;
    is_active: boolean;
    pivot?: { sort_order: number };
    created_at: string;
    updated_at: string;
};

export type ExaminationProfile = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    examinations_count?: number;
    examinations?: Examination[];
    created_at: string;
    updated_at: string;
};

export type Employee = {
    id: number;
    company_id: number;
    name: string;
    sex: string | null;
    nationality: string | null;
    national_id: string;
    home_address: string | null;
    company_employee_number: string | null;
    job_description: string | null;
    job_location: string | null;
    date_of_birth: string | null;
    phone: string | null;
    email: string | null;
    company?: Company;
    checkups?: Checkup[];
    created_at: string;
    updated_at: string;
};

export type Checkup = {
    id: number;
    employee_id: number;
    examination_profile_id: number;
    checkup_date: string;
    exam_type: 'pre_employment' | 'periodic' | 'other' | null;
    job_environment: 'office' | 'rig_field' | 'workshop_laboratory' | null;
    status: 'pending' | 'pass' | 'fail';
    notes: string | null;
    performed_by: number | null;
    employee?: Employee;
    examination_profile?: ExaminationProfile;
    results?: CheckupResult[];
    performer?: { id: number; name: string };
    created_at: string;
    updated_at: string;
};

export type CheckupResult = {
    id: number;
    checkup_id: number;
    examination_id: number;
    value: string | null;
    is_normal: boolean | null;
    document_path: string | null;
    notes: string | null;
    examination?: Examination;
    created_at: string;
    updated_at: string;
};
