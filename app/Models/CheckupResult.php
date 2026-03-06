<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckupResult extends Model
{
    /** @use HasFactory<\Database\Factories\CheckupResultFactory> */
    use HasFactory;

    protected $fillable = [
        'checkup_id',
        'examination_id',
        'value',
        'is_normal',
        'document_path',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_normal' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Checkup, $this>
     */
    public function checkup(): BelongsTo
    {
        return $this->belongsTo(Checkup::class);
    }

    /**
     * @return BelongsTo<Examination, $this>
     */
    public function examination(): BelongsTo
    {
        return $this->belongsTo(Examination::class);
    }
}
