
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

global.fetch = jest.fn() as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('URL Shortener App', () => {
  test('renders input and button correctly', () => {
    render(<App />);

    expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
    expect(screen.getByText('Shorten URL')).toBeInTheDocument();
  });

  test('handles successful URL shortening', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ shortenedUrl: 'http://short.ly/abc123' }),
    };
   
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(<App />);
    
    const input = screen.getByPlaceholderText('Enter URL') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'http://example.com' } });

    const button = screen.getByText('Shorten URL');
    fireEvent.click(button);

    await waitFor(() => expect(mockResponse.json).toHaveBeenCalled());
    
    expect(screen.getByText('Shortened URL:')).toBeInTheDocument();
    expect(screen.getByText('http://short.ly/abc123')).toHaveAttribute('href', 'http://short.ly/abc123');
  });

  test('handles error when URL shortening fails', async () => {
    const mockErrorResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Invalid URL' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);

    render(<App />);

    const input = screen.getByPlaceholderText('Enter URL') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'http://invalid-url' } });

    const button = screen.getByText('Shorten URL');
    fireEvent.click(button);

    await waitFor(() => expect(mockErrorResponse.json).toHaveBeenCalled());

    expect(screen.queryByText('Shortened URL:')).not.toBeInTheDocument();
  });

  test('calls fetch with correct payload', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ shortenedUrl: 'http://short.ly/abc123' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(<App />);

    const input = screen.getByPlaceholderText('Enter URL') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'http://example.com' } });

    const button = screen.getByText('Shorten URL');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/shorten',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'http://example.com' }),
        })
      );
    });
  });

  test('displays error message when fetch fails', async () => {


    global.fetch = jest.fn(() =>
        Promise.reject(new Error("Network error"))
      ) as jest.Mock;

    render(<App />);

    const input = screen.getByPlaceholderText("Enter URL");
  fireEvent.change(input, { target: { value: "http://example.com" } });

  const button = screen.getByText("Shorten URL");
  fireEvent.click(button);

  await waitFor(() =>
    expect(screen.getByText("Error: Network error")).toBeInTheDocument()
  );
    expect(screen.getByText('Error: Network error')).toBeInTheDocument();
  });

  test('clears input field after successful URL shortening', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ shortenedUrl: 'http://short.ly/abc123' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(<App />);

    const input = screen.getByPlaceholderText('Enter URL') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'http://example.com' } });

    const button = screen.getByText('Shorten URL');
    fireEvent.click(button);
    await waitFor(() => expect(mockResponse.json).toHaveBeenCalled());

    expect(input.value).toBe('');
  });
});
