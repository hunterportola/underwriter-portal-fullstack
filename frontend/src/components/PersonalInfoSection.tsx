import { useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '../store/store';
// import { updateUserField } from '../store/userSlice';
// import type { UserState } from '../store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { InputLarge } from './InputLarge';
import { Dropdown } from './Dropdown';
import { DayInput } from './DayInput';
import { MonthInput } from './MonthInput';
import { YearInput } from './YearInput';

// Placeholder for UserState
interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  maritalStatus: string;
  education: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  [key: string]: any;
}

type UserErrors = Partial<Record<keyof UserState, string>>;

interface PersonalInfoSectionProps {
    user: UserState;
    errors: UserErrors;
    showErrors: boolean;
}

export function PersonalInfoSection({ user, errors, showErrors }: PersonalInfoSectionProps) {
    // const dispatch: AppDispatch = useDispatch();
    const yearInputRef = useRef<HTMLInputElement>(null);

    const handleFieldChange = (field: keyof UserState, value: string) => {
        // dispatch(updateUserField({ field, value }));
        console.log("Field changed (this is a placeholder):", field, value);
    };

    return (
        <Card>
            <CardHeader><CardTitle>Personal info</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-6">
                        <InputLarge label="First name" value={user.firstName} onChange={(e) => handleFieldChange('firstName', e.target.value)} error={errors.firstName} showError={showErrors} />
                        <InputLarge label="Last name" value={user.lastName} onChange={(e) => handleFieldChange('lastName', e.target.value)} error={errors.lastName} showError={showErrors} />
                    </div>
                     <div className="grid grid-cols-2 gap-x-6">
                        <InputLarge label="Email" type="email" value={user.email} onChange={(e) => handleFieldChange('email', e.target.value)} error={errors.email} showError={showErrors} />
                        <InputLarge label="Phone number" type="tel" value={user.phoneNumber} onChange={(e) => handleFieldChange('phoneNumber', e.target.value)} error={errors.phoneNumber} showError={showErrors} />
                    </div>
                     <div className="grid grid-cols-2 gap-x-6">
                        <Dropdown size="large" label="Marital status" value={user.maritalStatus} onChange={(val) => handleFieldChange('maritalStatus', val)} options={[{ value: 'Married', label: 'Married' }, { value: 'Single', label: 'Single' }, { value: 'Divorced', label: 'Divorced' }]} error={errors.maritalStatus} showError={showErrors} />
                        <Dropdown size="large" label="Education" value={user.education} onChange={(val) => handleFieldChange('education', val)} options={[{ value: "High school", label: "High school" }, { value: "Bachelor's degree", label: "Bachelor's degree" }, { value: "Master's degree", label: "Master's degree" }, { value: "PhD", label: "PhD" }]} error={errors.education} showError={showErrors} />
                    </div>
                    <div>
                        <label className="text-sm font-sans text-steel px-1">Date of Birth</label>
                        <div className="grid grid-cols-3 gap-x-4">
                             <MonthInput size="large" label="Month" value={user.birthMonth} onChange={(val) => handleFieldChange('birthMonth', val)} />
                             <DayInput size="large" label="Day" value={user.birthDay} onChange={(val) => handleFieldChange('birthDay', val)} onComplete={() => yearInputRef.current?.focus()} />
                             <YearInput ref={yearInputRef} size="large" label="Year" value={user.birthYear} onChange={(val) => handleFieldChange('birthYear', val)} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}