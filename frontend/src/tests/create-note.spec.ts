// import { describe, it, expect, vi } from 'vitest';
// import {
//   render,
//   screen,
//   fireEvent,
//   waitFor,
// } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import CreateNoteForm, {
//   NoteFormData,
// } from '../components/notes/CreateNoteForm';
// import { notesService } from '../services/notes.service'; // Import the service
//
// // Mock the notesService
// vi.mock('../services/notes.service', () => ({
//   notesService: {
//     createNote: vi.fn(),
//   },
// }));
//
// // Mock the service to be typed
// // @ts-expect-error - notesService is mocked
// const mockedNotesService = notesService as vi.Mocked<typeof notesService>;
//
// describe('CreateNoteForm', () => {
//   const mockOnNoteCreated = vi.fn();
//
//   const renderComponent = () => {
//     return render(<CreateNoteForm onNoteCreated={mockOnNoteCreated} onSubmit={() => Promise.resolve()} noteToEdit={null} onCancelEdit={() => {}} />);
//   };
//
//   beforeEach(() => {
//     vi.resetAllMocks();
//   });
//
//   it('renders the form fields correctly', () => {
//     renderComponent();
//     expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
//     expect(
//       screen.getByRole('button', { name: /create note/i }),
//     ).toBeInTheDocument();
//   });
//
//   it('shows validation errors for empty fields', async () => {
//     renderComponent();
//
//     const createButton = screen.getByRole('button', { name: /create note/i });
//     fireEvent.click(createButton);
//
//     await waitFor(() => {
//       expect(screen.getByText('Title is required')).toBeInTheDocument();
//       expect(screen.getByText('Content is required')).toBeInTheDocument();
//     });
//
//     expect(mockedNotesService.createNote).not.toHaveBeenCalled();
//     expect(mockOnNoteCreated).not.toHaveBeenCalled();
//   });
//
//   it('submits the form and calls onNoteCreated on success', async () => {
//     const newNoteData: NoteFormData = {
//       title: 'Test Note',
//       content: 'This is test content.',
//       languageCode: 'en',
//     };
//
//     const mockResponse = {
//       id: '1',
//       ...newNoteData,
//       userId: 'user-1',
//       createdAt: new Date().toISOString(),
//     };
//
//     mockedNotesService.createNote.mockResolvedValue(mockResponse);
//
//     renderComponent();
//
//     // Fill out the form
//     fireEvent.change(screen.getByLabelText(/title/i), {
//       target: { value: newNoteData.title },
//     });
//     fireEvent.change(screen.getByLabelText(/content/i), {
//       target: { value: newNoteData.content },
//     });
//     fireEvent.change(screen.getByLabelText(/language/i), {
//       target: { value: newNoteData.languageCode },
//     });
//
//     // Submit the form
//     const createButton = screen.getByRole('button', { name: /create note/i });
//     fireEvent.click(createButton);
//
//     // Wait for submission
//     await waitFor(() => {
//       expect(mockedNotesService.createNote).toHaveBeenCalledWith(newNoteData);
//     });
//
//     await waitFor(() => {
//       expect(mockOnNoteCreated).toHaveBeenCalledWith(mockResponse);
//     });
//
//     // Check if form is reset
//     expect(screen.getByLabelText(/title/i)).toHaveValue('');
//     expect(screen.getByLabelText(/content/i)).toHaveValue('');
//   });
// });
