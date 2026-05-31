"use client";
import { useState } from "react";
import { Input, Button, Select } from "@/components/ui";
import {
  usePayoutRules,
  useUpdatePayoutRule,
  type PayoutRule,
} from "@/lib/hooks";
import {
  formatCurrency,
  formatLargeNumber,
} from "@/lib/utils/number-formatter";

const ROLE_LABELS: Record<string, string> = {
  contributor: "Contributor",
  annotator: "Annotator",
  expert: "Expert Reviewer",
};

const ROLE_OPTIONS = [
  { value: "contributor", label: "Contributor" },
  { value: "annotator", label: "Annotator" },
  { value: "expert", label: "Expert Reviewer" },
];

export function PayoutRules() {
  const { data: rules, isLoading } = usePayoutRules();
  const updateMutation = useUpdatePayoutRule();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PayoutRule> | null>(
    null,
  );

  const onStartEdit = (rule: PayoutRule) => {
    setEditingId(rule.id);
    setEditingData({ ...rule });
  };

  const onSaveEdit = () => {
    if (!editingId || !editingData) return;

    const payload = {
      role: editingData.role || "",
      minimum_points_required: Number(editingData.minimum_points_required) || 0,
      minimum_withdrawal_amount: String(
        editingData.minimum_withdrawal_amount || "",
      ),
      score_to_currency_rate: String(editingData.score_to_currency_rate || ""),
      active: editingData.active ?? true,
    };

    updateMutation.mutate(
      { id: editingId, payload },
      {
        onSuccess: () => setEditingId(null),
      },
    );
  };

  return (
    <div className="space-y-4 pt-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-black">Payout Rules</h2>
        <p className="text-sm text-muted-foreground">
          Define payout thresholds and currency conversion rates by role.
        </p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !rules || rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No payout rules found.
          </p>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="p-4 rounded-lg border bg-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {editingId === rule.id && editingData ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold">Role</label>
                      <Select
                        value={editingData.role || ""}
                        onChange={(e) =>
                          setEditingData((s) =>
                            s ? { ...s, role: e.target.value } : null,
                          )
                        }
                        disabled
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold">
                        Min Points Required
                      </label>
                      <Input
                        type="number"
                        value={String(editingData.minimum_points_required || 0)}
                        onChange={(e) =>
                          setEditingData((s) =>
                            s
                              ? {
                                  ...s,
                                  minimum_points_required: Number(
                                    e.target.value,
                                  ),
                                }
                              : null,
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold">
                        Min Withdrawal Amount
                      </label>
                      <Input
                        type="text"
                        value={String(
                          editingData.minimum_withdrawal_amount || "",
                        )}
                        onChange={(e) =>
                          setEditingData((s) =>
                            s
                              ? {
                                  ...s,
                                  minimum_withdrawal_amount: e.target.value,
                                }
                              : null,
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold">
                        Currency Rate
                      </label>
                      <Input
                        type="text"
                        value={String(editingData.score_to_currency_rate || "")}
                        onChange={(e) =>
                          setEditingData((s) =>
                            s
                              ? { ...s, score_to_currency_rate: e.target.value }
                              : null,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="text-xs font-semibold mr-2">
                        <input
                          type="checkbox"
                          checked={editingData.active ?? true}
                          onChange={(e) =>
                            setEditingData((s) =>
                              s ? { ...s, active: e.target.checked } : null,
                            )
                          }
                          className="mr-1"
                        />
                        Active
                      </label>
                    </div>

                    <div className="flex items-end gap-2">
                      <Button
                        onClick={onSaveEdit}
                        isLoading={updateMutation.isPending}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-semibold">
                        {ROLE_LABELS[rule.role] || rule.role}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Min Points
                      </p>
                      <p className="text-sm font-semibold">
                        {formatLargeNumber(rule.minimum_points_required)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Min Withdrawal
                      </p>
                      <p className="text-sm font-semibold">
                        {formatLargeNumber(
                          Number(rule.minimum_withdrawal_amount),
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Currency Rate
                      </p>
                      <p className="text-sm font-semibold">
                        {rule.score_to_currency_rate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-semibold">
                        {rule.active ? "Active" : "Inactive"}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => onStartEdit(rule)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
