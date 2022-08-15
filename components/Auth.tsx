import { useState } from "react"
import { supabase } from "../utils/supabase";

function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signIn({ email });
    if (error !== null) {
      alert(error.message);
    } else {
      alert('Check email');
    }
    setLoading(false);
  }

  return (
    <>
      <input
        className="rounded-md border-2 m-8 px-4"
        type="email"
        placeholder="your email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); }}
      />
      <button
        disabled={loading}
        className="rounded-md border-2 m-8 px-4 bg-slate-300"
        onClick={() => { handleLogin(email); }}
      >
        { loading ? "Loading..." : "Send" }
      </button>
    </>
  )
}

export default Auth;
