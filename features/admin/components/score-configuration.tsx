"use client";

import React, { useState } from "react";
import { useScoreConfigs, useCreateScoreConfig, useUpdateScoreConfig } from "@/lib/hooks";
import { Input, Button, Select, Modal } from "@/components/ui";
import { toast } from "sonner";

const ACTION_TYPES = [
  "document_approved",
  "dataset_included",
  "dataset_sold",
  "annotation_submitted",
  "annotation_match_consensus",
  "annotation_below_threshold",
  "expert_review_completed",
  "conflict_resolved",
];

const ACTION_LABELS: Record<string, string> = {
  document_approved: 'Document Approved',
  dataset_included: 'Dataset Included',
  dataset_sold: 'Dataset Sold',
  annotation_submitted: 'Annotation Submitted',
  annotation_match_consensus: 'Annotation Match (Consensus)',
  annotation_below_threshold: 'Annotation Below Threshold',
  expert_review_completed: 'Expert Review Completed',
  conflict_resolved: 'Conflict Resolved',
};

function getActionLabel(key: string) {
  return ACTION_LABELS[key] ?? key.replace(/_/g, ' ');
}

export function ScoreConfiguration() {
  const { data: configs, isLoading } = useScoreConfigs();
  const createMutation = useCreateScoreConfig();
  const updateMutation = useUpdateScoreConfig();

  const [form, setForm] = useState({ action_type: ACTION_TYPES[0], points_value: 0, description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ action_type: ACTION_TYPES[0], points_value: 0, description: "" });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const onCreate = () => {
    const payload = { action_type: form.action_type, points_value: Number(form.points_value), description: form.description || null };
    createMutation.mutate(payload, {
      onError: (err: any) => toast.error(err?.message || 'Create failed'),
      onSuccess: () => setForm({ action_type: ACTION_TYPES[0], points_value: 0, description: "" }),
    });
  };

  const onStartEdit = (cfg: any) => {
    setEditingId(cfg.id);
    setEditingData({ action_type: cfg.action_type, points_value: Number(cfg.points_value), description: cfg.description ?? "" });
  };

  const onSaveEdit = () => {
    if (editingId == null) return;
    const payload = { action_type: editingData.action_type, points_value: Number(editingData.points_value), description: editingData.description || null };
    updateMutation.mutate({ id: editingId, payload }, { onSuccess: () => setEditingId(null) });
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black">Score Configuration</h2>
        <p className="text-sm text-muted-foreground">Define action-to-points mappings used across the platform.</p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Current Rules</h3>
        <Button onClick={() => setIsCreateOpen(true)}>Add Rule</Button>
      </div>

      <div className="space-y-2 mt-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !configs || configs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No score configurations found.</p>
        ) : (
          configs.map((cfg) => (
            <div key={cfg.id} className="p-3 rounded-lg border bg-card flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{getActionLabel(cfg.action_type)}</p>
                <p className="text-xs text-muted-foreground">{cfg.description ?? '—'}</p>
              </div>
              <div className="flex items-center gap-3">
                {editingId === cfg.id ? (
                  <>
                    <Input type="number" value={String(editingData.points_value)} onChange={(e) => setEditingData((s) => ({ ...s, points_value: Number(e.target.value) }))} />
                    <Button onClick={onSaveEdit} isLoading={updateMutation.isPending}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <div className="text-right">
                      <p className="text-sm font-black">{cfg.points_value}</p>
                    </div>
                    <Button onClick={() => onStartEdit(cfg)} variant="outline">Edit</Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Score Rule">
        <div className="space-y-3">
          <label className="text-xs">Action Type</label>
          <Select value={form.action_type} onChange={(e) => setForm((s) => ({ ...s, action_type: e.target.value }))}>
            {ACTION_TYPES.map((t) => (
              <option key={t} value={t}>{getActionLabel(t)}</option>
            ))}
          </Select>

          <label className="text-xs">Points Value</label>
          <Input type="number" value={String(form.points_value)} onChange={(e) => setForm((s) => ({ ...s, points_value: Number(e.target.value) }))} />

          <label className="text-xs">Description</label>
          <Input value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { onCreate(); setIsCreateOpen(false); }} isLoading={createMutation.isPending}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
