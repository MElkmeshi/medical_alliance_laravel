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
        $this->createExaminations();
        $profiles = $this->createExaminationProfiles();
        $companies = $this->createCompanies($profiles);
        $this->createUsers($companies);
        $employees = $this->createEmployees($companies);
        $this->createSampleCheckups($employees, $profiles);
    }

    /**
     * @return array<string, Examination>
     */
    private function createExaminations(): array
    {
        $examinations = [
            'blood_sugar' => Examination::create([
                'name' => 'Blood Sugar',
                'unit' => 'mg/dL',
                'min_value' => 70,
                'max_value' => 100,
                'is_required' => true,
                'requires_document' => false,
            ]),
            'blood_pressure' => Examination::create([
                'name' => 'Blood Pressure',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => true,
                'requires_document' => false,
            ]),
            'vision_test' => Examination::create([
                'name' => 'Vision Test',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => true,
                'requires_document' => false,
            ]),
            'hearing_test' => Examination::create([
                'name' => 'Hearing Test',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => true,
                'requires_document' => false,
            ]),
            'chest_xray' => Examination::create([
                'name' => 'Chest X-Ray',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => true,
                'requires_document' => true,
            ]),
            'cbc' => Examination::create([
                'name' => 'Complete Blood Count (CBC)',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => true,
                'requires_document' => false,
            ]),
            'urine_analysis' => Examination::create([
                'name' => 'Urine Analysis',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => false,
                'requires_document' => false,
            ]),
            'ecg' => Examination::create([
                'name' => 'ECG',
                'unit' => null,
                'min_value' => null,
                'max_value' => null,
                'is_required' => false,
                'requires_document' => true,
            ]),
            'liver_function' => Examination::create([
                'name' => 'Liver Function Test',
                'unit' => 'U/L',
                'min_value' => 7,
                'max_value' => 56,
                'is_required' => true,
                'requires_document' => false,
            ]),
            'kidney_function' => Examination::create([
                'name' => 'Kidney Function Test',
                'unit' => 'mg/dL',
                'min_value' => 0.7,
                'max_value' => 1.3,
                'is_required' => true,
                'requires_document' => false,
            ]),
        ];

        return $examinations;
    }

    /**
     * @return array<string, ExaminationProfile>
     */
    private function createExaminationProfiles(): array
    {
        $exams = Examination::all()->keyBy('name');

        $oilField = ExaminationProfile::create([
            'name' => 'Oil Field Pre-Employment',
            'description' => 'Comprehensive pre-employment screening for oil field workers.',
        ]);
        $oilField->examinations()->sync([
            $exams['Blood Sugar']->id => ['sort_order' => 1],
            $exams['Blood Pressure']->id => ['sort_order' => 2],
            $exams['Vision Test']->id => ['sort_order' => 3],
            $exams['Hearing Test']->id => ['sort_order' => 4],
            $exams['Chest X-Ray']->id => ['sort_order' => 5],
            $exams['Complete Blood Count (CBC)']->id => ['sort_order' => 6],
            $exams['Liver Function Test']->id => ['sort_order' => 7],
            $exams['Kidney Function Test']->id => ['sort_order' => 8],
        ]);

        $southAfrica = ExaminationProfile::create([
            'name' => 'South Africa Travel Health',
            'description' => 'Health screening required for travel to South Africa.',
        ]);
        $southAfrica->examinations()->sync([
            $exams['Blood Sugar']->id => ['sort_order' => 1],
            $exams['Vision Test']->id => ['sort_order' => 2],
            $exams['Complete Blood Count (CBC)']->id => ['sort_order' => 3],
            $exams['Chest X-Ray']->id => ['sort_order' => 4],
            $exams['Urine Analysis']->id => ['sort_order' => 5],
        ]);

        $annual = ExaminationProfile::create([
            'name' => 'Annual Health Checkup',
            'description' => 'Standard annual health checkup for all employees.',
        ]);
        $annual->examinations()->sync([
            $exams['Blood Sugar']->id => ['sort_order' => 1],
            $exams['Blood Pressure']->id => ['sort_order' => 2],
            $exams['Vision Test']->id => ['sort_order' => 3],
            $exams['Hearing Test']->id => ['sort_order' => 4],
            $exams['Complete Blood Count (CBC)']->id => ['sort_order' => 5],
            $exams['Urine Analysis']->id => ['sort_order' => 6],
            $exams['ECG']->id => ['sort_order' => 7],
        ]);

        $executive = ExaminationProfile::create([
            'name' => 'Executive Health Screening',
            'description' => 'Comprehensive health screening for executive-level employees.',
        ]);
        $executive->examinations()->sync([
            $exams['Blood Sugar']->id => ['sort_order' => 1],
            $exams['Blood Pressure']->id => ['sort_order' => 2],
            $exams['Vision Test']->id => ['sort_order' => 3],
            $exams['Hearing Test']->id => ['sort_order' => 4],
            $exams['Chest X-Ray']->id => ['sort_order' => 5],
            $exams['Complete Blood Count (CBC)']->id => ['sort_order' => 6],
            $exams['Urine Analysis']->id => ['sort_order' => 7],
            $exams['ECG']->id => ['sort_order' => 8],
            $exams['Liver Function Test']->id => ['sort_order' => 9],
            $exams['Kidney Function Test']->id => ['sort_order' => 10],
        ]);

        return [
            'oil_field' => $oilField,
            'south_africa' => $southAfrica,
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
            $profiles['south_africa']->id,
            $profiles['annual']->id,
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
                'national_id' => 'AE-1990-78432',
                'date_of_birth' => '1990-03-15',
                'phone' => '+971-50-555-1001',
                'email' => 'ahmad.rashid@petrogulf.com',
            ]),
            Employee::create([
                'company_id' => $companies['petrogulf']->id,
                'name' => 'Mohammed Hassan',
                'national_id' => 'AE-1985-62198',
                'date_of_birth' => '1985-07-22',
                'phone' => '+971-50-555-1002',
                'email' => 'mohammed.hassan@petrogulf.com',
            ]),
            Employee::create([
                'company_id' => $companies['petrogulf']->id,
                'name' => 'Sara Al-Khalili',
                'national_id' => 'AE-1992-41567',
                'date_of_birth' => '1992-11-08',
                'phone' => '+971-50-555-1003',
                'email' => 'sara.khalili@petrogulf.com',
            ]),
        ];

        $atlasEmployees = [
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'John Smith',
                'national_id' => 'ZA-1988-93521',
                'date_of_birth' => '1988-01-12',
                'phone' => '+27-82-555-2001',
                'email' => 'john.smith@atlasmining.co.za',
            ]),
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'David Wilson',
                'national_id' => 'ZA-1991-47832',
                'date_of_birth' => '1991-06-30',
                'phone' => '+27-82-555-2002',
                'email' => 'david.wilson@atlasmining.co.za',
            ]),
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'Maria Garcia',
                'national_id' => 'ZA-1987-15943',
                'date_of_birth' => '1987-09-18',
                'phone' => '+27-82-555-2003',
                'email' => 'maria.garcia@atlasmining.co.za',
            ]),
            Employee::create([
                'company_id' => $companies['atlas']->id,
                'name' => 'James Brown',
                'national_id' => 'ZA-1993-28764',
                'date_of_birth' => '1993-04-05',
                'phone' => '+27-82-555-2004',
                'email' => 'james.brown@atlasmining.co.za',
            ]),
        ];

        $globalEmployees = [
            Employee::create([
                'company_id' => $companies['global']->id,
                'name' => 'Chen Wei',
                'national_id' => 'CN-1989-56231',
                'date_of_birth' => '1989-12-25',
                'phone' => '+86-138-555-3001',
                'email' => 'chen.wei@globalconstruction.com',
            ]),
            Employee::create([
                'company_id' => $companies['global']->id,
                'name' => 'Aisha Patel',
                'national_id' => 'CN-1994-83472',
                'date_of_birth' => '1994-02-14',
                'phone' => '+86-138-555-3002',
                'email' => 'aisha.patel@globalconstruction.com',
            ]),
            Employee::create([
                'company_id' => $companies['global']->id,
                'name' => 'Omar Farouk',
                'national_id' => 'CN-1986-37918',
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
     */
    private function createSampleCheckups(array $employees, array $profiles): void
    {
        $adminUser = User::where('email', 'admin@example.com')->first();
        $exams = Examination::all()->keyBy('name');

        // Checkup 1: Ahmad Al-Rashid - Oil Field Pre-Employment (pass)
        $checkup1 = Checkup::create([
            'employee_id' => $employees['petrogulf'][0]->id,
            'examination_profile_id' => $profiles['oil_field']->id,
            'checkup_date' => '2026-02-15',
            'status' => 'pending',
            'notes' => 'Pre-employment screening for field assignment.',
            'performed_by' => $adminUser->id,
        ]);

        $passResults = [
            ['name' => 'Blood Sugar', 'value' => '85', 'is_normal' => true],
            ['name' => 'Blood Pressure', 'value' => '120/80', 'is_normal' => true],
            ['name' => 'Vision Test', 'value' => '20/20', 'is_normal' => true],
            ['name' => 'Hearing Test', 'value' => 'Normal', 'is_normal' => true],
            ['name' => 'Chest X-Ray', 'value' => 'Clear', 'is_normal' => true],
            ['name' => 'Complete Blood Count (CBC)', 'value' => 'Normal ranges', 'is_normal' => true],
            ['name' => 'Liver Function Test', 'value' => '25', 'is_normal' => true],
            ['name' => 'Kidney Function Test', 'value' => '0.9', 'is_normal' => true],
        ];

        foreach ($passResults as $result) {
            CheckupResult::create([
                'checkup_id' => $checkup1->id,
                'examination_id' => $exams[$result['name']]->id,
                'value' => $result['value'],
                'is_normal' => $result['is_normal'],
            ]);
        }

        $checkup1->updateStatus();

        // Checkup 2: John Smith - Oil Field Pre-Employment (fail)
        $checkup2 = Checkup::create([
            'employee_id' => $employees['atlas'][0]->id,
            'examination_profile_id' => $profiles['oil_field']->id,
            'checkup_date' => '2026-02-20',
            'status' => 'pending',
            'notes' => 'Pre-employment screening. Elevated blood sugar detected.',
            'performed_by' => $adminUser->id,
        ]);

        $failResults = [
            ['name' => 'Blood Sugar', 'value' => '145', 'is_normal' => false, 'notes' => 'Elevated - recommend follow-up with endocrinologist.'],
            ['name' => 'Blood Pressure', 'value' => '150/95', 'is_normal' => false, 'notes' => 'Hypertensive. Needs monitoring.'],
            ['name' => 'Vision Test', 'value' => '20/25', 'is_normal' => true],
            ['name' => 'Hearing Test', 'value' => 'Normal', 'is_normal' => true],
            ['name' => 'Chest X-Ray', 'value' => 'Clear', 'is_normal' => true],
            ['name' => 'Complete Blood Count (CBC)', 'value' => 'Normal ranges', 'is_normal' => true],
            ['name' => 'Liver Function Test', 'value' => '32', 'is_normal' => true],
            ['name' => 'Kidney Function Test', 'value' => '1.1', 'is_normal' => true],
        ];

        foreach ($failResults as $result) {
            CheckupResult::create([
                'checkup_id' => $checkup2->id,
                'examination_id' => $exams[$result['name']]->id,
                'value' => $result['value'],
                'is_normal' => $result['is_normal'],
                'notes' => $result['notes'] ?? null,
            ]);
        }

        $checkup2->updateStatus();

        // Checkup 3: Chen Wei - Annual Health Checkup (pending - incomplete results)
        $checkup3 = Checkup::create([
            'employee_id' => $employees['global'][0]->id,
            'examination_profile_id' => $profiles['annual']->id,
            'checkup_date' => '2026-03-01',
            'status' => 'pending',
            'notes' => 'Annual checkup in progress. Awaiting remaining results.',
            'performed_by' => $adminUser->id,
        ]);

        $pendingResults = [
            ['name' => 'Blood Sugar', 'value' => '92', 'is_normal' => true],
            ['name' => 'Blood Pressure', 'value' => '118/76', 'is_normal' => true],
            ['name' => 'Vision Test', 'value' => '20/20', 'is_normal' => true],
        ];

        foreach ($pendingResults as $result) {
            CheckupResult::create([
                'checkup_id' => $checkup3->id,
                'examination_id' => $exams[$result['name']]->id,
                'value' => $result['value'],
                'is_normal' => $result['is_normal'],
            ]);
        }

        $checkup3->updateStatus();
    }
}
