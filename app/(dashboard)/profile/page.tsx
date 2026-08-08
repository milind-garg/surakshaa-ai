"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import {
  User,
  Briefcase,
  Heart,
  Shield,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Edit2,
  Camera,
  Upload,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface FamilyMember {
  id?: string;
  name: string;
  relation: string;
  age: number | "";
  gender: string;
  health_conditions: string[];
}

const HEALTH_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Cancer",
  "Kidney Disease",
  "Thyroid",
  "Obesity",
  "None",
];

const RELATIONS = ["spouse", "child", "parent", "sibling", "other"];

function calcCompletion(data: any, family: FamilyMember[]): number {
  const fields = [
    data.fullName,
    data.age,
    data.gender,
    data.occupation,
    data.annualIncome,
  ];
  const filled = fields.filter(Boolean).length;
  const familyBonus = family.length > 0 ? 1 : 0;
  return Math.round(((filled + familyBonus) / (fields.length + 1)) * 100);
}

// ── Profile Picture Component ──────────────────────────────────
function ProfilePictureCard({
  fullName,
  email,
  avatarUrl,
  onAvatarChange,
}: {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  onAvatarChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email?.slice(0, 2).toUpperCase() ?? "SA";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAvatarChange(result);
        toast.success("Profile picture updated! 📸");
      }
    };
    reader.readAsDataURL(file);
  };

  const AVATAR_PRESETS = [
    {
      label: "Cool Sunglasses Sticker",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png",
    },
    {
      label: "AI Advisor Robot",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png",
    },
    {
      label: "Health Specialist Sticker",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Health%20Worker.png",
    },
    {
      label: "Technologist Sticker",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Technologist.png",
    },
    {
      label: "Star-Struck Sticker",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Star-Struck.png",
    },
    {
      label: "Party Face Sticker",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Partying%20Face.png",
    },
    {
      label: "Aegis Shield Sticker",
      url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Shield.png",
    },
  ];

  return (
    <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Avatar Circle with Camera Badge */}
        <div className="relative group shrink-0">
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-slate-100 shadow-md ring-2 ring-[#1D7A6C]/20 bg-slate-50">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={fullName || "User"} className="object-contain p-1" />
            ) : null}
            <AvatarFallback className="bg-[#1D7A6C] text-white text-2xl sm:text-3xl font-bold font-sans">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Camera Button Badge */}
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1D7A6C] hover:bg-[#165E53] text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 border-2 border-white"
            title="Upload Profile Picture"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* User Details & Quick Controls */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {fullName || "Valued Policyholder"}
              </h2>
              <Badge className="bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-[10px] uppercase tracking-wider">
                ✓ VERIFIED PROFILE
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {email || "user@suraksha.ai"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              <Upload className="w-3.5 h-3.5 text-[#1D7A6C]" />
              Upload Photo
            </Button>

            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAvatarChange("");
                  toast.success("Profile picture reset to initials");
                }}
                className="h-8 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </Button>
            )}
          </div>

          {/* Preset Avatar Selection */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
              Or pick an animated sticker face:
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onAvatarChange(preset.url);
                    toast.success(`Selected ${preset.label}`);
                  }}
                  className={cn(
                    "w-10 h-10 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-110 bg-slate-50 p-1 flex items-center justify-center shadow-xs",
                    avatarUrl === preset.url
                      ? "border-[#1D7A6C] bg-teal-50 ring-2 ring-[#1D7A6C]/30"
                      : "border-slate-200 hover:border-[#1D7A6C] hover:bg-white"
                  )}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}

// ── View Mode Component ────────────────────────────────────────
function ProfileView({
  profile,
  family,
  onEdit,
}: {
  profile: any;
  family: FamilyMember[];
  onEdit: () => void;
}) {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("suraksha_user_avatar") || profile?.avatar_url || "";
    }
    return profile?.avatar_url || "";
  });

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
    if (typeof window !== "undefined") {
      if (url) localStorage.setItem("suraksha_user_avatar", url);
      else localStorage.removeItem("suraksha_user_avatar");
    }
  };

  const completion = calcCompletion(
    {
      fullName: profile?.full_name,
      age: profile?.age,
      gender: profile?.gender,
      occupation: profile?.occupation,
      annualIncome: profile?.annual_income,
    },
    family,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            Your insurance intelligence profile
          </p>
          <p className="text-xs font-hindi text-[#1D7A6C] font-medium">
            मेरी बीमा प्रोफाइल
          </p>
        </div>
        <Button
          onClick={onEdit}
          className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-2 shadow-xs text-sm font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Picture Card */}
      <ProfilePictureCard
        fullName={profile?.full_name}
        email={user?.email}
        avatarUrl={avatarUrl}
        onAvatarChange={handleAvatarChange}
      />

      {/* Completion Bar */}
      <Card className="p-5 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <p className="font-bold text-slate-900 text-sm">
            Profile Completion
          </p>
          <div className="flex items-center gap-2">
            {completion >= 80 ? (
              <CheckCircle className="w-4 h-4 text-[#1D7A6C]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
            <span
              className={cn(
                "font-mono font-bold text-sm",
                completion >= 80 ? "text-[#1D7A6C]" : "text-amber-600",
              )}
            >
              {completion}%
            </span>
          </div>
        </div>
        <Progress value={completion} className="h-2 rounded-full bg-slate-100" />
        <p className="text-xs text-slate-400 font-mono mt-2">
          {completion < 80
            ? "Complete your profile for better AI recommendations"
            : "Your profile is complete ✓"}
        </p>
      </Card>

      {/* Profile incomplete prompt */}
      {completion < 80 && (
        <Card className="p-4 border-amber-200 bg-amber-50 rounded-xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-amber-900 text-sm">
                  Your profile is incomplete
                </p>
                <p className="text-xs text-amber-700 font-hindi">
                  बेहतर सुझावों के लिए प्रोफाइल पूरी करें
                </p>
              </div>
            </div>
            <Button
              onClick={onEdit}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium"
            >
              Complete Profile
            </Button>
          </div>
        </Card>
      )}

      {/* Personal Info */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-none">
              Personal Information
            </h2>
            <p className="text-[11px] font-hindi text-[#1D7A6C] mt-0.5">
              व्यक्तिगत जानकारी
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          {[
            { label: "Full Name", value: profile?.full_name || "—" },
            {
              label: "Age",
              value: profile?.age ? `${profile.age} years` : "—",
            },
            { label: "Gender", value: profile?.gender || "—" },
            { label: "Language", value: profile?.preferred_language || "—" },
            { label: "Risk Appetite", value: profile?.risk_appetite || "—" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 uppercase mb-0.5">{item.label}</p>
              <p className="font-bold text-slate-900 text-xs sm:text-sm capitalize font-sans">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Info */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-none">
              Financial Details
            </h2>
            <p className="text-[11px] font-hindi text-[#1D7A6C] mt-0.5">वित्तीय जानकारी</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          {[
            { label: "Occupation", value: profile?.occupation || "—" },
            {
              label: "Annual Income",
              value: profile?.annual_income
                ? `₹${(profile.annual_income / 100000).toFixed(1)} Lakh`
                : "—",
            },
            {
              label: "Existing Policies",
              value:
                profile?.existing_policies?.length > 0
                  ? profile.existing_policies.join(", ")
                  : "None",
            },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <p className="text-[11px] text-slate-400 uppercase mb-0.5">{item.label}</p>
              <p className="font-bold text-slate-900 text-xs sm:text-sm font-sans">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Health Info */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-none">
              Health Information
            </h2>
            <p className="text-[11px] font-hindi text-[#1D7A6C] mt-0.5">
              स्वास्थ्य जानकारी
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile?.health_conditions?.length > 0 ? (
            profile.health_conditions.map((c: string) => (
              <Badge
                key={c}
                className="bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-xs"
              >
                {c}
              </Badge>
            ))
          ) : (
            <p className="text-slate-500 text-xs font-mono">
              No health conditions recorded
            </p>
          )}
        </div>
      </Card>

      {/* Family Members */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-none">
              Family Members
            </h2>
            <p className="text-[11px] font-hindi text-[#1D7A6C] mt-0.5">परिवार के सदस्य</p>
          </div>
        </div>
        {family.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-500 text-xs font-mono">No family members added</p>
            <p className="text-xs font-hindi text-[#1D7A6C] mt-0.5">
              कोई परिवार सदस्य नहीं जोड़ा गया
            </p>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="mt-3 rounded-lg border-slate-200 text-xs font-medium"
            >
              Add Family Members
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {family.map((member, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                  <Badge className="bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono capitalize text-[10px] uppercase">
                    {member.relation}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {member.gender} · {member.age} years
                </p>
                {member.health_conditions.length > 0 && (
                  <p className="text-xs text-slate-600 mt-1 font-mono">
                    Conditions: {member.health_conditions.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Edit Mode Component ────────────────────────────────────────
function ProfileEdit({
  profile,
  family: initialFamily,
  onSave,
  onCancel,
}: {
  profile: any;
  family: FamilyMember[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const { updateProfile } = useUserProfile();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [age, setAge] = useState<number | "">(profile?.age ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [occupation, setOccupation] = useState(profile?.occupation ?? "");
  const [annualIncome, setAnnualIncome] = useState<number | "">(
    profile?.annual_income ?? "",
  );
  const [riskAppetite, setRiskAppetite] = useState(
    profile?.risk_appetite ?? "medium",
  );
  const [preferredLang, setPreferredLang] = useState(
    profile?.preferred_language ?? "english",
  );
  const [healthConditions, setHealthConditions] = useState<string[]>(
    profile?.health_conditions ?? [],
  );
  const [existingPolicies, setExistingPolicies] = useState(
    (profile?.existing_policies ?? []).join(", "),
  );
  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>(initialFamily);

  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("suraksha_user_avatar") || profile?.avatar_url || "";
    }
    return profile?.avatar_url || "";
  });

  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
    if (typeof window !== "undefined") {
      if (url) localStorage.setItem("suraksha_user_avatar", url);
      else localStorage.removeItem("suraksha_user_avatar");
    }
  };

  const toggleHealth = (c: string) => {
    setHealthConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const addFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        name: "",
        relation: "spouse",
        age: "",
        gender: "male",
        health_conditions: [],
      },
    ]);
  };

  const updateMember = (i: number, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, ...updates } : m)),
    );
  };

  const removeMember = (i: number) => {
    setFamilyMembers((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const supabase = createClient();

        const isComplete = !!(
          fullName &&
          age &&
          gender &&
          occupation &&
          annualIncome
        );
        const policiesArr = existingPolicies
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);

        await updateProfile({
          full_name: fullName,
          age: age === "" ? null : Number(age),
          gender,
          occupation,
          annual_income: annualIncome === "" ? null : Number(annualIncome),
          risk_appetite: riskAppetite,
          preferred_language: preferredLang,
          health_conditions: healthConditions,
          existing_policies: policiesArr,
          is_profile_complete: isComplete,
        } as any);

        // Save family members
        if (user) {
          await supabase.from("family_members").delete().eq("user_id", user.id);
          const toInsert = familyMembers
            .filter((m) => m.name)
            .map((m) => ({
              user_id: user.id,
              name: m.name,
              relation: m.relation,
              age: m.age === "" ? null : Number(m.age),
              gender: m.gender,
              health_conditions: m.health_conditions,
            }));
          if (toInsert.length > 0) {
            await supabase.from("family_members").insert(toInsert);
          }
        }

        toast.success("Profile saved successfully! 🎉");
        onSave();
      } catch (err) {
        toast.error("Failed to save profile. Please try again.");
        console.error(err);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="text-slate-500 mt-0.5 text-sm">
            Update your insurance profile
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-lg text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-2 text-xs font-medium shadow-xs"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Profile Picture Card */}
      <ProfilePictureCard
        fullName={fullName}
        email={user?.email}
        avatarUrl={avatarUrl}
        onAvatarChange={handleAvatarChange}
      />

      {/* Personal Info */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <User className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            Personal Information
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Full Name
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Sharma"
              className="rounded-lg h-10 border-slate-200 text-sm focus:border-[#1D7A6C]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">Age</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="30"
              min={18}
              max={100}
              className="rounded-lg h-10 border-slate-200 text-sm focus:border-[#1D7A6C]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="rounded-lg h-10 border-slate-200 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Preferred Language
            </Label>
            <Select value={preferredLang} onValueChange={setPreferredLang}>
              <SelectTrigger className="rounded-lg h-10 border-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
                <SelectItem value="hinglish">Hinglish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Risk Appetite
            </Label>
            <Select value={riskAppetite} onValueChange={setRiskAppetite}>
              <SelectTrigger className="rounded-lg h-10 border-slate-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk 🛡️</SelectItem>
                <SelectItem value="medium">Medium Risk ⚖️</SelectItem>
                <SelectItem value="high">High Risk 🚀</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Financial Info */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            Financial Details
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Occupation
            </Label>
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Software Engineer"
              className="rounded-lg h-10 border-slate-200 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Annual Income (₹)
            </Label>
            <Input
              type="number"
              value={annualIncome}
              onChange={(e) =>
                setAnnualIncome(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="600000"
              className="rounded-lg h-10 border-slate-200 text-sm"
            />
            {annualIncome && (
              <p className="text-xs text-slate-400 font-mono">
                ≈ ₹{(Number(annualIncome) / 100000).toFixed(1)} Lakh/year
              </p>
            )}
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label className="text-xs font-bold text-slate-700">
              Existing Policies{" "}
              <span className="text-slate-400 font-normal">
                (comma separated)
              </span>
            </Label>
            <Input
              value={existingPolicies}
              onChange={(e) => setExistingPolicies(e.target.value)}
              placeholder="LIC Jeevan Anand, HDFC Ergo Health..."
              className="rounded-lg h-10 border-slate-200 text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Health Conditions */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            Health Information
          </h2>
        </div>
        <Label className="text-xs font-bold text-slate-700 mb-2.5 block">
          Pre-existing Conditions{" "}
          <span className="text-slate-400 font-normal">
            (select all that apply)
          </span>
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {HEALTH_CONDITIONS.map((condition) => {
            const selected = healthConditions.includes(condition);
            return (
              <button
                key={condition}
                type="button"
                onClick={() => toggleHealth(condition)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border",
                  selected
                    ? "bg-[#1D7A6C] text-white border-[#1D7A6C] font-bold"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-[#1D7A6C]",
                )}
              >
                {selected && "✓ "}
                {condition}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Family Members */}
      <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">Family Members</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFamilyMember}
            className="rounded-lg gap-1.5 border-slate-200 text-[#1D7A6C] hover:bg-teal-50 text-xs font-medium"
          >
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>

        {familyMembers.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500 font-mono">No family members added yet</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addFamilyMember}
              className="mt-3 rounded-lg gap-1.5 text-xs font-medium"
            >
              <Plus className="w-4 h-4" /> Add Family Member
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {familyMembers.map((member, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50"
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-[10px] uppercase">
                    Member {index + 1}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <Label className="text-xs text-slate-600">Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, { name: e.target.value })
                      }
                      placeholder="Name"
                      className="rounded-lg h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Relation</Label>
                    <Select
                      value={member.relation}
                      onValueChange={(v) =>
                        updateMember(index, { relation: v })
                      }
                    >
                      <SelectTrigger className="rounded-lg h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONS.map((r) => (
                          <SelectItem key={r} value={r} className="capitalize text-xs">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Age</Label>
                    <Input
                      type="number"
                      value={member.age}
                      onChange={(e) =>
                        updateMember(index, {
                          age: e.target.value ? Number(e.target.value) : "",
                        })
                      }
                      placeholder="Age"
                      min={0}
                      max={120}
                      className="rounded-lg h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Gender</Label>
                    <Select
                      value={member.gender}
                      onValueChange={(v) => updateMember(index, { gender: v })}
                    >
                      <SelectTrigger className="rounded-lg h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="text-xs">Male</SelectItem>
                        <SelectItem value="female" className="text-xs">Female</SelectItem>
                        <SelectItem value="other" className="text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-1.5 block">
                    Health Conditions
                  </Label>
                  <div className="flex flex-wrap gap-1">
                    {HEALTH_CONDITIONS.map((condition) => {
                      const selected =
                        member.health_conditions.includes(condition);
                      return (
                        <button
                          key={condition}
                          type="button"
                          onClick={() =>
                            updateMember(index, {
                              health_conditions: selected
                                ? member.health_conditions.filter(
                                    (c) => c !== condition,
                                  )
                                : [...member.health_conditions, condition],
                            })
                          }
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-mono transition-all border",
                            selected
                              ? "bg-[#1D7A6C] text-white border-[#1D7A6C] font-bold"
                              : "bg-white text-slate-600 border-slate-200 hover:border-[#1D7A6C]",
                          )}
                        >
                          {selected && "✓ "}
                          {condition}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Bottom Save Button */}
      <div className="flex justify-end gap-3 pb-8">
        <Button
          variant="outline"
          onClick={onCancel}
          className="rounded-lg px-6 text-xs font-medium border-slate-200 text-slate-700"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-2 shadow-xs px-8 text-xs font-medium"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyLoading, setFamilyLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("family_members")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setFamilyMembers(data);
        setFamilyLoading(false);
      });
  }, [user, isEditing]);

  const handleSaved = () => {
    setIsEditing(false);
  };

  if (loading || familyLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin" />
      </div>
    );
  }

  // If profile is completely empty, go directly to edit mode
  const isNewUser = !profile?.full_name && !profile?.age;

  if (isEditing || isNewUser) {
    return (
      <ProfileEdit
        profile={profile}
        family={familyMembers}
        onSave={handleSaved}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ProfileView
      profile={profile}
      family={familyMembers}
      onEdit={() => setIsEditing(true)}
    />
  );
}
