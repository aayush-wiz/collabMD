import { EditorProvider } from "../components/editor/editor-context";
import { EditorNavbar } from "../components/editor/editor-navbar";
import { Workspace } from "../components/editor/workspace";

export default function Home() {
  return (
    <EditorProvider>
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <EditorNavbar />
        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <Workspace />
          </div>
        </main>
      </div>
    </EditorProvider>
  );
}
