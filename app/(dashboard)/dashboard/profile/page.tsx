"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useProfile, useUpdateProfile } from "@/lib/hooks";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Languages,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

function censorEmail(email?: string) {
  if (!email) return "Not set";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

import { ReactNode } from "react";
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card/60 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <div className="text-sm font-semibold break-words whitespace-pre-wrap">
        {value}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const update = useUpdateProfile();
  const [showEmail, setShowEmail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    country: profile?.country || "",
    native_language: profile?.native_language || "",
    bio: profile?.bio || "",
    profile_picture: profile?.profile_picture || "",
    profile_picture_file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setFormState({
      full_name: profile.full_name || "",
      phone_number: profile.phone_number || "",
      country: profile.country || "",
      native_language: profile.native_language || "",
      bio: profile.bio || "",
      profile_picture: profile.profile_picture || "",
      profile_picture_file: null,
    });
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <Card className="border-dashed border-border/50 bg-card/40">
        <CardContent className="p-8 text-center text-muted-foreground">
          Unable to load profile data.
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <Card className="overflow-hidden border-border/50 bg-card/60 shadow-sm">
        <CardContent className="p-8 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative h-24 w-24 shrink-0 rounded-full border bg-primary/10 flex items-center justify-center overflow-hidden group">
            {formState.profile_picture ? (
              <img
                src={formState.profile_picture}
                alt={formState.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-primary" />
            )}
            {isEditing && (
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
              >
                <span className="text-white text-xs font-bold bg-primary/80 rounded px-2 py-1">
                  Edit
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (ev) => {
                  setFormState((prev) => ({
                    ...prev,
                    profile_picture: ev.target?.result as string,
                    profile_picture_file: file,
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {isEditing ? (
                  <Input
                    value={formState.full_name}
                    onChange={(e) =>
                      setFormState({ ...formState, full_name: e.target.value })
                    }
                    className="text-2xl font-black tracking-tight"
                  />
                ) : (
                  <h2 className="text-2xl font-black tracking-tight">
                    {profile.full_name}
                  </h2>
                )}
                <Badge
                  variant="outline"
                  className="uppercase tracking-widest text-[10px] font-bold"
                >
                  {profile.role}
                </Badge>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormState({
                        full_name: profile.full_name || "",
                        phone_number: profile.phone_number || "",
                        country: profile.country || "",
                        native_language: profile.native_language || "",
                        bio: profile.bio || "",
                        profile_picture: profile.profile_picture || "",
                        profile_picture_file: null,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={update.status === "pending"}
                    onClick={() => {
                      update.mutate({
                        full_name: formState.full_name,
                        phone_number: formState.phone_number || null,
                        country: formState.country || null,
                        native_language: formState.native_language || null,
                        bio: formState.bio || null,
                        profile_picture_file:
                          formState.profile_picture_file ?? undefined,
                      });
                      setIsEditing(false);
                    }}
                  >
                    {update.status === "pending" ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {showEmail ? profile.email : censorEmail(profile.email)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-card/60 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email
            </div>
            <button
              aria-label={showEmail ? "Hide email" : "Show email"}
              onClick={() => setShowEmail((s) => !s)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showEmail ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-sm font-semibold break-words whitespace-pre-wrap">
            {showEmail ? profile.email : censorEmail(profile.email)}
          </p>
        </div>

        {isEditing ? (
          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={
              <Input
                value={formState.phone_number}
                onChange={(e) =>
                  setFormState({ ...formState, phone_number: e.target.value })
                }
              />
            }
          />
        ) : (
          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={profile.phone_number || "Not set"}
          />
        )}
        {isEditing ? (
          <InfoItem
            icon={MapPin}
            label="Country"
            value={
              <Input
                value={formState.country}
                onChange={(e) =>
                  setFormState({ ...formState, country: e.target.value })
                }
              />
            }
          />
        ) : (
          <InfoItem
            icon={MapPin}
            label="Country"
            value={profile.country || "Not set"}
          />
        )}
        {isEditing ? (
          <InfoItem
            icon={Languages}
            label="Native Language"
            value={
              <Input
                value={formState.native_language}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    native_language: e.target.value,
                  })
                }
              />
            }
          />
        ) : (
          <InfoItem
            icon={Languages}
            label="Native Language"
            value={profile.native_language || "Not set"}
          />
        )}
        <InfoItem icon={ShieldCheck} label="Role" value={profile.role} />
      </div>

      <Card className="border-border/50 bg-card/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Bio
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              value={formState.bio}
              onChange={(e) =>
                setFormState({ ...formState, bio: e.target.value })
              }
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {profile.bio || "Not set"}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
