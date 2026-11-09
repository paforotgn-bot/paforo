'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import type { Dictionary } from '@/types';

interface ContactFormProps {
  dict: Dictionary;
}


export function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [service, setService] = useState('');


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      phone: formData.get('phone') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string,
    };

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = 'Required';
    if (!data.email || !data.email.includes('@')) newErrors.email = 'Valid email required';
    if (!data.message) newErrors.message = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('idle');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const serviceOptions = [
    { value: '', label: dict.contact.selectService },
    { value: 'consultancy', label: dict.contact.consultancy },
    { value: 'web', label: dict.services.web.title },
    { value: 'software', label: dict.services.software.title },
  ];

  if (status === 'success') {
    return (
      <div className="rule py-10">
        <p className="display-sm">{dict.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label={dict.contact.name}
          placeholder="John Doe"
          error={errors.name}
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label={dict.contact.email}
          placeholder="john@company.com"
          error={errors.email}
          required
        />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          id="company"
          name="company"
          label={dict.contact.company}
          placeholder="Empresa S.L."
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          label={dict.contact.phone}
          placeholder="+34 600 000 000"
        />
      </div>
      <Select
        id="service"
        name="service"
        label={dict.contact.service}
        options={serviceOptions}
        value={service}
        onChange={(e) => setService(e.target.value)}
      />
      <Textarea
        id="message"
        name="message"
        label={dict.contact.message}
        placeholder={dict.contact.message}
        error={errors.message}
        required
      />
      <Button type="submit" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? dict.common.loading : dict.contact.submit}
      </Button>
      {status === 'error' && (
        <p className="label !text-accent">{dict.contact.error}</p>
      )}
    </form>
  );
}
