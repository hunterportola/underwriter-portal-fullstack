import React from 'react';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '../store/store';
// import { updateUserField } from '../store/userSlice';
// import type { UserState } from '../store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

// A placeholder icon for a document
function DocumentIcon() {
    return (
        <svg className="w-6 h-6 text-portola-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

// Placeholder for UserState
interface UserState {
  idDocument: string | null;
  [key: string]: any;
}


interface IdDocumentSectionProps {
  user: UserState;
}

export function IdDocumentSection({ user }: IdDocumentSectionProps) {
  // const dispatch: AppDispatch = useDispatch();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // In a real app, you would upload this file to your server.
      // For now, we'll just log it.
      // dispatch(updateUserField({ field: 'idDocument', value: file.name }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemove = () => {
    // dispatch(updateUserField({ field: 'idDocument', value: null }))
    console.log("Removing document");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png" 
            />

            {user.idDocument && (
                <div className="flex items-center justify-between p-3 border border-pebble rounded-md bg-sand">
                    <div className="flex items-center gap-3">
                        <DocumentIcon />
                        <p className="font-mono text-sm text-portola-green">{user.idDocument}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemove}>
                        Remove
                    </Button>
                </div>
            )}

            <Button 
                variant="outline" 
                className="w-full"
                onClick={handleUploadClick}
            >
                {user.idDocument ? 'Upload a Different File' : 'Upload ID Document'}
            </Button>
            <p className="text-xs text-center text-steel">
                Accepted file types: PDF, JPG, PNG. Max size: 5MB.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}