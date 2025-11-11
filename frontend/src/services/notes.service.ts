import api from './api';
import { NoteFormData } from '../components/notes/CreateNoteForm';

// --- Type Definitions ---

export interface Note {
  id: string;
  title: string;
  content: string;
  languageCode: string;
  createdAt: string;
  summary: NoteSummary | null;
  translations: NoteTranslation[];
}

export interface NoteSummary {
  id: string;
  summary: string;
  createdAt: string;
}

export interface NoteTranslation {
  id: string;
  targetLanguageCode: string;
  text: string;
  createdAt: string;
}

interface PaginatedNotes {
  data: Note[];
  total: number;
  page: number;
  limit: number;
}

interface NotesQueryParams {
  search?: string;
  language?: string;
  page?: number;
  limit?: number;
}

// --- API Service ---

const getNotes = async (params: NotesQueryParams): Promise<PaginatedNotes> => {
  const { data } = await api.get('/notes', { params });
  return data;
};

const createNote = async (noteData: NoteFormData): Promise<Note> => {
  const { data } = await api.post('/notes', noteData);
  return data;
};

const updateNote = async (
  noteId: string,
  noteData: Partial<NoteFormData>,
): Promise<Note> => {
  const { data } = await api.put(`/notes/${noteId}`, noteData);
  return data;
};

const deleteNote = async (noteId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/notes/${noteId}`);
  return data;
};

const summariseNote = async (noteId: string): Promise<NoteSummary> => {
  const { data } = await api.post('/summarise', { noteId });
  return data;
};

const translateNote = async (
  noteId: string,
  targetLanguageCode: string,
): Promise<NoteTranslation> => {
  const { data } = await api.post('/translate', {
    noteId,
    targetLanguageCode,
  });
  return data;
};

export const notesService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  summariseNote,
  translateNote,
};
