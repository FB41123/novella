import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Bell, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6 max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold mb-6">{t('settings.title')}</h1>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.language')}
          </CardTitle>
          <CardDescription>Select your preferred language.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={language === 'ar' ? 'default' : 'outline'}
              onClick={() => changeLanguage('ar')}
            >
              العربية
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => changeLanguage('en')}
            >
              English
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            {t('settings.theme')}
          </CardTitle>
          <CardDescription>Customize the look and feel.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue={theme} onValueChange={(v) => setTheme(v as any)} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">{t('settings.lightMode')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">{t('settings.darkMode')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notifications (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications')}
          </CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Push Notifications</Label>
              <Button variant="outline" size="sm">Disabled</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control who can see your profile and activity.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between">
              <Label>Profile Visibility</Label>
              <Button variant="outline" size="sm">Public</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
