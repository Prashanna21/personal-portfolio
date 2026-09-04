'use client';

import { useState } from 'react';
import { site } from '@/lib/site';
import { ArrowRight, Check } from '@/components/icons';

const PURPOSES = ['A full-time role', 'A freelance project', 'A collaboration', 'Just saying hi'];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Web3Forms when a key is configured, `mailto:` when it is not.
 *
 * The fallback matters: without it, an unconfigured deploy would show a form
 * that appears to work and silently drops every message.
 */
export function ContactForm() {
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle');
  const [name, setName] = useState('');

  const configured = Boolean(site.contactKey);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const values = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    const next: Errors = {};
    if (values.name.length < 2) next.name = 'Please tell me your name.';
    if (!EMAIL_RE.test(values.email)) next.email = 'That email doesn’t look right.';
    if (values.message.length < 12) next.message = 'A sentence or two would help.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setName(values.name.split(' ')[0]);

    // honeypot — a real person never fills this
    if (data.get('botcheck')) return;

    if (!configured) {
      const body = `${values.message}\n\n— ${values.name}\n${values.email}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        `${purpose} — via maharjanprashanna.com.np`,
      )}&body=${encodeURIComponent(body)}`;
      setState('mailto');
      return;
    }

    setState('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.contactKey,
          subject: `${purpose} — portfolio enquiry from ${values.name}`,
          from_name: 'maharjanprashanna.com.np',
          name: values.name,
          email: values.email,
          purpose,
          message: values.message,
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setState('sent');
        form.reset();
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'sent' || state === 'mailto') {
    return (
      <div className="rounded-2xl border border-rule bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] p-8">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent">
          <Check width={22} height={22} className="text-paper" />
        </span>
        <p className="mt-5 font-display text-[1.625rem] leading-tight">
          Thanks, {name || 'there'}
          {state === 'sent' ? ' — message sent.' : ' — your email is ready.'}
        </p>
        <p className="mt-3 max-w-[42ch] leading-relaxed text-ink-2">
          {state === 'sent'
            ? 'It landed in my inbox. I’ll get back to you within a day or two.'
            : 'I’ve opened your mail client with the message pre-filled — hit send and it’s on its way.'}
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="link-wipe mt-5 text-[0.875rem] font-medium"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    'w-full rounded-[10px] border border-rule bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] px-4 py-3.5 text-[0.9375rem] text-ink outline-none transition-colors duration-200 placeholder:text-ink-3 focus:border-accent';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-rule bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] p-6 sm:p-8"
    >
      {/* honeypot */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Your name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            aria-invalid={Boolean(errors.name)}
            className={`${field} mt-2.5`}
          />
          {errors.name && <span className="mt-2 block text-[11.5px] text-[#ff8a7a]">{errors.name}</span>}
        </label>

        <label className="block">
          <span className="eyebrow">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            aria-invalid={Boolean(errors.email)}
            className={`${field} mt-2.5`}
          />
          {errors.email && (
            <span className="mt-2 block text-[11.5px] text-[#ff8a7a]">{errors.email}</span>
          )}
        </label>
      </div>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="eyebrow mb-3">What&rsquo;s this about?</legend>
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map((p) => {
            const on = purpose === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p)}
                aria-pressed={on}
                className="rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-200"
                style={{
                  borderColor: on ? 'var(--ink)' : 'var(--rule-2)',
                  background: on ? 'var(--ink)' : 'transparent',
                  color: on ? 'var(--paper)' : 'var(--ink-2)',
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-6 block">
        <span className="eyebrow">Message</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell me a little about what you're building…"
          aria-invalid={Boolean(errors.message)}
          className={`${field} mt-2.5 min-h-[7rem] resize-y leading-relaxed`}
        />
        {errors.message && (
          <span className="mt-2 block text-[11.5px] text-[#ff8a7a]">{errors.message}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="btn mt-7 !bg-accent !text-white disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Send message'}
        {state !== 'sending' && <ArrowRight width={14} height={14} />}
      </button>

      {state === 'error' && (
        <p className="mt-4 text-[0.8125rem] text-[#ff8a7a]">
          That didn&rsquo;t go through. Email me directly at{' '}
          <a href={`mailto:${site.email}`} className="link-lift">
            {site.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
