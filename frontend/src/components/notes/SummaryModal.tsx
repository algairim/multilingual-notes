import { Loader2 } from 'lucide-react';
import {
  Note,
  NoteSummary,
  NoteTranslation,
} from '../../services/notes.service';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useState } from 'react';

type SummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  summary: NoteSummary | null;
  translations: NoteTranslation[];
  onSummarise: (noteId: string) => void;
  onTranslate: (noteId: string, lang: 'en' | 'fr' | 'de' | 'it' | 'es') => void;
  isSummaryLoading: boolean;
  isTranslateLoading: boolean;
};

export default function SummaryModal({
  isOpen,
  onClose,
  note,
  summary,
  translations,
  onSummarise,
  onTranslate,
  isSummaryLoading,
  isTranslateLoading,
}: SummaryModalProps) {
  const [targetLang, setTargetLang] = useState<'en' | 'fr' | 'de' | 'it' | 'es'>('fr');

  if (!note) return null;

  const handleTranslate = () => {
    if (note.languageCode !== targetLang) {
      onTranslate(note.id, targetLang);
    }
  };

  const getTranslation = (lang: string) => {
    return translations.find(t => t.targetLanguageCode === lang);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={note.title}>
      <div className="space-y-6">
        {/* Original Content */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
            Original Content ({note.languageCode})
          </h3>
          <p className="max-h-32 overflow-y-auto rounded-md border bg-gray-50 p-3 text-sm text-gray-700">
            {note.content}
          </p>
        </div>

        {/* Summarisation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-gray-500">
              Summary
            </h3>
            <Button
              size="sm"
              onClick={() => onSummarise(note.id)}
              disabled={isSummaryLoading}
              className="min-w-[100px]"
            >
              {isSummaryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Get Summary'
              )}
            </Button>
          </div>
          {summary ? (
            <p className="rounded-md border bg-gray-50 p-3 text-sm text-gray-700">
              {summary.summary}
              <span className="mt-2 block text-right text-xs text-gray-400">
                Generated: {new Date(summary.createdAt).toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3 text-center text-sm text-gray-500">
              No summary generated yet.
            </p>
          )}
        </div>

        {/* Translation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase text-gray-500">
              Translation
            </h3>
            <div className="flex gap-2">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as any)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isTranslateLoading}
              >
                <option value="en">English (en)</option>
                <option value="fr">French (fr)</option>
                <option value="de">German (de)</option>
                <option value="it">Italian (it)</option>
                <option value="es">Spanish (es)</option>
              </select>
              <Button
                size="sm"
                onClick={handleTranslate}
                disabled={isTranslateLoading || note.languageCode === targetLang}
                className="min-w-[100px]"
              >
                {isTranslateLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Translate'
                )}
              </Button>
            </div>
          </div>
          {getTranslation(targetLang) ? (
            <p className="rounded-md border bg-gray-50 p-3 text-sm text-gray-700">
              {getTranslation(targetLang)?.text}
               <span className="mt-2 block text-right text-xs text-gray-400">
                Generated: {new Date(getTranslation(targetLang)!.createdAt).toLocaleString()}
              </span>
            </p>
          ) : (
             <p className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3 text-center text-sm text-gray-500">
              No translation for {targetLang.toUpperCase()} yet.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
