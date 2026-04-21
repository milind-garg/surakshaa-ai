"use client";

import { useState, useEffect, useTransition } from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">My Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Your insurance intelligence profile
          </p>
          <p className="text-xs font-hindi text-gray-400 mt-0.5">
            मेरी बीमा प्रोफाइल
          </p>
        </div>
        <Button
          onClick={onEdit}
          className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 shadow-md"
        >
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Completion Bar */}
      <Card className="p-5 border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[#1E3A5F] text-sm">
            Profile Completion
          </p>
          <div className="flex items-center gap-2">
            {completion >= 80 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span
              className={cn(
                "font-bold text-sm",
                completion >= 80 ? "text-green-600" : "text-yellow-600",
              )}
            >
              {completion}%
            </span>
          </div>
        </div>
        <Progress value={completion} className="h-2.5 rounded-full" />
        <p className="text-xs text-gray-400 mt-2">
          {completion < 80
            ? "Complete your profile for better AI recommendations"
            : "Your profile is complete ✓"}
        </p>
      </Card>

      {/* Profile incomplete prompt */}
      {completion < 80 && (
        <Card className="p-5 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-semibold text-orange-800">
                  Your profile is incomplete
                </p>
                <p className="text-sm text-orange-600 font-hindi">
                  बेहतर सुझावों के लिए प्रोफाइल पूरी करें
                </p>
              </div>
            </div>
            <Button
              onClick={onEdit}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              Complete Profile
            </Button>
          </div>
        </Card>
      )}

      {/* Personal Info */}
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#1E3A5F] text-lg leading-none">
              Personal Information
            </h2>
            <p className="text-xs font-hindi text-gray-400">
              व्यक्तिगत जानकारी
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="font-semibold text-[#1E3A5F] text-sm capitalize">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Financial Info */}
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#1E3A5F] text-lg leading-none">
              Financial Details
            </h2>
            <p className="text-xs font-hindi text-gray-400">वित्तीय जानकारी</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="font-semibold text-[#1E3A5F] text-sm">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Health Info */}
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#1E3A5F] text-lg leading-none">
              Health Information
            </h2>
            <p className="text-xs font-hindi text-gray-400">
              स्वास्थ्य जानकारी
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile?.health_conditions?.length > 0 ? (
            profile.health_conditions.map((c: string) => (
              <Badge
                key={c}
                className="bg-blue-50 text-[#1E3A5F] border-blue-200"
              >
                {c}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No health conditions recorded
            </p>
          )}
        </div>
      </Card>

      {/* Family Members */}
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#1E3A5F] text-lg leading-none">
              Family Members
            </h2>
            <p className="text-xs font-hindi text-gray-400">परिवार के सदस्य</p>
          </div>
        </div>
        {family.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 text-sm">No family members added</p>
            <p className="text-xs font-hindi text-gray-400 mt-1">
              कोई परिवार सदस्य नहीं जोड़ा गया
            </p>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="mt-3 rounded-xl"
            >
              Add Family Members
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {family.map((member, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#1E3A5F]">{member.name}</p>
                  <Badge className="bg-blue-50 text-[#1E3A5F] border-blue-200 capitalize text-xs">
                    {member.relation}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {member.gender} · {member.age} years
                </p>
                {member.health_conditions.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
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
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Edit Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Update your insurance profile
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-xl"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2"
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

      {/* Personal Info */}
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-[#1E3A5F] text-lg">
            Personal Information
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Sharma"
              className="rounded-xl h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Age</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) =>
                setAge(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="30"
              min={18}
              max={100}
              className="rounded-xl h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Preferred Language
            </Label>
            <Select value={preferredLang} onValueChange={setPreferredLang}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी</SelectItem>
                <SelectItem value="hinglish">Hinglish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Risk Appetite
            </Label>
            <Select value={riskAppetite} onValueChange={setRiskAppetite}>
              <SelectTrigger className="rounded-xl h-11">
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
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-[#1E3A5F] text-lg">
            Financial Details
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Occupation
            </Label>
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Software Engineer"
              className="rounded-xl h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Annual Income (₹)
            </Label>
            <Input
              type="number"
              value={annualIncome}
              onChange={(e) =>
                setAnnualIncome(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="600000"
              className="rounded-xl h-11"
            />
            {annualIncome && (
              <p className="text-xs text-gray-400">
                ≈ ₹{(Number(annualIncome) / 100000).toFixed(1)} Lakh/year
              </p>
            )}
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Existing Policies{" "}
              <span className="text-gray-400 font-normal">
                (comma separated)
              </span>
            </Label>
            <Input
              value={existingPolicies}
              onChange={(e) => setExistingPolicies(e.target.value)}
              placeholder="LIC Jeevan Anand, HDFC Ergo Health..."
              className="rounded-xl h-11"
            />
          </div>
        </div>
      </Card>

      {/* Health Conditions */}
      <Card className="p-6 border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-[#1E3A5F] text-lg">
            Health Information
          </h2>
        </div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Pre-existing Conditions{" "}
          <span className="text-gray-400 font-normal">
            (select all that apply)
          </span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {HEALTH_CONDITIONS.map((condition) => {
            const selected = healthConditions.includes(condition);
            return (
              <button
                key={condition}
                type="button"
                onClick={() => toggleHealth(condition)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all",
                  selected
                    ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A5F]",
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
      <Card className="p-6 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-[#1E3A5F] text-lg">Family Members</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFamilyMember}
            className="rounded-xl gap-1.5 border-[#1E3A5F] text-[#1E3A5F] hover:bg-blue-50"
          >
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>

        {familyMembers.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-500">No family members added yet</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addFamilyMember}
              className="mt-3 rounded-xl gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Family Member
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {familyMembers.map((member, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-2xl p-4 space-y-4 bg-gray-50/50"
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#1E3A5F]/10 text-[#1E3A5F] border-0">
                    Member {index + 1}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <Label className="text-xs text-gray-600">Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) =>
                        updateMember(index, { name: e.target.value })
                      }
                      placeholder="Name"
                      className="rounded-lg h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Relation</Label>
                    <Select
                      value={member.relation}
                      onValueChange={(v) =>
                        updateMember(index, { relation: v })
                      }
                    >
                      <SelectTrigger className="rounded-lg h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONS.map((r) => (
                          <SelectItem key={r} value={r} className="capitalize">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Age</Label>
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
                      className="rounded-lg h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600">Gender</Label>
                    <Select
                      value={member.gender}
                      onValueChange={(v) => updateMember(index, { gender: v })}
                    >
                      <SelectTrigger className="rounded-lg h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-2 block">
                    Health Conditions
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
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
                            "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                            selected
                              ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A5F]",
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
          className="rounded-xl px-8"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          size="lg"
          className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 shadow-xl px-10"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
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
