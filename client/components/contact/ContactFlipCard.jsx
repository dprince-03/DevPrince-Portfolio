"use client";

import { useState } from "react";
import { contactApi } from "@/lib/api";

const inputClass =
  "w-full rounded-lg border border-term-border bg-term-bg px-3.5 py-2.5 text-sm text-term-white outline-none focus:border-term-blue";
const labelClass = "mb-2 block text-[11px] font-bold uppercase tracking-wider text-term-blue";

const EMPTY_SHARED = { firstName: "", lastName: "", purpose: "HIRE", message: "" };

function Fields({ channel, shared, setShared, detail, setDetail }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`${channel}-firstName`}>
            first name
          </label>
          <input
            id={`${channel}-firstName`}
            required
            value={shared.firstName}
            onChange={(e) => setShared((f) => ({ ...f, firstName: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`${channel}-lastName`}>
            last name
          </label>
          <input
            id={`${channel}-lastName`}
            required
            value={shared.lastName}
            onChange={(e) => setShared((f) => ({ ...f, lastName: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor={`${channel}-detail`}>
          {channel === "WHATSAPP" ? "number" : "email"}
        </label>
        <input
          id={`${channel}-detail`}
          type={channel === "WHATSAPP" ? "tel" : "email"}
          required
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor={`${channel}-purpose`}>
          purpose
        </label>
        <select
          id={`${channel}-purpose`}
          value={shared.purpose}
          onChange={(e) => setShared((f) => ({ ...f, purpose: e.target.value }))}
          className={inputClass}
        >
          <option value="HIRE">Hire</option>
          <option value="CONSULT">Consult</option>
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor={`${channel}-message`}>
          message <span className="normal-case text-term-silver-dim">(optional)</span>
        </label>
        <textarea
          id={`${channel}-message`}
          rows={3}
          value={shared.message}
          onChange={(e) => setShared((f) => ({ ...f, message: e.target.value }))}
          className={inputClass}
        />
      </div>
    </div>
  );
}

export default function ContactFlipCard({ onSuccess }) {
  const [channel, setChannel] = useState("WHATSAPP");
  const [shared, setShared] = useState(EMPTY_SHARED);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await contactApi.submit({
        ...shared,
        channel,
        phone: channel === "WHATSAPP" ? phone : undefined,
        email: channel === "EMAIL" ? email : undefined,
      });
      setShared(EMPTY_SHARED);
      setPhone("");
      setEmail("");
      setStatus("idle");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div style={{ perspective: "2000px" }}>
      <div
        className="relative transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: channel === "EMAIL" ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* front — WhatsApp */}
        <div style={{ backfaceVisibility: "hidden" }} className={channel === "EMAIL" ? "pointer-events-none" : ""}>
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-term-border bg-term-panel/80 backdrop-blur-md"
          >
            <CardHeader channel="WHATSAPP" onSwitch={setChannel} />
            <div className="p-8">
              <Fields channel="WHATSAPP" shared={shared} setShared={setShared} detail={phone} setDetail={setPhone} />
              {status === "error" && <p className="mt-4 text-sm text-term-red">error: {error}</p>}
              <button
                type="submit"
                disabled={status === "loading" || channel !== "WHATSAPP"}
                className="mt-6 w-full rounded-lg bg-term-green py-3 text-sm font-bold text-term-bg transition hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? "sending..." : "$ send --whatsapp"}
              </button>
            </div>
          </form>
        </div>

        {/* back — Email */}
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className={`absolute inset-0 ${channel === "WHATSAPP" ? "pointer-events-none" : ""}`}
        >
          <form
            onSubmit={handleSubmit}
            className="h-full overflow-hidden rounded-2xl border border-term-border bg-term-panel/80 backdrop-blur-md"
          >
            <CardHeader channel="EMAIL" onSwitch={setChannel} />
            <div className="p-8">
              <Fields channel="EMAIL" shared={shared} setShared={setShared} detail={email} setDetail={setEmail} />
              {status === "error" && <p className="mt-4 text-sm text-term-red">error: {error}</p>}
              <button
                type="submit"
                disabled={status === "loading" || channel !== "EMAIL"}
                className="mt-6 w-full rounded-lg bg-term-blue py-3 text-sm font-bold text-term-bg transition hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? "sending..." : "$ send --email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CardHeader({ channel, onSwitch }) {
  return (
    <div className="flex items-center gap-2 border-b border-term-border bg-term-bg/60 px-5 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-term-red" />
      <span className="h-2.5 w-2.5 rounded-full bg-term-gold" />
      <span className="h-2.5 w-2.5 rounded-full bg-term-green" />
      <div className="mx-auto flex gap-1 rounded-full border border-term-border bg-term-bg p-1">
        <button
          type="button"
          onClick={() => onSwitch("WHATSAPP")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            channel === "WHATSAPP" ? "bg-term-green/20 text-term-green" : "text-term-silver-dim"
          }`}
        >
          whatsapp
        </button>
        <button
          type="button"
          onClick={() => onSwitch("EMAIL")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            channel === "EMAIL" ? "bg-term-blue/20 text-term-blue" : "text-term-silver-dim"
          }`}
        >
          email
        </button>
      </div>
    </div>
  );
}
