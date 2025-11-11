import { Trash2, Edit, FileText, Loader2 } from 'lucide-react';
import { Note } from '../../services/notes.service';
import Button from '../ui/Button';

type NotesListProps = {
  notes: Note[];
  isLoading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onSummarise: (note: Note) => void;
};

export default function NotesList({
  notes,
  isLoading,
  onEdit,
  onDelete,
  onSummarise,
}: NotesListProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center">
        <FileText className="h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-700">No notes found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a new note to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {note.languageCode.toUpperCase()}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {note.content}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSummarise(note)}
              >
                Summarise / Translate
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-blue-600"
                onClick={() => onEdit(note)}
              >
                <span className="sr-only">Edit</span>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-600"
                onClick={() => onDelete(note.id)}
              >
                <span className="sr-only">Delete</span>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
