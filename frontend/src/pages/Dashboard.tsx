import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import CreateNoteForm, {
  NoteFormData,
} from '../components/notes/CreateNoteForm';
import NotesList from '../components/notes/NotesList';
import SummaryModal from '../components/notes/SummaryModal';
import { Input } from '../components/ui/Input';
import {
  Note,
  notesService,
  NoteSummary,
  NoteTranslation,
} from '../services/notes.service';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

type NoteModalState = {
  note: Note | null;
  summary: NoteSummary | null;
  translations: NoteTranslation[];
};

export default function Dashboard() {
  // --- State ---
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Modal State
  const [modalState, setModalState] = useState<NoteModalState>({
    note: null,
    summary: null,
    translations: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isTranslateLoading, setIsTranslateLoading] = useState(false);

  // --- Data Fetching ---
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await notesService.getNotes({
        search: debouncedSearch,
        language: languageFilter,
      });
      setNotes(result.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, languageFilter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // --- Event Handlers ---

  const handleFormSubmit = async (data: NoteFormData) => {
    try {
      if (noteToEdit) {
        // Update existing note
        await notesService.updateNote(noteToEdit.id, data);
        setNoteToEdit(null);
      } else {
        // Create new note
        await notesService.createNote(data);
      }
      fetchNotes(); // Refresh list
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Error: Could not save note.'); // Simple error handling
    }
  };

  const handleEdit = (note: Note) => {
    setNoteToEdit(note);
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  const handleCancelEdit = () => {
    setNoteToEdit(null);
  };

  const handleDelete = async (noteId: string) => {
    // Simple confirm dialog (replace with custom modal in real app)
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesService.deleteNote(noteId);
        fetchNotes(); // Refresh list
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Error: Could not delete note.');
      }
    }
  };

  // --- Modal Handlers ---

  const openSummariseModal = (note: Note) => {
    setModalState({
      note,
      summary: note.summary || null,
      translations: note.translations || [],
    });
    setIsModalOpen(true);
  };

  const handleSummarise = async (noteId: string) => {
    setIsSummaryLoading(true);
    try {
      const newSummary = await notesService.summariseNote(noteId);
      setModalState((prev) => ({ ...prev, summary: newSummary }));
      // Also update the main notes list for next time
      setNotes(notes.map(n => n.id === noteId ? {...n, summary: newSummary} : n));
    } catch (error) {
      console.error('Failed to summarise note:', error);
      alert('Error: Could not get summary.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleTranslate = async (noteId: string, lang: 'en' | 'fr' | 'de' | 'it' | 'es') => {
    setIsTranslateLoading(true);
    try {
      const newTranslation = await notesService.translateNote(noteId, lang);
      setModalState((prev) => ({
        ...prev,
        translations: [...prev.translations.filter(t => t.targetLanguageCode !== lang), newTranslation],
      }));
       // Also update the main notes list for next time
       setNotes(notes.map(n => n.id === noteId ? {...n, translations: [...(n.translations || []).filter(t => t.targetLanguageCode !== lang), newTranslation]} : n));
    } catch (error) {
      console.error('Failed to translate note:', error);
      alert('Error: Could not get translation.');
    } finally {
      setIsTranslateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Filters + Create Form */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Filters */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Filters</h2>
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label
                    htmlFor="search"
                    className="mb-1 block text-sm font-medium"
                  >
                    Search by Title
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      type="text"
                      placeholder="e.g., Meeting notes"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                {/* Language Filter */}
                <div>
                  <label
                    htmlFor="language"
                    className="mb-1 block text-sm font-medium"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Languages</option>
                    <option value="en">English (en)</option>
                    <option value="fr">French (fr)</option>
                    <option value="de">German (de)</option>
                    <option value="it">Italian (it)</option>
                    <option value="es">Spanish (es)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Create/Edit Form */}
            <CreateNoteForm
              onSubmit={handleFormSubmit}
              noteToEdit={noteToEdit}
              onCancelEdit={handleCancelEdit}
            />
          </aside>

          {/* Right Column: Notes List */}
          <section className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Your Notes</h2>
            <NotesList
              notes={notes}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSummarise={openSummariseModal}
            />
            {/* TODO: Add pagination controls here */}
          </section>
        </div>
      </main>

      {/* Summary/Translate Modal */}
      <SummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={modalState.note}
        summary={modalState.summary}
        translations={modalState.translations}
        onSummarise={handleSummarise}
        onTranslate={handleTranslate}
        isSummaryLoading={isSummaryLoading}
        isTranslateLoading={isTranslateLoading}
      />
    </div>
  );
}
