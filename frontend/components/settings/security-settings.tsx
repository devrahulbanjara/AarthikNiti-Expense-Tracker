"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

export function SecuritySettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleSavePassword = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsChangingPassword(false)
    }, 1500)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password or enable two-factor authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isChangingPassword ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                Change
              </Button>
            </div>
          )}
        </CardContent>
        {isChangingPassword && (
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePassword} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled
                  ? "Your account is protected with two-factor authentication"
                  : "Protect your account with two-factor authentication"}
              </p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                Two-factor authentication is enabled. You will be asked to enter a code from your authenticator app when
                you sign in.
              </p>
            </div>
          )}
        </CardContent>
        {twoFactorEnabled && (
          <CardFooter>
            <Button variant="outline" className="w-full">
              Configure Authenticator App
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Login Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications when someone logs into your account</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-medium">Suspicious Activity Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about unusual activity on your account</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full">
            Sign Out From All Devices
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

