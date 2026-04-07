import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "react-i18next";

export function Register() {
  const [username, setUsername] = useState(""); // أضفنا حقل الاسم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("reader");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth(); // استدعينا دالة التسجيل بدلاً من الدخول
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // نرسل البيانات كاملة (الاسم، الإيميل، الباسورد، النوع)
      if (register) {
        await register({ username, email, password, role });
      }
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('auth.register')}</CardTitle>
          <CardDescription>
            Create a new account to start reading or writing.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && <div className="text-destructive text-sm font-bold">{error}</div>}
            
            {/* حقل اسم المستخدم الجديد */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username (اسم المستخدم)</Label>
              <Input
                id="username"
                type="text"
                placeholder="Faisal..."
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t('auth.role')}:</Label>
              <RadioGroup defaultValue="reader" onValueChange={(v) => setRole(v as UserRole)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reader" id="reader" />
                  <Label htmlFor="reader">{t('auth.reader')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="writer" id="writer" />
                  <Label htmlFor="writer">{t('auth.writer')}</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.createAccount')}
            </Button>
            <div className="text-center text-sm">
              {t('auth.haveAccount')}{" "}
              <Link to="/login" className="underline">
                {t('auth.login')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}