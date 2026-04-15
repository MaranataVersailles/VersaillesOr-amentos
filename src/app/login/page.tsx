"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

// Stagger container
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Senha incorreta.");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808]">

      {/* Noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Subtle radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Hairline horizontal rule - decorative structural element */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="pointer-events-none fixed left-0 right-0 top-1/2 z-[4] h-px -translate-y-1/2 bg-white/[0.03]"
      />

      {/* Main layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex w-full max-w-sm flex-col items-center gap-10 px-6"
      >

        {/* Logo */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/[0.05] ring-1 ring-white/10 backdrop-blur-sm">
            <Image
              src="/logo.png"
              alt="Versailles"
              width={64}
              height={64}
              className="h-full w-full object-contain p-1.5"
              priority
            />
          </div>

          {/* Brand name - editorial typographic treatment */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h1
              className="text-[2.75rem] font-light tracking-[0.2em] text-white/90 uppercase"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.3em" }}
            >
              Versailles
            </h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-light">
              Gerador de Orçamentos
            </p>
          </div>
        </motion.div>

        {/* Thin divider */}
        <motion.div
          variants={fadeIn}
          className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Form */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="w-full space-y-4"
        >
          {/* Input group */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40"
            >
              <Lock className="h-2.5 w-2.5" />
              Acesso restrito
            </label>

            <motion.div
              animate={focused ? { scale: 1.015 } : { scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <input
                ref={inputRef}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required
                autoFocus
                className="w-full rounded-none border-0 border-b bg-transparent pb-3 pt-1 text-sm text-white/80 placeholder:text-white/15 outline-none transition-all duration-300"
                style={{
                  borderColor: focused
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(255,255,255,0.1)",
                }}
              />
            </motion.div>
          </div>

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] text-red-400/80"
            >
              {error}
            </motion.p>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading || !password}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-white/90 text-[11px] font-medium uppercase tracking-[0.2em] text-black/80 transition-all duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Verificando</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Footer signature */}
        <motion.p
          variants={fadeIn}
          className="text-[9px] uppercase tracking-[0.3em] text-white/15"
        >
          Sistema privado · Acesso autorizado
        </motion.p>
      </motion.div>

      {/* Corner coordinates - Awwwards detail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none fixed bottom-6 left-6 z-20 hidden sm:block"
      >
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 font-mono">
          VRS — 2025
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none fixed bottom-6 right-6 z-20 hidden sm:block"
      >
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/15 font-mono">
          Auth. Gateway
        </p>
      </motion.div>
    </div>
  );
}
