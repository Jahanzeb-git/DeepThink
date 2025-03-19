import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

interface BehavioralSettings {
  system_prompt: string;
  temperature: number;
  top_p: number;
  what_we_call_you: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<BehavioralSettings>({
    system_prompt: '',
    temperature: 0.7,
    top_p: 0.9,
    what_we_call_you: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const storedSettings = localStorage.getItem('behavioralSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/user/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();
      if (data.settings && Object.keys(data.settings).length > 0) {
        setSettings(data.settings);
        localStorage.setItem('behavioralSettings', JSON.stringify(data.settings));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) throw new Error('User email not found');

      const response = await fetch('https://jahanzebahmed25.pythonanywhere.com/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          ...settings
        })
      });

      const data = await response.json();
      setSaveMessage(data.message);
      localStorage.setItem('behavioralSettings', JSON.stringify(settings));

      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white dark:text-gray-900">Behavioral Control</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400 dark:text-gray-600">What should we call you?</label>
          <input
            type="text"
            value={settings.what_we_call_you}
            onChange={(e) => setSettings({ ...settings, what_we_call_you: e.target.value })}
            className="w-full bg-gray-800/50 dark:bg-gray-200/50 text-white dark:text-gray-900 px-4 py-3 rounded-xl
                     border border-gray-700/50 dark:border-gray-300/50 focus:border-blue-500/50 transition-colors"
            placeholder="Enter your preferred name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400 dark:text-gray-600">System Prompt</label>
          <textarea
            value={settings.system_prompt}
            onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
            maxLength={100}
            rows={3}
            className="w-full bg-gray-800/50 dark:bg-gray-200/50 text-white dark:text-gray-900 px-4 py-3 rounded-xl
                     border border-gray-700/50 dark:border-gray-300/50 focus:border-blue-500/50 transition-colors
                     resize-none"
            placeholder="Enter system prompt (max 100 words)"
          />
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {settings.system_prompt.length}/100 characters
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400 dark:text-gray-600">
            Temperature: {settings.temperature.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700/50 dark:bg-gray-300/50 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400 dark:text-gray-600">
            Top P: {settings.top_p.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.top_p}
            onChange={(e) => setSettings({ ...settings, top_p: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700/50 dark:bg-gray-300/50 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        <div className="relative">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl 
                     bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors
                     border border-blue-500/20 hover:border-blue-500/30"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
          {saveMessage && (
            <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-green-400">
              {saveMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
