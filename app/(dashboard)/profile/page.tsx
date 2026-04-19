"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  User, Briefcase, Heart, Shield, Save,
  Plus, Trash2, CheckCircle, AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
interface FamilyMember {
  id?: string;
  name: string;
  relation: string;
  age: number | "";
  gender: string;
  health_conditions: string[];
}

const HEALTH_CONDITIONS = [
  "Diabetes", "Hypertension", "Heart Disease", "Asthma",
  "Cancer", "Kidney Disease", "Thyroid", "Obesity", "None",
];

const RELATIONS = ["spouse", "child", "parent", "sibling", "other"];

// ── Profile Completion Calculator ──────────────────────────────────────────
function calcCompletion(profile: any, family: FamilyMember[]): number {
  const fields = [
    profile.full_name, profile.age, profile.gender,
    profile.occupation, profile.annual_income,
    profile.risk_appetite, profile.preferred_language,
  ];
  const filled = fields.filter(Boolean).length;
  const familyBonus = family.length > 0 ? 1 : 0;
  return Math.round(((filled + familyBonus) / (fields.length + 1)) * 100);
}

// ── Section Header Component ───────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  titleHindi,
}: {
  icon: React.ElementType;
  title: string;
  titleHindi: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h2 className="font-bold text-[#1E3A5F] dark:text-white text-lg leading-none">
          {title}
        </h2>
        <p className="text-xs font-hindi text-gray-400 mt-0.5">{titleHindi}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [annualIncome, setAnnualIncome] = useState<number | "">("");
  const [riskAppetite, setRiskAppetite] = useState("medium");
  const [preferredLanguage, setPreferredLanguage] = useState("english");
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [existingPolicies, setExistingPolicies] = useState<string>("");

  // Family members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Load profile into form
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setAge(profile.age ?? "");
    setGender(profile.gender ?? "");
    setOccupation(profile.occupation ?? "");
    setAnnualIncome(profile.annual_income ?? "");
    setRiskAppetite(profile.risk_appetite ?? "medium");
    setPreferredLanguage(profile.preferred_language ?? "english");
    setHealthConditions(profile.health_conditions ?? []);
    setExistingPolicies((profile.existing_policies ?? []).join(", "));
  }, [profile]);

  // Load family members
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("family_members")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }: { data: FamilyMember[] | null }) => {
        if (data) setFamilyMembers(data);
      });
  }, [user]);

  const completion = calcCompletion(
    { fullName, age, gender, occupation, annualIncome, riskAppetite, preferredLanguage },
    familyMembers
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggleHealthCondition = (condition: string) => {
    setHealthConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const addFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      { name: "", relation: "spouse", age: "", gender: "male", health_conditions: [] },
    ]);
  };

  const updateFamilyMember = (index: number, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...updates } : m))
    );
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        const existingPoliciesArr = existingPolicies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const isComplete =
          !!fullName && !!age && !!gender && !!occupation && !!annualIncome;

        const result = await updateProfile({
          full_name: fullName,
          age: age === "" ? null : Number(age),
          gender,
          occupation,
          annual_income: annualIncome === "" ? null : Number(annualIncome),
          risk_appetite: riskAppetite,
          preferred_language: preferredLanguage,
          health_conditions: healthConditions,
          existing_policies: existingPoliciesArr,
          is_profile_complete: isComplete,
        } as any);

        // Save family members
        if (user) {
          const { createClient } = require("@/lib/supabase/client");
          const supabase = createClient();

          // Delete all existing family members then re-insert
          await supabase
            .from("family_members")
            .delete()
            .eq("user_id", user.id);

          if (familyMembers.length > 0) {
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
        }

        if (result?.error) {
          toast.error("Failed to save profile. Please try again.");
        } else {
          toast.success("Profile saved successfully! 🎉");
        }
      } catch (err) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-[#1E3A5F]/20 border-t-[#1E3A5F] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Your profile helps the AI give better insurance recommendations
          </p>
          <p className="text-xs font-hindi text-gray-400 mt-0.5">
            प्रोफाइल से AI बेहतर सुझाव देता है
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 shadow-md"
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

      {/* Profile Completion Bar */}
      <Card className="p-5 border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[#1E3A5F] dark:text-white text-sm">
            Profile Completion
          </p>
          <div className="flex items-center gap-2">
            {completion >= 80 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className={cn(
              "font-bold text-sm",
              completion >= 80 ? "text-green-600" : "text-yellow-600"
            )}>
              {completion}%
            </span>
          </div>
        </div>
        <Progress value={completion} className="h-2.5 rounded-full" />
        <p className="text-xs text-gray-400 mt-2">
          {completion < 80
            ? "Complete your profile for personalized AI recommendations"
            : "Great! Your profile is ready for AI recommendations ✓"}
        </p>
      </Card>

      {/* ── SECTION 1: Personal Info ── */}
      <Card className="p-6 border-gray-100 dark:border-gray-800">
        <SectionHeader
          icon={User}
          title="Personal Information"
          titleHindi="व्यक्तिगत जानकारी"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Sharma"
              className="rounded-xl border-gray-200 dark:border-gray-700 h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Age
            </Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
              placeholder="32"
              min={18}
              max={100}
              className="rounded-xl border-gray-200 dark:border-gray-700 h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 h-11">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Language
            </Label>
            <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
              <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="hinglish">Hinglish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="rounded-xl border-gray-200 dark:border-gray-700 h-11 bg-gray-50 dark:bg-gray-800 text-gray-500"
            />
          </div>
        </div>
      </Card>

      {/* ── SECTION 2: Financial Info ── */}
      <Card className="p-6 border-gray-100 dark:border-gray-800">
        <SectionHeader
          icon={Briefcase}
          title="Financial & Professional Details"
          titleHindi="वित्तीय और पेशेवर जानकारी"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Occupation
            </Label>
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Software Engineer"
              className="rounded-xl border-gray-200 dark:border-gray-700 h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Annual Income (₹)
            </Label>
            <Input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : "")}
              placeholder="600000"
              className="rounded-xl border-gray-200 dark:border-gray-700 h-11"
            />
            {annualIncome && (
              <p className="text-xs text-gray-400">
                ≈ ₹{(Number(annualIncome) / 100000).toFixed(1)} Lakh per year
              </p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Risk Appetite
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "low", label: "Low Risk", desc: "Prefer safe, stable coverage", emoji: "🛡️" },
                { value: "medium", label: "Medium Risk", desc: "Balanced approach", emoji: "⚖️" },
                { value: "high", label: "High Risk", desc: "Willing to take more risk for returns", emoji: "🚀" },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setRiskAppetite(option.value)}
                  className={cn(
                    "p-3 rounded-xl border-2 cursor-pointer transition-all text-center",
                    riskAppetite === option.value
                      ? "border-[#1E3A5F] bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <p className="text-xs font-semibold text-[#1E3A5F] dark:text-white">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block">
                    {option.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Existing Insurance Policies{" "}
              <span className="text-gray-400 font-normal">(comma separated)</span>
            </Label>
            <Textarea
              value={existingPolicies}
              onChange={(e) => setExistingPolicies(e.target.value)}
              placeholder="LIC Jeevan Anand, HDFC Ergo Health Optima, ..."
              className="rounded-xl border-gray-200 dark:border-gray-700 resize-none"
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* ── SECTION 3: Health ── */}
      <Card className="p-6 border-gray-100 dark:border-gray-800">
        <SectionHeader
          icon={Heart}
          title="Health Information"
          titleHindi="स्वास्थ्य जानकारी"
        />
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pre-existing Health Conditions{" "}
            <span className="text-gray-400 font-normal">(select all that apply)</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {HEALTH_CONDITIONS.map((condition) => {
              const selected = healthConditions.includes(condition);
              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleHealthCondition(condition)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all",
                    selected
                      ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#1E3A5F]"
                  )}
                >
                  {selected && "✓ "}
                  {condition}
                </button>
              );
            })}
          </div>
          {healthConditions.length > 0 && (
            <p className="text-xs text-gray-500">
              Selected: {healthConditions.join(", ")}
            </p>
          )}
        </div>
      </Card>

      {/* ── SECTION 4: Family Members ── */}
      <Card className="p-6 border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader
            icon={Shield}
            title="Family Members"
            titleHindi="परिवार के सदस्य"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFamilyMember}
            className="rounded-xl gap-1.5 border-[#1E3A5F] text-[#1E3A5F] hover:bg-blue-50 shrink-0 -mt-6"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </div>

        {familyMembers.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              No family members added yet
            </p>
            <p className="text-xs font-hindi text-gray-400 mb-3">
              परिवार जोड़ें बेहतर सुझावों के लिए
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addFamilyMember}
              className="rounded-xl gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Family Member
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {familyMembers.map((member, index) => (
              <div
                key={index}
                className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/30"
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#1E3A5F]/10 text-[#1E3A5F] dark:text-blue-300 border-0">
                    Member {index + 1}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2 sm:col-span-1 space-y-1">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateFamilyMember(index, { name: e.target.value })}
                      placeholder="Name"
                      className="rounded-lg h-9 text-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Relation</Label>
                    <Select
                      value={member.relation}
                      onValueChange={(v) => updateFamilyMember(index, { relation: v })}
                    >
                      <SelectTrigger className="rounded-lg h-9 text-sm border-gray-200 dark:border-gray-700">
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
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Age</Label>
                    <Input
                      type="number"
                      value={member.age}
                      onChange={(e) =>
                        updateFamilyMember(index, {
                          age: e.target.value ? Number(e.target.value) : "",
                        })
                      }
                      placeholder="Age"
                      min={0}
                      max={120}
                      className="rounded-lg h-9 text-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Gender</Label>
                    <Select
                      value={member.gender}
                      onValueChange={(v) => updateFamilyMember(index, { gender: v })}
                    >
                      <SelectTrigger className="rounded-lg h-9 text-sm border-gray-200 dark:border-gray-700">
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

                {/* Family member health conditions */}
                <div>
                  <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                    Health Conditions
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {HEALTH_CONDITIONS.map((condition) => {
                      const selected = member.health_conditions.includes(condition);
                      return (
                        <button
                          key={condition}
                          type="button"
                          onClick={() =>
                            updateFamilyMember(index, {
                              health_conditions: selected
                                ? member.health_conditions.filter((c) => c !== condition)
                                : [...member.health_conditions, condition],
                            })
                          }
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                            selected
                              ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#1E3A5F]"
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

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pb-8">
        <Button
          onClick={handleSave}
          disabled={isPending}
          size="lg"
          className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 shadow-xl px-10"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving Profile...
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