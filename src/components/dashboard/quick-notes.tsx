"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "./dashboard-cards";
import { Input } from "@/components/ui/input";

interface Note {
  id: number;
  content: string;
  createdAt: string;
}

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // UI otimista
    const tempNote: Note = {
      id: Date.now(), // ID temporário
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    
    setNotes([tempNote, ...notes]);
    const noteContent = newNote.trim();
    setNewNote("");

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent }),
      });

      if (res.ok) {
        const createdNote = await res.json();
        // Substituir a nota temporária pela nota real do banco
        setNotes(current => 
          current.map(n => n.id === tempNote.id ? createdNote : n)
        );
      } else {
        // Reverter UI otimista em caso de erro
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to add note:", error);
      fetchNotes(); // Reverter
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    // UI otimista
    setNotes(current => current.filter(n => n.id !== id));

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
         // Reverter UI otimista em caso de erro
        fetchNotes();
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      fetchNotes(); // Reverter
    }
  };

  return (
    <DashboardCard 
      title="Anotações Rápidas" 
      icon={<ClipboardList className="h-4 w-4" />}
      delay={0.4}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto min-h-[180px] max-h-[220px] pr-2 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : notes.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-2 opacity-60">
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-[160px]">
                Nenhuma anotação. Escreva algo importante abaixo.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li 
                  key={note.id} 
                  className="group flex items-start gap-2 rounded-md transition-colors hover:bg-muted/50 p-2 -mx-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <p className="flex-1 text-sm text-foreground/90 leading-snug">
                    {note.content}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 shrink-0 transition-opacity group-hover:opacity-100 focus:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAddNote} className="mt-4 border-t border-border/50 pt-3 flex items-center gap-2">
          <Input
            placeholder="Escreva uma nova nota..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="flex-1 h-9 text-xs bg-muted/30 border-none focus-visible:ring-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-9 w-9 shrink-0 gap-0"
            disabled={!newNote.trim() || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </DashboardCard>
  );
}
