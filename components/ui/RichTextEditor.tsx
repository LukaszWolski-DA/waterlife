'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEffect, useCallback } from 'react';
import { Bold, Italic, Link as LinkIcon, Unlink, Underline as UnderlineIcon, List, AArrowUp, AArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Font size steps (px)
const FONT_SIZE_STEPS = [12, 13, 14, 15, 16, 18, 20, 24, 28, 32];
const DEFAULT_SIZE = 14;

// Custom FontSize extension – stores font-size as inline style via TextStyle
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el: HTMLElement) =>
              el.style.fontSize ? el.style.fontSize.replace('px', '') : null,
            renderHTML: (attrs: Record<string, string | null>) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}px` } : {},
          },
        },
      },
    ];
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
  hasError?: boolean;
}

export function RichTextEditor({ value, onChange, className, hasError }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Underline,
      TextStyle,
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    editorProps: {
      attributes: {
        class: 'min-h-[180px] px-3 py-2 text-sm focus:outline-none',
      },
    },
  });

  // Synchronizuj wartość z zewnątrz (np. przy ładowaniu produktu)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (currentHTML !== value && value !== undefined) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL linku:', previousUrl || 'https://');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const changeFontSize = useCallback((delta: 1 | -1) => {
    if (!editor) return;
    const current = Number(editor.getAttributes('textStyle').fontSize) || DEFAULT_SIZE;
    const idx = FONT_SIZE_STEPS.indexOf(current);
    const nextIdx = idx === -1
      ? FONT_SIZE_STEPS.indexOf(DEFAULT_SIZE) + delta
      : idx + delta;
    const clamped = Math.max(0, Math.min(FONT_SIZE_STEPS.length - 1, nextIdx));
    editor.chain().focus().setMark('textStyle', { fontSize: String(FONT_SIZE_STEPS[clamped]) }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={cn('rounded-md border', hasError ? 'border-destructive' : 'border-input', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b px-2 py-1.5 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('h-7 w-7 p-0', editor.isActive('bold') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Pogrubienie (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('h-7 w-7 p-0', editor.isActive('italic') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Kursywa (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('h-7 w-7 p-0', editor.isActive('underline') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Podkreślenie (Ctrl+U)"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('h-7 w-7 p-0', editor.isActive('bulletList') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista punktowana"
        >
          <List className="h-3.5 w-3.5" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => changeFontSize(1)}
          title="Powiększ czcionkę"
        >
          <AArrowUp className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => changeFontSize(-1)}
          title="Pomniejsz czcionkę"
        >
          <AArrowDown className="h-3.5 w-3.5" />
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn('h-7 w-7 p-0', editor.isActive('link') && 'bg-muted')}
          onClick={handleSetLink}
          title="Dodaj link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>

        {editor.isActive('link') && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Usuń link"
          >
            <Unlink className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Edytor */}
      <EditorContent editor={editor} />
    </div>
  );
}
