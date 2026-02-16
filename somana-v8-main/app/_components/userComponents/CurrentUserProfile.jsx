"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Music,
  Users,
  Play,
  CheckCircle,
  Instagram,
  Youtube,
  Sparkles,
  Award,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import AvatarUploadModal from "./AvatarUploadModal";
import "./creator-profile.css";

const fetchUserData = async (userId) => {
  const res = await axios.get(`/api/v1/users/${userId}`);
  return res.data.data;
};

const fetchUserStats = async (userId) => {
  const res = await axios.get(`/api/v1/users/${userId}/stats`);
  return res.data.data;
};

const CurrentUserProfile = ({ session }) => {
  const userId = session.user.userId;

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: (userData) =>
      axios.patch(`/api/v1/users/${userId}`, userData, {
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      toast.success("Profile updated successfully! 🎉");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    photo: "",
    mobileNumber: "",
    bio: "",
    status: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    occupation: "",
    qualification: "",
    studiedFrom: "",
    nickname: "",
    maritalStatus: "",
    company: "",
    subscription: false,
    dob: "",
    accountType: "",
    userName: "",
    instagram: "",
    youtube: "",
    spotify: "",
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showActivity: true,
  });

  // Dynamic stats from API with count-up animation
  const [stats, setStats] = useState({
    tracksUploaded: 0,
    followers: 0,
    totalPlays: 0,
  });

  const [xpProgress, setXpProgress] = useState({
    level: 1,
    currentXP: 0,
    maxXP: 500,
  });

  // Count-up animation helper
  const animateCount = (start, end, duration, callback) => {
    const startTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      callback(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Update stats when data is fetched
  useEffect(() => {
    if (statsData) {
      // Animate counts
      animateCount(0, statsData.tracksCount || 0, 1000, (val) => {
        setStats((prev) => ({ ...prev, tracksUploaded: val }));
      });
      animateCount(0, statsData.followersCount || 0, 1200, (val) => {
        setStats((prev) => ({ ...prev, followers: val }));
      });
      animateCount(0, statsData.totalPlays || 0, 1400, (val) => {
        setStats((prev) => ({ ...prev, totalPlays: val }));
      });
      
      // Update XP progress
      setXpProgress({
        level: statsData.level || 1,
        currentXP: statsData.xp || 0,
        maxXP: 500,
      });
    }
  }, [statsData]);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        photo: user.photo ?? "",
        mobileNumber: user.mobileNumber ?? "",
        bio: user.bio ?? "",
        status: user.status ?? "",
        gender: user.gender ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        country: user.country ?? "",
        occupation: user.occupation ?? "",
        qualification: user.qualification ?? "",
        studiedFrom: user.studiedFrom ?? "",
        nickname: user.nickname ?? "",
        maritalStatus: user.maritalStatus ?? "",
        company: user.company ?? "",
        subscription: user.subscription ?? false,
        dob: user.dob ?? "",
        accountType: user.accountType ?? "",
        userName: user.userName ?? "",
        instagram: user.instagram ?? "",
        youtube: user.youtube ?? "",
        spotify: user.spotify ?? "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(userProfile);
  };

  const handleCancel = () => {
    if (user) {
      setUserProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        photo: user.photo ?? "",
        mobileNumber: user.mobileNumber ?? "",
        bio: user.bio ?? "",
        status: user.status ?? "",
        gender: user.gender ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        country: user.country ?? "",
        occupation: user.occupation ?? "",
        qualification: user.qualification ?? "",
        studiedFrom: user.studiedFrom ?? "",
        nickname: user.nickname ?? "",
        maritalStatus: user.maritalStatus ?? "",
        company: user.company ?? "",
        subscription: user.subscription ?? false,
        dob: user.dob ?? "",
        accountType: user.accountType ?? "",
        userName: user.userName ?? "",
        instagram: user.instagram ?? "",
        youtube: user.youtube ?? "",
        spotify: user.spotify ?? "",
      });
      toast.info("Changes discarded");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      toast.success("Logged out successfully! 👋");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong");
    }
  };

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUserProfile((prev) => ({ ...prev, photo: newAvatarUrl }));
  };

  // Calculate profile completion (use API value if available, otherwise calculate locally)
  const calculateCompletion = () => {
    // If we have API data, use it
    if (statsData && statsData.profileCompletion !== undefined) {
      return statsData.profileCompletion;
    }
    
    // Fallback to local calculation
    const fields = [
      userProfile.name,
      userProfile.bio,
      userProfile.mobileNumber,
      userProfile.city,
      userProfile.state,
      userProfile.country,
      userProfile.occupation,
      userProfile.dob,
    ];
    const filledFields = fields.filter((field) => field && field.trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();
  const xpPercentage = (xpProgress.currentXP / xpProgress.maxXP) * 100;

  if (isLoading) {
    return (
      <div className="creator-profile-page">
        <div className="profile-container">
          <div className="section-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div className="loading-spinner" style={{ margin: "0 auto 1rem" }}></div>
            <p style={{ color: "var(--text-secondary)" }}>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="creator-profile-page">
        <div className="profile-container">
          <div className="section-card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#ef4444", fontSize: "1.2rem", marginBottom: "1rem" }}>
              ⚠️ Error loading profile
            </p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Unable to fetch your profile data. Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ margin: "0 auto" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="creator-profile-page">
      {/* Animated Background Blobs */}
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          {/* Profile Header */}
          <div className="profile-header">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div 
                className="avatar-wrapper"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                <div className="avatar-glow-ring"></div>
                {userProfile.photo ? (
                  <img
                    src={userProfile.photo}
                    alt={userProfile.name}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="avatar-overlay">Change Photo</div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              <h1 className="profile-name">
                {userProfile.name || "Your Name"}
                {userProfile.subscription && (
                  <CheckCircle className="verification-badge" />
                )}
              </h1>
              <p className="profile-username">@{userProfile.userName || "username"}</p>
              <div className="badges-row">
                <span
                  className={`subscription-badge ${
                    userProfile.subscription ? "badge-pro" : "badge-free"
                  }`}
                >
                  <Sparkles size={16} />
                  {userProfile.subscription ? "Pro" : "Free"}
                </span>
              </div>
            </div>

            {/* XP Progress Section */}
            <div className="xp-section">
              <div className="level-badge">
                <Award size={18} />
                Level {xpProgress.level}
              </div>
              <div className="xp-progress-container">
                <div className="xp-label">
                  <span>XP Progress</span>
                  <span>
                    {xpProgress.currentXP} / {xpProgress.maxXP} XP
                  </span>
                </div>
                <div className="xp-bar-bg">
                  <div
                    className="xp-bar-fill"
                    style={{ width: `${xpPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="completion-card">
                <div className="completion-circle">
                  <svg className="completion-svg" width="60" height="60">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <circle
                      className="completion-bg"
                      cx="30"
                      cy="30"
                      r="26"
                    />
                    <circle
                      className="completion-progress"
                      cx="30"
                      cy="30"
                      r="26"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 26 * (1 - completionPercentage / 100)
                      }`}
                    />
                  </svg>
                  <div className="completion-text">{completionPercentage}%</div>
                </div>
                <div className="completion-info">
                  <h4>Profile Completion</h4>
                  <p>Complete your profile to unlock creator features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Music size={24} />
              </div>
              {statsLoading ? (
                <>
                  <div className="skeleton-stat-value"></div>
                  <p className="stat-label">Tracks Uploaded</p>
                </>
              ) : (
                <>
                  <h3 className="stat-value">{stats.tracksUploaded}</h3>
                  <p className="stat-label">Tracks Uploaded</p>
                </>
              )}
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              {statsLoading ? (
                <>
                  <div className="skeleton-stat-value"></div>
                  <p className="stat-label">Followers</p>
                </>
              ) : (
                <>
                  <h3 className="stat-value">{stats.followers.toLocaleString()}</h3>
                  <p className="stat-label">Followers</p>
                </>
              )}
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Play size={24} />
              </div>
              {statsLoading ? (
                <>
                  <div className="skeleton-stat-value"></div>
                  <p className="stat-label">Total Plays</p>
                </>
              ) : (
                <>
                  <h3 className="stat-value">{stats.totalPlays.toLocaleString()}</h3>
                  <p className="stat-label">Total Plays</p>
                </>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="section-card">
            <h2 className="section-title">About</h2>
            <textarea
              name="bio"
              value={userProfile.bio}
              onChange={handleInputChange}
              className="premium-textarea"
              placeholder="Tell us about yourself..."
              maxLength={300}
            />
            <div className="char-counter">
              {userProfile.bio.length} / 300 characters
            </div>
          </div>

          {/* Personal Information */}
          <div className="section-card">
            <h2 className="section-title">Personal Information</h2>
            <div className="form-grid">
              {/* Row 1 */}
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={userProfile.mobileNumber}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={userProfile.status}
                  onChange={handleInputChange}
                  className="premium-input"
                >
                  <option value="">Select Status</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="do_not_disturb">Do Not Disturb</option>
                  <option value="brb">Be Right Back</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={userProfile.gender}
                  onChange={handleInputChange}
                  className="premium-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={userProfile.city}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={userProfile.state}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter state"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  value={userProfile.country}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter country"
                />
              </div>

              {/* Row 3 */}
              <div className="form-group">
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={userProfile.occupation}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter occupation"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={userProfile.qualification}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter qualification"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Studied From</label>
                <input
                  type="text"
                  name="studiedFrom"
                  value={userProfile.studiedFrom}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter institution"
                />
              </div>

              {/* Row 4 */}
              <div className="form-group">
                <label className="form-label">Nickname</label>
                <input
                  type="text"
                  name="nickname"
                  value={userProfile.nickname}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter nickname"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={userProfile.maritalStatus}
                  onChange={handleInputChange}
                  className="premium-input"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="relationship">In a Relationship</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Company / Work</label>
                <input
                  type="text"
                  name="company"
                  value={userProfile.company}
                  onChange={handleInputChange}
                  className="premium-input"
                  placeholder="Enter company"
                />
              </div>

              {/* Row 5 */}
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={userProfile.dob}
                  onChange={handleInputChange}
                  className="premium-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select
                  name="accountType"
                  value={userProfile.accountType}
                  onChange={handleInputChange}
                  className="premium-input"
                >
                  <option value="">Select Type</option>
                  <option value="Personal">Personal</option>
                  <option value="Organization">Organization</option>
                </select>
              </div>

              <div className="form-group">
                {/* Empty for layout balance */}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="section-card">
            <h2 className="section-title">Social Links</h2>
            
            <div className="social-input-group">
              <div className="social-icon">
                <Instagram size={20} />
              </div>
              <input
                type="url"
                name="instagram"
                value={userProfile.instagram}
                onChange={handleInputChange}
                className="premium-input social-input"
                placeholder="Instagram profile URL"
              />
              {userProfile.instagram && (
                <span className="connected-badge">
                  <ExternalLink size={14} /> Connected
                </span>
              )}
            </div>

            <div className="social-input-group">
              <div className="social-icon">
                <Youtube size={20} />
              </div>
              <input
                type="url"
                name="youtube"
                value={userProfile.youtube}
                onChange={handleInputChange}
                className="premium-input social-input"
                placeholder="YouTube channel URL"
              />
              {userProfile.youtube && (
                <span className="connected-badge">
                  <ExternalLink size={14} /> Connected
                </span>
              )}
            </div>

            <div className="social-input-group">
              <div className="social-icon">
                <Music size={20} />
              </div>
              <input
                type="url"
                name="spotify"
                value={userProfile.spotify}
                onChange={handleInputChange}
                className="premium-input social-input"
                placeholder="Spotify artist URL"
              />
              {userProfile.spotify && (
                <span className="connected-badge">
                  <ExternalLink size={14} /> Connected
                </span>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="section-card">
            <h2 className="section-title">Privacy Settings</h2>

            <div className="privacy-item">
              <div>
                <div className="privacy-label">Show email publicly</div>
                <div className="privacy-description">
                  Allow others to see your email address
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={privacySettings.showEmail}
                  onChange={() => handlePrivacyToggle("showEmail")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="privacy-item">
              <div>
                <div className="privacy-label">Show phone number publicly</div>
                <div className="privacy-description">
                  Allow others to see your phone number
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={privacySettings.showPhone}
                  onChange={() => handlePrivacyToggle("showPhone")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="privacy-item">
              <div>
                <div className="privacy-label">Allow followers to message</div>
                <div className="privacy-description">
                  Let your followers send you direct messages
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={privacySettings.allowMessages}
                  onChange={() => handlePrivacyToggle("allowMessages")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="privacy-item">
              <div>
                <div className="privacy-label">Show activity status</div>
                <div className="privacy-description">
                  Display when you're online or active
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={privacySettings.showActivity}
                  onChange={() => handlePrivacyToggle("showActivity")}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Logout Section */}
          <div className="section-card mt-8 border-none bg-transparent !p-0">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </form>
      </div>

      {/* Sticky Action Bar */}
      <div className="action-bar">
        <div className="action-bar-content">
          <button
            type="button"
            className="btn-ghost"
            onClick={handleCancel}
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="loading-spinner"></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={userProfile.photo}
        userId={userId}
        onSuccess={handleAvatarUpdate}
      />
    </div>
  );
};

export default CurrentUserProfile;
