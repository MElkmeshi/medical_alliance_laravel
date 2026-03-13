<?php

namespace Database\Seeders;

use App\Models\Checkup;
use App\Models\CheckupResult;
use App\Models\Company;
use App\Models\Employee;
use App\Models\Examination;
use App\Models\ExaminationProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class MedicalDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examinations = $this->createExaminations();
        $profiles = $this->createExaminationProfiles($examinations);
        $companies = $this->createCompanies($profiles);
        $this->createUsers($companies);
        $employees = $this->createEmployees($companies);
        $this->createSampleCheckups($employees, $profiles, $examinations);
    }

    /**
     * @return array<string, Examination>
     */
    private function createExaminations(): array
    {
        $definitions = [
            // ── Physical Examination (14 body systems) ──────────────────────
            'eyes_pupils' => ['name' => 'Eyes and Pupils',               'description' => 'Physical exam — eyes and pupils'],
            'ear_nose_throat' => ['name' => 'Ear / Nose / Throat',           'description' => 'Physical exam — ear, nose, throat'],
            'teeth_mouth' => ['name' => 'Teeth and Mouth',               'description' => 'Physical exam — teeth and mouth'],
            'lungs_chest' => ['name' => 'Lungs and Chest',               'description' => 'Physical exam — lungs and chest'],
            'cardiovascular' => ['name' => 'Cardiovascular',                'description' => 'Physical exam — cardiovascular system'],
            'abdomen_viscera' => ['name' => 'Abdomen / Viscera',             'description' => 'Physical exam — abdomen and viscera'],
            'hernial_orifices' => ['name' => 'Hernial Orifices',              'description' => 'Physical exam — hernial orifices'],
            'anus_rectum' => ['name' => 'Anus and Rectum',               'description' => 'Physical exam — anus and rectum'],
            'genito_urinary' => ['name' => 'Genito-urinary',                'description' => 'Physical exam — genito-urinary system'],
            'extremities' => ['name' => 'Extremities',                   'description' => 'Physical exam — extremities'],
            'musculo_skeletal' => ['name' => 'Musculo-skeletal',              'description' => 'Physical exam — musculo-skeletal system'],
            'skin_varicose_veins' => ['name' => 'Skin / Varicose Veins',        'description' => 'Physical exam — skin and varicose veins'],
            'neurological' => ['name' => 'Neurological / Mental Fitness', 'description' => 'Physical exam — neurological and mental fitness'],
            'breast' => ['name' => 'Breast',                        'description' => 'Physical exam — breast', 'is_required' => false],

            // ── Vitals ───────────────────────────────────────────────────────
            'height' => ['name' => 'Height',         'unit' => 'cm'],
            'weight' => ['name' => 'Weight',         'unit' => 'kg'],
            'blood_pressure' => ['name' => 'Blood Pressure', 'unit' => 'mmHg'],
            'pulse' => ['name' => 'Pulse',          'unit' => 'bpm', 'min_value' => 60, 'max_value' => 100],

            // ── Hearing & Vision ─────────────────────────────────────────────
            'hearing_right' => ['name' => 'Hearing — Right'],
            'hearing_left' => ['name' => 'Hearing — Left'],
            'vision_distant_right' => ['name' => 'Vision Distant — Right'],
            'vision_distant_left' => ['name' => 'Vision Distant — Left'],
            'vision_near_right' => ['name' => 'Vision Near — Right'],
            'vision_near_left' => ['name' => 'Vision Near — Left'],
            'color_vision' => ['name' => 'Color Vision', 'is_required' => false],

            // ── Complete Blood Count (CBC) ────────────────────────────────────
            'rbc' => ['name' => 'RBC',                      'unit' => 'M/mm³',  'min_value' => 4.50,  'max_value' => 5.50],
            'wbc' => ['name' => 'WBC',                      'unit' => '/mm³',   'min_value' => 4000,  'max_value' => 11000],
            'platelets' => ['name' => 'Platelets',                'unit' => '10³/µL', 'min_value' => 150,   'max_value' => 400],
            'neutrophils' => ['name' => 'Neutrophils',              'unit' => '%',      'min_value' => 50,    'max_value' => 70],
            'eosinophils' => ['name' => 'Eosinophils',              'unit' => '%',      'min_value' => 1,     'max_value' => 4],
            'basophils' => ['name' => 'Basophils',                'unit' => '%',      'min_value' => 0,     'max_value' => 1],
            'lymphocytes' => ['name' => 'Lymphocytes',              'unit' => '%',      'min_value' => 20,    'max_value' => 40],
            'monocytes' => ['name' => 'Monocytes',                'unit' => '%',      'min_value' => 2,     'max_value' => 8],
            'hematocrit' => ['name' => 'Hematocrit',               'unit' => '%',      'min_value' => 36,    'max_value' => 48],
            'hemoglobin' => ['name' => 'Hemoglobin',               'unit' => 'g/dL',   'min_value' => 12,    'max_value' => 17],
            'esr' => ['name' => 'ESR (Sedimentation Rate)', 'unit' => 'mm/hr',  'min_value' => 0,     'max_value' => 20],

            // ── Liver Function ───────────────────────────────────────────────
            'sgot_asat' => ['name' => 'SGOT (ASAT)',               'unit' => 'UI', 'min_value' => 10, 'max_value' => 40],
            'sgpt_alat' => ['name' => 'SGPT (ALAT)',               'unit' => 'UI', 'min_value' => 7,  'max_value' => 56],
            'alp' => ['name' => 'ALP (Alkaline Phosphatase)', 'unit' => 'UI', 'min_value' => 44, 'max_value' => 147],
            'gamma_gt' => ['name' => 'Gamma GT',                  'unit' => 'UI', 'min_value' => 9,  'max_value' => 48],

            // ── Metabolic Panel ──────────────────────────────────────────────
            'blood_sugar_fasting' => ['name' => 'Blood Sugar (Fasting)', 'unit' => 'mmol/l', 'min_value' => 3.90, 'max_value' => 6.10],
            'hba1c' => ['name' => 'HbA1c',                 'unit' => '%',      'max_value' => 5.70],
            'cholesterol_total' => ['name' => 'Cholesterol Total',     'unit' => 'mmol/l', 'max_value' => 5.20],
            'hdl' => ['name' => 'HDL',                   'unit' => 'mmol/l', 'min_value' => 1.00],
            'ldl' => ['name' => 'LDL',                   'unit' => 'mmol/l', 'max_value' => 3.40],
            'triglycerides' => ['name' => 'Triglycerides',         'unit' => 'mmol/l', 'max_value' => 1.70],
            'creatinine' => ['name' => 'Creatinine',            'unit' => 'µmol/l', 'min_value' => 62,   'max_value' => 115],
            'uric_acid' => ['name' => 'Uric Acid',             'unit' => 'µmol/l', 'min_value' => 200,  'max_value' => 430],
            'tsh' => ['name' => 'TSH',                   'unit' => 'uIU/mL', 'min_value' => 0.40, 'max_value' => 4.00],

            // ── Viral Screen ─────────────────────────────────────────────────
            'hbsag' => ['name' => 'HBsAg (Hepatitis B)', 'description' => 'Hepatitis B surface antigen — Negative is normal'],
            'hcv' => ['name' => 'HCV (Hepatitis C)',    'description' => 'Hepatitis C virus — Negative is normal'],
            'hiv' => ['name' => 'HIV',                  'description' => 'HIV — Negative is normal'],

            // ── Urine Analysis ───────────────────────────────────────────────
            'urine_albumin' => ['name' => 'Urine — Albumin', 'is_required' => false],
            'urine_sugar' => ['name' => 'Urine — Sugar',   'is_required' => false],
            'urine_blood' => ['name' => 'Urine — Blood',   'is_required' => false],

            // ── Stool Analysis ───────────────────────────────────────────────
            'stool_occult_blood' => ['name' => 'Stool — Occult Blood', 'is_required' => false],
            'stool_parasites' => ['name' => 'Stool — Parasites',    'is_required' => false],

            // ── Para-Clinical ────────────────────────────────────────────────
            'ecg' => ['name' => 'ECG',                    'requires_document' => true, 'is_required' => false],
            'cardiac_stress_test' => ['name' => 'Cardiac Stress Test',    'requires_document' => true, 'is_required' => false],
            'chest_xray' => ['name' => 'Chest X-Ray',            'requires_document' => true],
            'spirometer_test' => ['name' => 'Spirometer Test',        'is_required' => false],
            'peripheral_blood_smear' => ['name' => 'Peripheral Blood Smear', 'is_required' => false],

            // ── Drug Testing ─────────────────────────────────────────────────
            'drug_cannabis' => ['name' => 'Drug Test — Cannabis',          'description' => 'Negative is normal'],
            'drug_cocaine' => ['name' => 'Drug Test — Cocaine',           'description' => 'Negative is normal'],
            'drug_heroin_morphine' => ['name' => 'Drug Test — Heroin / Morphine', 'description' => 'Negative is normal'],
            'drug_amphetamine' => ['name' => 'Drug Test — Amphetamine',       'description' => 'Negative is normal'],

            // ── Psychological Scores ─────────────────────────────────────────
            'kessler_k10' => ['name' => 'Kessler K10 Score',        'unit' => 'score', 'min_value' => 10, 'max_value' => 19, 'is_required' => false],
            'epworth_sleepiness' => ['name' => 'Epworth Sleepiness Scale', 'unit' => 'score', 'min_value' => 0,  'max_value' => 10, 'is_required' => false],
        ];

        $examinations = [];

        foreach ($definitions as $key => $attrs) {
            $examinations[$key] = Examination::create([
                'name' => $attrs['name'],
                'description' => $attrs['description'] ?? null,
                'unit' => $attrs['unit'] ?? null,
                'min_value' => $attrs['min_value'] ?? null,
                'max_value' => $attrs['max_value'] ?? null,
                'is_required' => $attrs['is_required'] ?? true,
                'requires_document' => $attrs['requires_document'] ?? false,
            ]);
        }

        return $examinations;
    }

    /**
     * Sync an ordered list of examination keys to a profile.
     *
     * @param  array<string, Examination>  $examinations
     * @param  list<string>  $keys
     */
    private function syncExams(ExaminationProfile $profile, array $examinations, array $keys): void
    {
        $sync = [];

        foreach (array_values($keys) as $order => $key) {
            $sync[$examinations[$key]->id] = ['sort_order' => $order + 1];
        }

        $profile->examinations()->sync($sync);
    }

    /**
     * @param  array<string, Examination>  $examinations
     * @return array<string, ExaminationProfile>
     */
    private function createExaminationProfiles(array $examinations): array
    {
        // ── SLB MedCheck Full (all examinations) ────────────────────────────
        $slbFull = ExaminationProfile::create([
            'name' => 'SLB MedCheck Full',
            'description' => 'Complete SLB MedCheck Physical — OGUK guidelines. Covers all physical, blood, para-clinical, drug, and psychological examinations.',
        ]);
        $this->syncExams($slbFull, $examinations, [
            // Physical
            'eyes_pupils', 'ear_nose_throat', 'teeth_mouth', 'lungs_chest', 'cardiovascular',
            'abdomen_viscera', 'hernial_orifices', 'anus_rectum', 'genito_urinary',
            'extremities', 'musculo_skeletal', 'skin_varicose_veins', 'neurological', 'breast',
            // Vitals
            'height', 'weight', 'blood_pressure', 'pulse',
            // Hearing & Vision
            'hearing_right', 'hearing_left',
            'vision_distant_right', 'vision_distant_left',
            'vision_near_right', 'vision_near_left', 'color_vision',
            // CBC
            'rbc', 'wbc', 'platelets', 'neutrophils', 'eosinophils', 'basophils',
            'lymphocytes', 'monocytes', 'hematocrit', 'hemoglobin', 'esr',
            // Liver
            'sgot_asat', 'sgpt_alat', 'alp', 'gamma_gt',
            // Metabolic
            'blood_sugar_fasting', 'hba1c', 'cholesterol_total', 'hdl', 'ldl',
            'triglycerides', 'creatinine', 'uric_acid', 'tsh',
            // Viral
            'hbsag', 'hcv', 'hiv',
            // Urine
            'urine_albumin', 'urine_sugar', 'urine_blood',
            // Stool
            'stool_occult_blood', 'stool_parasites',
            // Para-Clinical
            'ecg', 'cardiac_stress_test', 'chest_xray', 'spirometer_test', 'peripheral_blood_smear',
            // Drug
            'drug_cannabis', 'drug_cocaine', 'drug_heroin_morphine', 'drug_amphetamine',
            // Psychological
            'kessler_k10', 'epworth_sleepiness',
        ]);

        // ── Oil Field Pre-Employment ─────────────────────────────────────────
        $oilField = ExaminationProfile::create([
            'name' => 'Oil Field Pre-Employment',
            'description' => 'Pre-employment screening for oil field, rig, and offshore workers.',
        ]);
        $this->syncExams($oilField, $examinations, [
            'eyes_pupils', 'ear_nose_throat', 'teeth_mouth', 'lungs_chest', 'cardiovascular',
            'abdomen_viscera', 'hernial_orifices', 'anus_rectum', 'genito_urinary',
            'extremities', 'musculo_skeletal', 'skin_varicose_veins', 'neurological', 'breast',
            'height', 'weight', 'blood_pressure', 'pulse',
            'hearing_right', 'hearing_left',
            'vision_distant_right', 'vision_distant_left',
            'vision_near_right', 'vision_near_left', 'color_vision',
            'rbc', 'wbc', 'platelets', 'neutrophils', 'eosinophils', 'basophils',
            'lymphocytes', 'monocytes', 'hematocrit', 'hemoglobin', 'esr',
            'sgot_asat', 'sgpt_alat', 'alp', 'gamma_gt',
            'blood_sugar_fasting', 'hba1c', 'cholesterol_total', 'hdl', 'ldl',
            'triglycerides', 'creatinine', 'uric_acid',
            'hbsag', 'hcv', 'hiv',
            'chest_xray',
            'drug_cannabis', 'drug_cocaine', 'drug_heroin_morphine', 'drug_amphetamine',
        ]);

        // ── Annual Health Checkup ────────────────────────────────────────────
        $annual = ExaminationProfile::create([
            'name' => 'Annual Health Checkup',
            'description' => 'Standard annual health checkup for all employees.',
        ]);
        $this->syncExams($annual, $examinations, [
            'eyes_pupils', 'ear_nose_throat', 'teeth_mouth', 'lungs_chest', 'cardiovascular',
            'abdomen_viscera', 'hernial_orifices', 'anus_rectum', 'genito_urinary',
            'extremities', 'musculo_skeletal', 'skin_varicose_veins', 'neurological', 'breast',
            'height', 'weight', 'blood_pressure', 'pulse',
            'hearing_right', 'hearing_left',
            'vision_distant_right', 'vision_distant_left',
            'vision_near_right', 'vision_near_left',
            'rbc', 'wbc', 'platelets', 'neutrophils', 'eosinophils', 'basophils',
            'lymphocytes', 'monocytes', 'hematocrit', 'hemoglobin', 'esr',
            'blood_sugar_fasting',
            'sgot_asat', 'sgpt_alat', 'gamma_gt',
            'urine_albumin', 'urine_sugar', 'urine_blood',
            'ecg',
        ]);

        // ── Executive Health Screening ───────────────────────────────────────
        $executive = ExaminationProfile::create([
            'name' => 'Executive Health Screening',
            'description' => 'Comprehensive health screening for executive-level employees.',
        ]);
        $this->syncExams($executive, $examinations, [
            'eyes_pupils', 'ear_nose_throat', 'teeth_mouth', 'lungs_chest', 'cardiovascular',
            'abdomen_viscera', 'hernial_orifices', 'anus_rectum', 'genito_urinary',
            'extremities', 'musculo_skeletal', 'skin_varicose_veins', 'neurological', 'breast',
            'height', 'weight', 'blood_pressure', 'pulse',
            'hearing_right', 'hearing_left',
            'vision_distant_right', 'vision_distant_left',
            'vision_near_right', 'vision_near_left', 'color_vision',
            'rbc', 'wbc', 'platelets', 'neutrophils', 'eosinophils', 'basophils',
            'lymphocytes', 'monocytes', 'hematocrit', 'hemoglobin', 'esr',
            'sgot_asat', 'sgpt_alat', 'alp', 'gamma_gt',
            'blood_sugar_fasting', 'hba1c', 'cholesterol_total', 'hdl', 'ldl',
            'triglycerides', 'creatinine', 'uric_acid', 'tsh',
            'hbsag', 'hcv', 'hiv',
            'urine_albumin', 'urine_sugar', 'urine_blood',
            'ecg', 'cardiac_stress_test', 'chest_xray',
            'kessler_k10', 'epworth_sleepiness',
        ]);

        return [
            'slb_full' => $slbFull,
            'oil_field' => $oilField,
            'annual' => $annual,
            'executive' => $executive,
        ];
    }

    /**
     * @param  array<string, ExaminationProfile>  $profiles
     * @return array<string, Company>
     */
    private function createCompanies(array $profiles): array
    {
        $petroGulf = Company::create([
            'name' => 'PetroGulf Engineering',
            'contact_person' => 'Khalid Al-Mansour',
            'email' => 'info@petrogulf.com',
            'phone' => '+971-4-555-0101',
            'address' => '123 Sheikh Zayed Road, Dubai, UAE',
        ]);
        $petroGulf->examinationProfiles()->sync([
            $profiles['slb_full']->id,
            $profiles['oil_field']->id,
            $profiles['annual']->id,
        ]);

        $atlas = Company::create([
            'name' => 'Atlas Mining Corp',
            'contact_person' => 'Robert van der Berg',
            'email' => 'contact@atlasmining.co.za',
            'phone' => '+27-11-555-0202',
            'address' => '45 Sandton Drive, Johannesburg, South Africa',
        ]);
        $atlas->examinationProfiles()->sync([
            $profiles['oil_field']->id,
            $profiles['executive']->id,
        ]);

        $global = Company::create([
            'name' => 'Global Construction Ltd',
            'contact_person' => 'Li Wei Chen',
            'email' => 'hr@globalconstruction.com',
            'phone' => '+86-21-555-0303',
            'address' => '789 Nanjing Road, Shanghai, China',
        ]);
        $global->examinationProfiles()->sync([
            $profiles['annual']->id,
            $profiles['executive']->id,
        ]);

        return [
            'petrogulf' => $petroGulf,
            'atlas' => $atlas,
            'global' => $global,
        ];
    }

    /**
     * @param  array<string, Company>  $companies
     */
    private function createUsers(array $companies): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'PetroGulf Manager',
            'email' => 'petrogulf@example.com',
            'password' => 'password',
            'role' => 'company_member',
            'company_id' => $companies['petrogulf']->id,
        ]);

        User::create([
            'name' => 'Atlas Manager',
            'email' => 'atlas@example.com',
            'password' => 'password',
            'role' => 'company_member',
            'company_id' => $companies['atlas']->id,
        ]);

        User::create([
            'name' => 'Global Manager',
            'email' => 'global@example.com',
            'password' => 'password',
            'role' => 'company_member',
            'company_id' => $companies['global']->id,
        ]);
    }

    /**
     * @param  array<string, Company>  $companies
     * @return array<string, array<int, Employee>>
     */
    private function createEmployees(array $companies): array
    {
        $petroGulfEmployees = [
            Employee::create([
                'company_id' => $companies['petrogulf']->id,
                'name' => 'Ahmad Al-Rashid',
                'sex' => 'male',
                'nationality' => 'Emirati',
                'national_id' => 'AE-1990-78432',
                'home_address' => '14 Al Wasl Road, Dubai, UAE',
                'company_employee_number' => 'GIN-10045',
                'job_description' => 'Field Engineer',
                'job_location' => 'UAE',
                'date_of_birth' => '1990-03-15',
                'phone' => '+971-50-555-1001',
                'email' => 'ahmad.rashid@petrogulf.com',
            ]),
            Employee::create([
                'company_id' => $companies['petrogulf']->id,
                'name' => 'Mohammed Hassan',
                'sex' => 'male',
                'nationality' => 'Jordanian',
                'national_id' => 'AE-1985-62198',
                'home_address' => '87 Jumeirah Street, Dubai, UAE',
                'company_employee_number' => 'GIN-10078',
                'job_description' => 'Drilling Supervisor',
                'job_location' => 'UAE',
                'date_of_birth' => '1985-07-22',
                'phone' => '+971-50-555-1002',
                'email' => 'mohammed.hassan@petrogulf.com',
            ]),
            Employee::create([
                'company_id' => $companies['petrogulf']->id,
                'name' => 'Sara Al-Khalili',
                'sex' => 'female',
                'nationality' => 'Omani',
                'national_id' => 'AE-1992-41567',
                'home_address' => '22 Business Bay, Dubai, UAE',
                'company_employee_number' => 'GIN-10112',
                'job_description' => 'HSE Officer',
                'job_location' => 'UAE',
                'date_of_birth' => '1992-11-08',
                'phone' => '+971-50-555-1003',
                'email' => 'sara.khalili@petrogulf.com',
            ]),
        ];

        $atlasEmployees = [
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'John Smith',
                'sex' => 'male',
                'nationality' => 'South African',
                'national_id' => 'ZA-1988-93521',
                'home_address' => '5 Rivonia Road, Johannesburg, South Africa',
                'job_description' => 'Mine Supervisor',
                'job_location' => 'South Africa',
                'date_of_birth' => '1988-01-12',
                'phone' => '+27-82-555-2001',
                'email' => 'john.smith@atlasmining.co.za',
            ]),
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'David Wilson',
                'sex' => 'male',
                'nationality' => 'British',
                'national_id' => 'ZA-1991-47832',
                'home_address' => '18 Nelson Mandela Square, Johannesburg, South Africa',
                'job_description' => 'Geologist',
                'job_location' => 'South Africa',
                'date_of_birth' => '1991-06-30',
                'phone' => '+27-82-555-2002',
                'email' => 'david.wilson@atlasmining.co.za',
            ]),
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'Maria Garcia',
                'sex' => 'female',
                'nationality' => 'Spanish',
                'national_id' => 'ZA-1987-15943',
                'home_address' => '33 Sandton Drive, Johannesburg, South Africa',
                'job_description' => 'Environmental Engineer',
                'job_location' => 'South Africa',
                'date_of_birth' => '1987-09-18',
                'phone' => '+27-82-555-2003',
                'email' => 'maria.garcia@atlasmining.co.za',
            ]),
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'James Brown',
                'sex' => 'male',
                'nationality' => 'South African',
                'national_id' => 'ZA-1993-28764',
                'home_address' => '9 West Street, Sandton, South Africa',
                'job_description' => 'Equipment Operator',
                'job_location' => 'South Africa',
                'date_of_birth' => '1993-04-05',
                'phone' => '+27-82-555-2004',
                'email' => 'james.brown@atlasmining.co.za',
            ]),
        ];

        $globalEmployees = [
            Employee::create([
                'company_id' => $companies['global']->id,
                'name' => 'Chen Wei',
                'sex' => 'male',
                'nationality' => 'Chinese',
                'national_id' => 'CN-1989-56231',
                'home_address' => '101 Nanjing Road, Shanghai, China',
                'job_description' => 'Site Engineer',
                'job_location' => 'China',
                'date_of_birth' => '1989-12-25',
                'phone' => '+86-138-555-3001',
                'email' => 'chen.wei@globalconstruction.com',
            ]),
            Employee::create([
                'company_id' => $companies['global']->id,
                'name' => 'Aisha Patel',
                'sex' => 'female',
                'nationality' => 'Indian',
                'national_id' => 'CN-1994-83472',
                'home_address' => '55 Pudong Avenue, Shanghai, China',
                'job_description' => 'Project Manager',
                'job_location' => 'China',
                'date_of_birth' => '1994-02-14',
                'phone' => '+86-138-555-3002',
                'email' => 'aisha.patel@globalconstruction.com',
            ]),
            Employee::create([
                'company_id' => $companies['global']->id,
                'name' => 'Omar Farouk',
                'sex' => 'male',
                'nationality' => 'Egyptian',
                'national_id' => 'CN-1986-37918',
                'home_address' => '77 Huaihai Road, Shanghai, China',
                'job_description' => 'Construction Manager',
                'job_location' => 'China',
                'date_of_birth' => '1986-08-20',
                'phone' => '+86-138-555-3003',
                'email' => 'omar.farouk@globalconstruction.com',
            ]),
        ];

        return [
            'petrogulf' => $petroGulfEmployees,
            'atlas' => $atlasEmployees,
            'global' => $globalEmployees,
        ];
    }

    /**
     * @param  array<string, array<int, Employee>>  $employees
     * @param  array<string, ExaminationProfile>  $profiles
     * @param  array<string, Examination>  $examinations
     */
    private function createSampleCheckups(array $employees, array $profiles, array $examinations): void
    {
        $adminUser = User::where('email', 'admin@example.com')->first();

        // ── Checkup 1: Ahmad Al-Rashid — SLB MedCheck Full (all pass) ────────
        $checkup1 = Checkup::create([
            'employee_id' => $employees['petrogulf'][0]->id,
            'examination_profile_id' => $profiles['slb_full']->id,
            'checkup_date' => '2026-02-15',
            'exam_type' => 'pre_employment',
            'job_environment' => 'rig_field',
            'status' => 'pending',
            'notes' => 'Pre-employment SLB MedCheck. All results within normal range.',
            'performed_by' => $adminUser->id,
        ]);

        $this->addResults($checkup1, $examinations, [
            // Physical
            'eyes_pupils' => ['Normal', true],
            'ear_nose_throat' => ['Normal', true],
            'teeth_mouth' => ['Normal', true],
            'lungs_chest' => ['Normal', true],
            'cardiovascular' => ['Normal', true],
            'abdomen_viscera' => ['Normal', true],
            'hernial_orifices' => ['Normal', true],
            'anus_rectum' => ['Normal', true],
            'genito_urinary' => ['Normal', true],
            'extremities' => ['Normal', true],
            'musculo_skeletal' => ['Normal', true],
            'skin_varicose_veins' => ['Normal', true],
            'neurological' => ['Normal', true],
            'breast' => ['Normal', true],
            // Vitals
            'height' => ['178', true],
            'weight' => ['82', true],
            'blood_pressure' => ['122/78', true],
            'pulse' => ['72', true],
            // Hearing & Vision
            'hearing_right' => ['Normal', true],
            'hearing_left' => ['Normal', true],
            'vision_distant_right' => ['Normal', true],
            'vision_distant_left' => ['Normal', true],
            'vision_near_right' => ['Normal', true],
            'vision_near_left' => ['Normal', true],
            'color_vision' => ['Normal', true],
            // CBC
            'rbc' => ['5.1', true],
            'wbc' => ['7200', true],
            'platelets' => ['280', true],
            'neutrophils' => ['62', true],
            'eosinophils' => ['2', true],
            'basophils' => ['0.5', true],
            'lymphocytes' => ['30', true],
            'monocytes' => ['5.5', true],
            'hematocrit' => ['44', true],
            'hemoglobin' => ['15.2', true],
            'esr' => ['8', true],
            // Liver
            'sgot_asat' => ['28', true],
            'sgpt_alat' => ['32', true],
            'alp' => ['85', true],
            'gamma_gt' => ['22', true],
            // Metabolic
            'blood_sugar_fasting' => ['5.2', true],
            'hba1c' => ['5.1', true],
            'cholesterol_total' => ['4.8', true],
            'hdl' => ['1.4', true],
            'ldl' => ['2.9', true],
            'triglycerides' => ['1.2', true],
            'creatinine' => ['88', true],
            'uric_acid' => ['310', true],
            'tsh' => ['2.1', true],
            // Viral Screen
            'hbsag' => ['Negative', true],
            'hcv' => ['Negative', true],
            'hiv' => ['Negative', true],
            // Urine
            'urine_albumin' => ['Negative', true],
            'urine_sugar' => ['Negative', true],
            'urine_blood' => ['Negative', true],
            // Stool
            'stool_occult_blood' => ['Negative', true],
            'stool_parasites' => ['None detected', true],
            // Para-Clinical
            'ecg' => ['Normal sinus rhythm', true],
            'cardiac_stress_test' => ['Normal', true],
            'chest_xray' => ['Clear — no abnormalities', true],
            'spirometer_test' => ['Normal', true],
            'peripheral_blood_smear' => ['Normal', true],
            // Drug Testing
            'drug_cannabis' => ['Negative', true],
            'drug_cocaine' => ['Negative', true],
            'drug_heroin_morphine' => ['Negative', true],
            'drug_amphetamine' => ['Negative', true],
            // Psychological
            'kessler_k10' => ['14', true],
            'epworth_sleepiness' => ['7', true],
        ]);

        $checkup1->updateStatus();

        // ── Checkup 2: John Smith — Oil Field Pre-Employment (fail) ──────────
        $checkup2 = Checkup::create([
            'employee_id' => $employees['atlas'][0]->id,
            'examination_profile_id' => $profiles['oil_field']->id,
            'checkup_date' => '2026-02-20',
            'exam_type' => 'pre_employment',
            'job_environment' => 'rig_field',
            'status' => 'pending',
            'notes' => 'Pre-employment screening. Elevated blood sugar and cholesterol detected.',
            'performed_by' => $adminUser->id,
        ]);

        $this->addResults($checkup2, $examinations, [
            // Physical
            'eyes_pupils' => ['Normal', true],
            'ear_nose_throat' => ['Normal', true],
            'teeth_mouth' => ['Normal', true],
            'lungs_chest' => ['Normal', true],
            'cardiovascular' => ['Normal', true],
            'abdomen_viscera' => ['Normal', true],
            'hernial_orifices' => ['Normal', true],
            'anus_rectum' => ['Normal', true],
            'genito_urinary' => ['Normal', true],
            'extremities' => ['Normal', true],
            'musculo_skeletal' => ['Normal', true],
            'skin_varicose_veins' => ['Normal', true],
            'neurological' => ['Normal', true],
            'breast' => ['Normal', true],
            // Vitals
            'height' => ['182', true],
            'weight' => ['98', true],
            'blood_pressure' => ['148/95', false, 'Hypertensive. Monitoring required.'],
            'pulse' => ['88', true],
            // Hearing & Vision
            'hearing_right' => ['Normal', true],
            'hearing_left' => ['Normal', true],
            'vision_distant_right' => ['Normal', true],
            'vision_distant_left' => ['Normal', true],
            'vision_near_right' => ['Normal', true],
            'vision_near_left' => ['Normal', true],
            'color_vision' => ['Normal', true],
            // CBC
            'rbc' => ['4.8', true],
            'wbc' => ['8400', true],
            'platelets' => ['310', true],
            'neutrophils' => ['65', true],
            'eosinophils' => ['3', true],
            'basophils' => ['0.5', true],
            'lymphocytes' => ['26', true],
            'monocytes' => ['5', true],
            'hematocrit' => ['46', true],
            'hemoglobin' => ['16.1', true],
            'esr' => ['15', true],
            // Liver
            'sgot_asat' => ['38', true],
            'sgpt_alat' => ['52', true],
            'alp' => ['110', true],
            'gamma_gt' => ['45', true],
            // Metabolic
            'blood_sugar_fasting' => ['7.8', false, 'Elevated fasting glucose — recommend follow-up with endocrinologist.'],
            'hba1c' => ['6.4', false, 'Pre-diabetic range (5.7–6.4%). Follow-up required.'],
            'cholesterol_total' => ['6.1', false, 'Above normal threshold of 5.2 mmol/l.'],
            'hdl' => ['1.1', true],
            'ldl' => ['4.2', false, 'Elevated — above 3.4 mmol/l.'],
            'triglycerides' => ['2.1', false, 'Elevated — above 1.7 mmol/l.'],
            'creatinine' => ['102', true],
            'uric_acid' => ['390', true],
            // Viral Screen
            'hbsag' => ['Negative', true],
            'hcv' => ['Negative', true],
            'hiv' => ['Negative', true],
            // Chest X-Ray
            'chest_xray' => ['Clear', true],
            // Drug Testing
            'drug_cannabis' => ['Negative', true],
            'drug_cocaine' => ['Negative', true],
            'drug_heroin_morphine' => ['Negative', true],
            'drug_amphetamine' => ['Negative', true],
        ]);

        $checkup2->updateStatus();

        // ── Checkup 3: Chen Wei — Annual Checkup (pending — partial results) ─
        $checkup3 = Checkup::create([
            'employee_id' => $employees['global'][0]->id,
            'examination_profile_id' => $profiles['annual']->id,
            'checkup_date' => '2026-03-01',
            'exam_type' => 'periodic',
            'job_environment' => 'office',
            'status' => 'pending',
            'notes' => 'Annual checkup in progress. Blood work and ECG awaiting results.',
            'performed_by' => $adminUser->id,
        ]);

        $this->addResults($checkup3, $examinations, [
            // Physical (completed)
            'eyes_pupils' => ['Normal', true],
            'ear_nose_throat' => ['Normal', true],
            'teeth_mouth' => ['Normal', true],
            'lungs_chest' => ['Normal', true],
            'cardiovascular' => ['Normal', true],
            'abdomen_viscera' => ['Normal', true],
            'hernial_orifices' => ['Normal', true],
            'anus_rectum' => ['Normal', true],
            'genito_urinary' => ['Normal', true],
            'extremities' => ['Normal', true],
            'musculo_skeletal' => ['Normal', true],
            'skin_varicose_veins' => ['Normal', true],
            'neurological' => ['Normal', true],
            'breast' => ['Normal', true],
            // Vitals (completed)
            'height' => ['172', true],
            'weight' => ['74', true],
            'blood_pressure' => ['118/76', true],
            'pulse' => ['68', true],
            // Hearing & Vision (completed)
            'hearing_right' => ['Normal', true],
            'hearing_left' => ['Normal', true],
            'vision_distant_right' => ['Normal', true],
            'vision_distant_left' => ['Normal', true],
            'vision_near_right' => ['Normal', true],
            'vision_near_left' => ['Normal', true],
            // Blood work pending — no results yet
        ]);

        $checkup3->updateStatus();
    }

    /**
     * Insert CheckupResult rows for a checkup.
     *
     * @param  array<string, Examination>  $examinations
     * @param  array<string, array{0: string, 1: bool, 2?: string}>  $results  key => [value, is_normal, notes?]
     */
    private function addResults(Checkup $checkup, array $examinations, array $results): void
    {
        foreach ($results as $key => $result) {
            CheckupResult::create([
                'checkup_id' => $checkup->id,
                'examination_id' => $examinations[$key]->id,
                'value' => $result[0],
                'is_normal' => $result[1],
                'notes' => $result[2] ?? null,
            ]);
        }
    }
}
