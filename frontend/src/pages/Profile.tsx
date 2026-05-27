import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '../services/api';
import { toast } from 'sonner';

// Placeholder for a simple Tabs component if not directly available
const Tabs = ({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div>
      <div className="flex border-b">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any).displayName === 'TabsList') {
            return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
          }
          return null;
        })}
      </div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'TabsContent') {
          if (child.props.value === activeTab) {
            return child;
          }
        }
        return null;
      })}
    </div>
  );
};

const TabsList = ({ activeTab, setActiveTab, children }: { activeTab: string; setActiveTab: (tab: string) => void; children: React.ReactNode }) => {
  return (
    <div className="flex space-x-4">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'TabsTrigger') {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        return null;
      })}
    </div>
  );
};
TabsList.displayName = 'TabsList';

const TabsTrigger = ({ value, children, activeTab, setActiveTab }: { value: string; children: React.ReactNode; activeTab: string; setActiveTab: (tab: string) => void }) => {
  return (
    <button
      className={`py-2 px-4 text-sm font-medium ${activeTab === value ? 'border-b-2 border-amber-700 text-amber-700' : 'text-stone-600 hover:text-stone-900'}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return <div className="py-4">{children}</div>;
};
TabsContent.displayName = 'TabsContent';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    },
  });

  const [personalInfo, setPersonalInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  const [address, setAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    smsNotifications: true,
  });

  useEffect(() => {
    if (userProfile) {
      setPersonalInfo({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
      setAddress({
        address: userProfile.address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        postalCode: userProfile.postalCode || '',
        country: userProfile.country || '',
      });
      // Assuming preferences are also part of userProfile or default
      // setPreferences({ ...userProfile.preferences });
    }
  }, [userProfile]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences({ ...preferences, [key]: checked });
    // In a real app, this would trigger a mutation to update user preferences
    toast.info(`Preference for ${key} set to ${checked}`);
  };

  const handleSubmitPersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(personalInfo);
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(address);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-serif uppercase tracking-widest text-zinc-400">{t('global.loadingProfile')}</div>;
  }

  if (isError) {
    return <div>Error loading profile: {error?.message}</div>;
  }

  return (
    <div className="bg-white min-h-screen pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-serif text-black text-center mb-16 uppercase tracking-widest">
          {t('profile.personalInfo')}
        </h1>

      <Tabs defaultValue="personalInfo" className="w-full">
        <TabsList>
          <TabsTrigger value="personalInfo">{t('profile.personalInfo')}</TabsTrigger>
          <TabsTrigger value="addresses">{t('profile.addresses')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('profile.preferences')}</TabsTrigger>
        </TabsList>
        <TabsContent value="personalInfo">
          <Card className="p-6">
            <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('profile.personalInfo')}</h2>
            <form onSubmit={handleSubmitPersonalInfo} className="space-y-4">
              <div>
                <Label htmlFor="full_name">{t('checkout.fullName')}</Label>
                <Input id="full_name" name="full_name" value={personalInfo.full_name} onChange={handlePersonalInfoChange} />
              </div>
              <div>
                <Label htmlFor="email">{t('checkout.email')}</Label>
                <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} />
              </div>
              <div>
                <Label htmlFor="phone">{t('checkout.phone')}</Label>
                <Input id="phone" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
              </div>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? 'Saving...' : t('profile.saveChanges')}
              </Button>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="addresses">
          <Card className="p-6">
            <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('profile.addresses')}</h2>
            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div>
                <Label htmlFor="address">{t('checkout.address')}</Label>
                <Input id="address" name="address" value={address.address} onChange={handleAddressChange} />
              </div>
              <div>
                <Label htmlFor="city">{t('checkout.city')}</Label>
                <Input id="city" name="city" value={address.city} onChange={handleAddressChange} />
              </div>
              <div>
                <Label htmlFor="state">{t('checkout.state')}</Label>
                <Input id="state" name="state" value={address.state} onChange={handleAddressChange} />
              </div>
              <div>
                <Label htmlFor="postalCode">{t('checkout.postalCode')}</Label>
                <Input id="postalCode" name="postalCode" value={address.postalCode} onChange={handleAddressChange} />
              </div>
              <div>
                <Label htmlFor="country">{t('checkout.country')}</Label>
                <Input id="country" name="country" value={address.country} onChange={handleAddressChange} />
              </div>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? 'Saving...' : t('profile.saveAddress')}
              </Button>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card className="p-6">
            <h2 className="text-3xl font-serif text-stone-900 mb-6">{t('profile.preferences')}</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked: boolean) => handlePreferenceChange('emailNotifications', checked)}
                />
                <Label htmlFor="emailNotifications">{t('profile.emailNotifications')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketingEmails"
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked: boolean) => handlePreferenceChange('marketingEmails', checked)}
                />
                <Label htmlFor="marketingEmails">{t('profile.marketingEmails')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smsNotifications"
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked: boolean) => handlePreferenceChange('smsNotifications', checked)}
                />
                <Label htmlFor="smsNotifications">{t('profile.smsNotifications')}</Label>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Profile;