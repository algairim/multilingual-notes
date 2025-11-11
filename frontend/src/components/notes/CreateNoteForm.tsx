import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Loader2, Plus } from 'lucide-react';
import { Note } from '../../services/notes.service';
import { useEffect } from 'react';

// Validation schema
const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  languageCode: z.enum(['en', 'fr', 'de', 'it', 'es']),
});

export type NoteFormData = z.infer<typeof noteSchema>;

type CreateNoteFormProps = {
  onSubmit: (data: NoteFormData) => Promise<void>;
  noteToEdit?: Note | null;
  onCancelEdit: () => void;
};

export default function CreateNoteForm({
  onSubmit,
  noteToEdit,
  onCancelEdit,
}: CreateNoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      languageCode: 'en',
    },
  });

  // Populate form if noteToEdit changes
  useEffect(() => {
    if (noteToEdit) {
      // Fix: Manually set values to match form schema
      reset({
        title: noteToEdit.title,
        content: noteToEdit.content,
        languageCode: noteToEdit.languageCode as 'en' | 'fr' | 'de' | 'it' | 'es',
      });
    } else {
      reset({ title: '', content: '', languageCode: 'en' });
    }
  }, [noteToEdit, reset]);

  const handleFormSubmit = async (data: NoteFormData) => {
    await onSubmit(data);
    if (!noteToEdit) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-lg border bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold">
        {noteToEdit ? 'Edit Note' : 'Create New Note'}
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            rows={5}
            {...register('content')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="languageCode"
            className="mb-1 block text-sm font-medium"
          >
            Language
          </label>
          <select
            id="languageCode"
            {...register('languageCode')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="en">English (en)</option>
            <option value="fr">French (fr)</option>
            <option value="de">German (de)</option>
            <option value="it">Italian (it)</option>
            <option value="es">Spanish (es)</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          {noteToEdit && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex min-w-[120px] items-center justify-center gap-2">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {noteToEdit ? 'Save Changes' : 'Create Note'}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
