'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  X,
  Users,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  UserPlus,
  MessageCircle,
  Share2
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  purpose: string;
}

interface InvitePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  goal: Goal | null;
  onPartnerInvited: () => void;
}

export default function InvitePartnerModal({ isOpen, onClose, userId, goal, onPartnerInvited }: InvitePartnerModalProps) {
  const [loading, setLoading] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email');
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/goals/join?goalId=${goal?.id}&userId=${userId}`;
    setInviteLink(link);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEmailInvite = async () => {
    if (!formData.email || !goal) return;

    setLoading(true);
    try {
      const response = await fetch('/api/goals/accountability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          goalId: goal.id,
          partnerEmail: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        onPartnerInvited();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error sending invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', message: '' });
    setInviteLink('');
    setCopied(false);
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/20 w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Invite Accountability Partner</h2>
              <p className="text-blue-200 text-sm">Get support for your goal</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Goal Info */}
            <Card className="bg-white/10 border-white/20 p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{goal.title}</h4>
                  <p className="text-blue-200 text-sm">{goal.purpose}</p>
                </div>
              </div>
            </Card>

            {/* Invite Method Selection */}
            <div>
              <label className="block text-white font-medium mb-3">How would you like to invite them?</label>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    inviteMethod === 'email'
                      ? 'bg-green-500/20 border-green-400 ring-2 ring-green-400/50'
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}
                  onClick={() => setInviteMethod('email')}
                >
                  <div className="text-center">
                    <Mail className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Email Invite</div>
                    <div className="text-blue-200 text-sm">Send direct invitation</div>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    inviteMethod === 'link'
                      ? 'bg-green-500/20 border-green-400 ring-2 ring-green-400/50'
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}
                  onClick={() => setInviteMethod('link')}
                >
                  <div className="text-center">
                    <Share2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-medium">Share Link</div>
                    <div className="text-blue-200 text-sm">Copy and share</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Email Invite Form */}
            {inviteMethod === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Partner's Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Personal Message (Optional)</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi! I'd love to have you as my accountability partner for this goal..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    rows={4}
                  />
                </div>

                <Card className="bg-blue-500/10 border-blue-400/20 p-4">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium mb-1">What happens next?</h4>
                      <ul className="text-blue-200 text-sm space-y-1">
                        <li>• They'll receive an email invitation</li>
                        <li>• They can accept or decline the partnership</li>
                        <li>• You'll both get progress updates</li>
                        <li>• You can support each other's journey</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={handleEmailInvite}
                  disabled={loading || !formData.email}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Invite...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Share Link */}
            {inviteMethod === 'link' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Invitation Link</label>
                  <div className="flex space-x-2">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Click Generate to create link"
                    />
                    <Button
                      onClick={generateInviteLink}
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                {inviteLink && (
                  <div className="space-y-3">
                    <Button
                      onClick={copyToClipboard}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>

                    <Card className="bg-blue-500/10 border-blue-400/20 p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-1">How to share</h4>
                          <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Share via text message, email, or social media</li>
                            <li>• They'll need to sign up if they don't have an account</li>
                            <li>• The link will automatically connect them to your goal</li>
                            <li>• You'll be notified when they accept</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            <Card className="bg-white/5 border-white/10 p-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-green-400" />
                Benefits of Having a Partner
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2 text-blue-200">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Increased motivation</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Regular check-ins</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Shared progress</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Mutual support</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
