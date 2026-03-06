<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Examination extends Model
{
    /** @use HasFactory<\Database\Factories\ExaminationFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'unit',
        'min_value',
        'max_value',
        'is_required',
        'requires_document',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'min_value' => 'decimal:2',
            'max_value' => 'decimal:2',
            'is_required' => 'boolean',
            'requires_document' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsToMany<ExaminationProfile, $this>
     */
    public function examinationProfiles(): BelongsToMany
    {
        return $this->belongsToMany(ExaminationProfile::class)->withPivot('sort_order');
    }
}
