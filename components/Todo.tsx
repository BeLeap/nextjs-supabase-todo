import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { definitions } from "../types/supabase";

interface TodoProps {
  session: Session,
}

function Todo({ session }: TodoProps) {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  const getTodos = async (userId: string) => {
    const { error, data } = await supabase
      .from<definitions["Todo"]>("Todo")
      .select("*")
      .eq("owner", userId);

    if (error !== null) {
      alert(error);
    } else if (data !== null && data.length == 1) {
      setTodos(data[0].todo ?? []);
    }
  }

  const saveCurrentTodos = async (userId: string) => {
    setSaveLoading(true);
    const { error } = await supabase
      .from<definitions["Todo"]>("Todo")
      .upsert(
        {
          todo: todos,
          owner: userId,
        },
        {
          onConflict: 'owner',
        },
      )
      .match({ owner: userId });

    setSaveLoading(false);
    if (error !== null) {
      alert(error.message);
    } else {
      alert("Saved");
    }
  }

  useEffect(() => {
    const user = supabase.auth.user();
    if (user !== null) {
      setUser(user);
      getTodos(user.id);
    }
  }, [session]);

  return (
    <>
      <div
        className="flex w-full m-8"
      >
        <h1 className="mx-4">
          { `${user?.email} Todos` }
        </h1>
        <button
          className="px-4 rounded border-2 bg-slate-300"
          onClick={() => { handleLogout(); }}
        >
          Logout
        </button>
      </div>
      <div
        className="m-8 px-4 flex flex-col"
      >
        <div>
          <input
            className="my-4 px-4 rounded border-2"
            value={input}
            placeholder="your todo here!"
            onChange={(e) => { setInput(e.target.value); }}
          />
          <button
            className="px-4 bg-slate-300 rounded m-8"
            onClick={() => { 
              setTodos(todos.concat(input));
              setInput("");
            }}
          >
            Add
          </button>
        </div>
        { 
          todos.map((it, idx) => {
            return (
              <div
                className="my-4 flex space-between"
                key={idx}
              >
                <p
                  className="px-4 rounded border-2 w-full"
                >
                  {it}
                </p>
                <button 
                  className="mx-4 rounded border-2 bg-slate-300"
                  onClick={() => {
                    setTodos(todos.filter((_, i) => i !== idx));
                  }}
                >Remove</button>
              </div>
            )
          }) 
        }
      </div>
      <button 
        disabled={saveLoading}
        className="px-4 bg-slate-300 rounded m-8"
        onClick={() => { saveCurrentTodos(user?.id ?? ""); }}
      >
        { saveLoading ? "Loading..." : "Save" }
      </button>
    </>
  )
}

export default Todo;
