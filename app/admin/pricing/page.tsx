// app/admin/pricing/page.tsx
'use client';
import { useState } from 'react';
import { DollarSign, Lock, Unlock, Save, CheckCircle, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['2 full courses', '20 challenges', 'Basic certifications', 'Community access', 'Progress tracking'],
    lockedFeatures: ['Advanced courses', 'All challenges', 'Lab environments', 'All certifications'],
  },
  pro: {
    name: 'Pro',
    price: 12,
    features: ['All 10+ courses', '200+ challenges', 'Lab environments', 'All certifications', 'Exam prep kits', 'Priority support', 'Job board access'],
  },
};

export default function AdminPricingPage() {
  const [proPrice, setProPrice] = useState(12);
  const [freeTrialDays, setFreeTrialDays] = useState(0);
  const [saving, setSaving] = useState(false);
  const [proFeatures, setProFeatures] = useState(DEFAULT_PLANS.pro.features);
  const [newFeature, setNewFeature] = useState('');

  const save = async () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Pricing settings saved! ✅'); }, 800);
  };

  const removeFeature = (idx: number) => setProFeatures(p => p.filter((_, i) => i !== idx));
  const addFeature = () => {
    if (newFeature.trim()) { setProFeatures(p => [...p, newFeature.trim()]); setNewFeature(''); }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Pricing <span className="text-yellow-400">Management</span></h1>
        <p className="text-gray-400 font-mono text-sm">Control plans, pricing, and feature access</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pro Price', value: `$${proPrice}/mo`, icon: DollarSign, color: 'yellow' },
          { label: 'Est. Monthly Revenue', value: `$${proPrice * 1}`, icon: Crown, color: 'green' },
          { label: 'Free Trial Days', value: freeTrialDays === 0 ? 'None' : `${freeTrialDays} days`, icon: CheckCircle, color: 'blue' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-xl p-5 border bg-[#0f0f18] ${color === 'yellow' ? 'border-yellow-500/20' : color === 'green' ? 'border-emerald-500/20' : 'border-blue-500/20'}`}>
            <Icon className={`w-5 h-5 mb-3 ${color === 'yellow' ? 'text-yellow-400' : color === 'green' ? 'text-emerald-400' : 'text-blue-400'}`} />
            <p className={`text-2xl font-bold mb-1 ${color === 'yellow' ? 'text-yellow-400' : color === 'green' ? 'text-emerald-400' : 'text-blue-400'}`}>{value}</p>
            <p className="text-gray-500 font-mono text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="rounded-xl border border-gray-700 bg-[#0f0f18] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gray-500/10 rounded-xl border border-gray-500/20 flex items-center justify-center">
              <Unlock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Free Plan</h2>
              <p className="text-gray-500 font-mono text-xs">$0 / forever</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Included Features</p>
            {DEFAULT_PLANS.free.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-300 font-mono">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {f}
              </div>
            ))}
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-4 mb-2">Locked (Pro Only)</p>
            {DEFAULT_PLANS.free.lockedFeatures.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-600 font-mono">
                <Lock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div className="rounded-xl border border-yellow-500/20 bg-[#0f0f18] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl border border-yellow-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Pro Plan</h2>
                <p className="text-yellow-400 font-mono text-xs font-bold">${proPrice}/month</p>
              </div>
            </div>
          </div>

          {/* Price Editor */}
          <div className="mb-5 p-4 bg-black/30 rounded-xl border border-gray-800">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Monthly Price (USD)</label>
            <div className="flex items-center gap-3">
              <span className="text-white font-mono text-xl">$</span>
              <input type="number" value={proPrice} min={1} max={999}
                onChange={e => setProPrice(parseInt(e.target.value) || 0)}
                className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white text-lg font-mono focus:outline-none focus:border-yellow-500/50" />
              <span className="text-gray-400 font-mono text-sm">/month</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Free Trial Days</label>
            <input type="number" value={freeTrialDays} min={0} max={30}
              onChange={e => setFreeTrialDays(parseInt(e.target.value) || 0)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-yellow-500/50" />
            <p className="text-gray-600 font-mono text-xs mt-1">Set 0 to disable free trial</p>
          </div>

          {/* Pro Features Editor */}
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Pro Features</p>
            <div className="space-y-1.5 mb-3">
              {proFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-mono flex-1">{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFeature()}
                placeholder="Add feature..." className="flex-1 bg-black/30 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-yellow-500/50 placeholder-gray-600" />
              <button onClick={addFeature} className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-mono hover:bg-yellow-500/20 transition-all">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-8 py-3 rounded-xl font-mono font-bold hover:border-yellow-400/50 hover:bg-yellow-500/30 transition-all disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Pricing Settings'}
        </button>
      </div>
    </div>
  );
}
