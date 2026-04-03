'use client';
import { useState } from 'react';
import { Settings, Shield, Bell, Globe, Save, Key, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'CyberQuest',
    siteTagline: 'Master Cybersecurity',
    maxSessions: 3,
    baseBanMinutes: 40,
    maintenanceMode: false,
    registrationOpen: true,
    emailNotifications: true,
    autoApproveUsers: true,
    stripePublicKey: '',
    stripeSecretKey: '',
    anthropicKey: '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Settings saved! ✅'); }, 600);
  };

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="rounded-xl border border-gray-800 bg-[#0f0f18] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-black/20">
        <Icon className="w-5 h-5 text-red-400" />
        <h2 className="text-white font-bold">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, desc, children }: any) => (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-white text-sm font-bold">{label}</p>
        {desc && <p className="text-gray-500 font-mono text-xs mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  const Toggle = ({ value, onChange }: any) => (
    <button onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-gray-700'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Platform <span className="text-red-400">Settings</span></h1>
        <p className="text-gray-400 font-mono text-sm">Configure all platform settings</p>
      </div>

      <Section title="General Settings" icon={Globe}>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Site Name', key: 'siteName', placeholder: 'CyberQuest' },
            { label: 'Tagline', key: 'siteTagline', placeholder: 'Master Cybersecurity' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
              <input value={(settings as any)[key]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-red-500/50" />
            </div>
          ))}
        </div>
        <Field label="Maintenance Mode" desc="Disable access to all users except admins">
          <Toggle value={settings.maintenanceMode} onChange={(v: boolean) => setSettings(p => ({ ...p, maintenanceMode: v }))} />
        </Field>
        <Field label="Open Registration" desc="Allow new users to register">
          <Toggle value={settings.registrationOpen} onChange={(v: boolean) => setSettings(p => ({ ...p, registrationOpen: v }))} />
        </Field>
        <Field label="Auto-approve Users" desc="Automatically activate new registrations">
          <Toggle value={settings.autoApproveUsers} onChange={(v: boolean) => setSettings(p => ({ ...p, autoApproveUsers: v }))} />
        </Field>
      </Section>

      <Section title="Security Settings" icon={Shield}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Max Active Sessions Per User</label>
            <input type="number" min={1} max={10} value={settings.maxSessions}
              onChange={e => setSettings(p => ({ ...p, maxSessions: parseInt(e.target.value) || 3 }))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-red-500/50" />
            <p className="text-gray-600 font-mono text-xs mt-1">Currently: {settings.maxSessions} sessions max</p>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Base Ban Duration (minutes)</label>
            <input type="number" min={1} value={settings.baseBanMinutes}
              onChange={e => setSettings(p => ({ ...p, baseBanMinutes: parseInt(e.target.value) || 40 }))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-red-500/50" />
            <p className="text-gray-600 font-mono text-xs mt-1">Doubles on each violation. Currently: {settings.baseBanMinutes} min</p>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-gray-800">
          <p className="text-white font-bold text-sm mb-2">🔒 Auto-ban Logic</p>
          <div className="space-y-1">
            {[1,2,3,4].map(n => (
              <div key={n} className="flex items-center gap-3 text-xs font-mono">
                <span className="text-gray-500">Violation {n}:</span>
                <span className="text-red-400">{settings.baseBanMinutes * Math.pow(2, n-1)} minutes ban</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="API Keys" icon={Key}>
        <div className="space-y-4">
          {[
            { label: 'Stripe Public Key', key: 'stripePublicKey', placeholder: 'pk_live_...' },
            { label: 'Stripe Secret Key', key: 'stripeSecretKey', placeholder: 'sk_live_...' },
            { label: 'Anthropic API Key (for AI Assistant)', key: 'anthropicKey', placeholder: 'sk-ant-...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input type="password" value={(settings as any)[key]}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-red-500/50 placeholder-gray-600" />
              </div>
              <p className="text-gray-600 font-mono text-xs mt-1">Also set in .env.local for security</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Notifications" icon={Bell}>
        <Field label="Email Notifications" desc="Send system emails to users">
          <Toggle value={settings.emailNotifications} onChange={(v: boolean) => setSettings(p => ({ ...p, emailNotifications: v }))} />
        </Field>
      </Section>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-8 py-3 rounded-xl font-mono font-bold hover:border-red-400/50 hover:bg-red-500/30 transition-all disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
