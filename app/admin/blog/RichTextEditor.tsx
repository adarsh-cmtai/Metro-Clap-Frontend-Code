"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, Pilcrow } from 'lucide-react';
import React from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const menuItems = [
    { action: () => editor.chain().focus().toggleBold().run(), icon: Bold, name: 'bold' },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: Italic, name: 'italic' },
    { action: () => editor.chain().focus().toggleStrike().run(), icon: Strikethrough, name: 'strike' },
    { action: () => editor.chain().focus().setParagraph().run(), icon: Pilcrow, name: 'paragraph' },
    { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: Heading1, name: 'heading', level: 1 },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: Heading2, name: 'heading', level: 2 },
    { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), icon: Heading3, name: 'heading', level: 3 },
    { action: () => editor.chain().focus().toggleBulletList().run(), icon: List, name: 'bulletList' },
    { action: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, name: 'orderedList' },
  ];

  return (
    <div className="border border-b-0 border-gray-300 rounded-t-lg p-2 flex flex-wrap gap-1">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className={`p-2 rounded-md transition-colors ${editor.isActive(item.name, item.level ? { level: item.level } : {}) ? 'bg-gray-800 text-white' : 'hover:bg-gray-200'}`}
        >
          <item.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

interface RichTextEditorProps {
    content: string;
    onChange: (newContent: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose lg:prose-lg max-w-none p-4 min-h-[200px] border border-gray-300 rounded-b-lg focus:outline-none focus:border-red-500',
      },
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
