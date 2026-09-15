import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyApi, FamilyMember } from '@/api/familyApi';
import {
  Users, Plus, Edit2, Trash2, X, Save, Droplet, Phone, Mail, Calendar,
  Heart, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RELATIONS = ['spouse', 'parent', 'child', 'sibling', 'grandparent', 'other'];

const RELATION_EMOJI: Record<string, string> = {
  spouse: '💑', parent: '👨‍👩‍👦', child: '👶', sibling: '👫', grandparent: '👴', other: '👤',
};

function bloodGroupColor(bg?: string) {
  if (!bg) return 'bg-slate-100 text-slate-500';
  if (bg.startsWith('A')) return 'bg-blue-100 text-blue-700';
  if (bg.startsWith('B')) return 'bg-rose-100 text-rose-700';
  if (bg.startsWith('AB')) return 'bg-purple-100 text-purple-700';
  return 'bg-emerald-100 text-emerald-700';
}

const emptyForm = { name: '', email: '', phone: '', dateOfBirth: '', bloodGroup: '', relation: 'other' };

interface FormState { name: string; email: string; phone: string; dateOfBirth: string; bloodGroup: string; relation: string; }

function MemberForm({
  initial, onSave, onCancel, isPending,
}: {
  initial: FormState; onSave: (f: FormState) => void; onCancel: () => void; isPending: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40';
  const labelClass = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1';

  return (
    <div className="space-y-4 pt-2">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input value={form.name} onChange={set('name')} placeholder="e.g. Priya Sharma" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone *</label>
          <input type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="optional" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Blood Group</label>
          <select value={form.bloodGroup} onChange={set('bloodGroup')} className={inputClass}>
            <option value="">Select (optional)</option>
            {BLOOD_GROUPS.filter(Boolean).map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Relation *</label>
          <select value={form.relation} onChange={set('relation')} className={inputClass}>
            {RELATIONS.map(r => (
              <option key={r} value={r}>{RELATION_EMOJI[r]} {r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 flex items-center gap-1 justify-center px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button
          type="button"
          disabled={isPending || !form.name || !form.phone || !form.dateOfBirth}
          onClick={() => onSave(form)}
          className="flex-1 flex items-center gap-1 justify-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Member
        </button>
      </div>
    </div>
  );
}

export default function FamilyMembersPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const { data: members = [], isLoading, isError } = useQuery<FamilyMember[]>({
    queryKey: ['familyMembers'],
    queryFn: familyApi.getMyFamilyMembers,
  });

  const createMutation = useMutation({
    mutationFn: familyApi.createFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
      setShowAdd(false);
      showToast('Family member added successfully!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => familyApi.updateFamilyMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
      setEditingId(null);
      showToast('Member updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: familyApi.deleteFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
      showToast('Member removed.');
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in-up">
            <CheckCircle2 className="w-5 h-5" /> {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
              Family Health Profiles
            </h1>
            <p className="text-slate-500 text-sm mt-1">Add family members so you can manage their health information in one place.</p>
          </div>
          {!showAdd && (
            <button
              id="btn-add-family-member"
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors shadow"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          )}
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="bg-white rounded-2xl border-2 border-brand-200 shadow-sm p-6 mb-6 animate-fade-in-up">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-600" /> New Family Member
            </h3>
            <MemberForm
              initial={emptyForm}
              onSave={f => createMutation.mutate(f as any)}
              onCancel={() => setShowAdd(false)}
              isPending={createMutation.isPending}
            />
            {createMutation.isError && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Failed to add. Please check inputs and try again.
              </p>
            )}
          </div>
        )}

        {/* Members List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">Failed to load family members.</div>
        ) : members.length === 0 && !showAdd ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No family members yet</h3>
            <p className="text-slate-500 text-sm mb-6">Add family members to track their blood groups and health details.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add First Member
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map(m => (
              <div key={m._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {editingId === m._id ? (
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-brand-600" /> Editing: {m.name}
                    </h3>
                    <MemberForm
                      initial={{
                        name: m.name,
                        email: m.email || '',
                        phone: m.phone,
                        dateOfBirth: m.dateOfBirth?.slice(0, 10) || '',
                        bloodGroup: m.bloodGroup || '',
                        relation: m.relation,
                      }}
                      onSave={f => updateMutation.mutate({ id: m._id, data: f })}
                      onCancel={() => setEditingId(null)}
                      isPending={updateMutation.isPending}
                    />
                  </div>
                ) : (
                  <div className="p-5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-xl shrink-0">
                        {RELATION_EMOJI[m.relation] || '👤'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900">{m.name}</h3>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">{m.relation}</span>
                          {m.bloodGroup && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${bloodGroupColor(m.bloodGroup)}`}>
                              <Droplet className="w-3 h-3" /> {m.bloodGroup}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>
                          {m.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</span>}
                          {m.dateOfBirth && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(m.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingId(m._id)}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (window.confirm(`Remove ${m.name} from family?`)) deleteMutation.mutate(m._id); }}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
