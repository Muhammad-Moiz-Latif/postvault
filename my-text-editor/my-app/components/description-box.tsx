"use client"

import { useState, useRef } from "react"
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
    AlignJustify, List, ListOrdered, Heading1, Heading2, Heading3, ChevronDown
} from "lucide-react"

export default function Box() {
    const [showHeadings, setShowHeadings] = useState(false)
    const [savedSelection, setSavedSelection] = useState<Range | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)

    // Get the text of the entire line where cursor is
    const getCurrentLineText = () => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return ''

        const range = selection.getRangeAt(0)
        let node = range.startContainer

        // If it's a text node, get its parent element
        let parentElement = node.nodeType === 3 ? node.parentElement : node as HTMLElement

        // Find the closest block-level element (the "line")
        while (parentElement && parentElement !== editorRef.current) {
            const display = window.getComputedStyle(parentElement).display
            // Check if it's a block element or a heading
            if (
                display === 'block' ||
                ['H1', 'H2', 'H3', 'P', 'DIV', 'LI'].includes(parentElement.nodeName)
            ) {
                const lineText = parentElement.textContent || ''
                console.log('Current line text:', lineText)
                return lineText
            }
            parentElement = parentElement.parentElement
        }

        // Fallback: if we're at the root editor level
        if (node.nodeType === 3) {
            const lineText = node.textContent || ''
            console.log('Current line text (fallback):', lineText)
            return lineText
        }

        return ''
    }

    // Save selection when it changes
    const handleSelect = () => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            setSavedSelection(selection.getRangeAt(0))
        }

        // Also get current line text
        getCurrentLineText()
    }

    // Restore selection before executing command
    const handleCommand = (command: string, value?: string) => {
        const editor = editorRef.current
        if (editor) {
            editor.focus()

            // Restore the saved selection
            if (savedSelection) {
                const selection = window.getSelection()
                selection?.removeAllRanges()
                selection?.addRange(savedSelection)
            }

            // Handle heading commands via DOM manipulation
            if (command === 'H1' || command === 'H2' || command === 'H3') {
                const selection = window.getSelection()
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0)

                    // Get the text content
                    const selectedText = range.toString()

                    // Create the heading element
                    const heading = document.createElement(command.toLowerCase())
                    heading.textContent = selectedText || 'Heading' // Fallback if no text selected

                    // Delete the selected content
                    range.deleteContents()

                    // Insert the heading
                    range.insertNode(heading)

                    // Move cursor after the heading
                    range.setStartAfter(heading)
                    range.setEndAfter(heading)
                    selection.removeAllRanges()
                    selection.addRange(range)

                    // Add a line break after for better UX
                    const br = document.createElement('br')
                    heading.parentNode?.insertBefore(br, heading.nextSibling)
                }
            } else {
                // Use execCommand for other formatting
                document.execCommand(command, false, value || "")
            }
        }
    }

    return (
        <div className="w-1/2 bg-zinc-100 flex flex-col p-3 rounded-md shadow-sm border border-zinc-200">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-zinc-300 pb-2 mb-3">
                <div className="flex items-center gap-3 text-zinc-700">
                    {/* Headings dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowHeadings(!showHeadings)}
                            className="flex items-center gap-1 px-2 py-1 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50"
                        >
                            <Heading1 size={18} />
                            <ChevronDown size={14} />
                        </button>

                        {showHeadings && (
                            <div className="absolute top-full mt-1 left-0 bg-white border border-zinc-300 rounded-md shadow-md z-10 w-28">
                                <button
                                    type="button"
                                    onClick={() => { handleCommand("H1"); setShowHeadings(false) }}
                                    className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-100 w-full text-sm"
                                >
                                    <Heading1 size={16} /> H1
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { handleCommand("H2"); setShowHeadings(false) }}
                                    className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-100 w-full text-sm"
                                >
                                    <Heading2 size={16} /> H2
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { handleCommand("H3"); setShowHeadings(false) }}
                                    className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-100 w-full text-sm"
                                >
                                    <Heading3 size={16} /> H3
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Text styling */}
                    <Bold size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("bold")} />
                    <Italic size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("italic")} />
                    <Underline size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("underline")} />

                    {/* Alignment */}
                    <AlignLeft size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("justifyLeft")} />
                    <AlignCenter size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("justifyCenter")} />
                    <AlignRight size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("justifyRight")} />
                    <AlignJustify size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("justifyFull")} />

                    {/* Lists */}
                    <List size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("insertUnorderedList")} />
                    <ListOrdered size={18} className="cursor-pointer hover:text-black" onClick={() => handleCommand("insertOrderedList")} />
                </div>
            </div>

            {/* Editable area */}
            <div
                ref={editorRef}
                id="editor"
                contentEditable
                suppressContentEditableWarning
                onMouseUp={handleSelect}
                onKeyUp={handleSelect}
                className="outline-none w-full bg-white p-3 rounded-md border border-zinc-200 min-h-[150px] focus:ring-2 focus:ring-zinc-400 transition"
            />
        </div>
    )
}