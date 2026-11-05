<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'student_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('users', 'student_number')
                    ->ignore($this->user()->id),
            ],

            'campus' => ['required', 'string', 'max:150'],
            'academic_level' => ['required', 'string', 'max:100'],
            'department' => ['required', 'string', 'max:255'],
        ];
    }
}
