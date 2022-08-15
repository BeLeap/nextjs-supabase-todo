import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Auth from "../components/Auth";
import Todo from "../components/Todo";
import { supabase } from "../utils/supabase";

function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      { !session ? <Auth /> : <Todo session={session}/> }
    </>
  );
}

export default Home;
