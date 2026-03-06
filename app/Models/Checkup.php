<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Checkup extends Model
{
    /** @use HasFactory<\Database\Factories\CheckupFactory> */
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'examination_profile_id',
        'checkup_date',
        'status',
        'notes',
        'performed_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'checkup_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return BelongsTo<ExaminationProfile, $this>
     */
    public function examinationProfile(): BelongsTo
    {
        return $this->belongsTo(ExaminationProfile::class);
    }

    /**
     * @return HasMany<CheckupResult, $this>
     */
    public function results(): HasMany
    {
        return $this->hasMany(CheckupResult::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    public function calculateStatus(): string
    {
        $profile = $this->examinationProfile()->with('examinations')->first();
        $requiredExamIds = $profile->examinations->where('is_required', true)->pluck('id');
        $results = $this->results()->get()->keyBy('examination_id');

        foreach ($requiredExamIds as $examId) {
            $result = $results->get($examId);

            if (! $result || $result->is_normal === null) {
                return 'pending';
            }

            if (! $result->is_normal) {
                return 'fail';
            }
        }

        return 'pass';
    }

    public function updateStatus(): void
    {
        $this->update(['status' => $this->calculateStatus()]);
    }
}
