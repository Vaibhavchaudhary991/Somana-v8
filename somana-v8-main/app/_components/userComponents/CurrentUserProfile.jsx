"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fetchUserData = async (userId) => {
  const res = await axios.get(`/api/v1/users/${userId}`);
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

  const mutation = useMutation({
    mutationFn: (userData) =>
      axios.patch(`/api/v1/users/${userId}`, userData, {
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => console.log("Updated successfully"),
    onError: () => console.error("Update failed"),
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
  });

  useEffect(() => {
    if (user) setUserProfile(user);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(userProfile);
  };

  if (isError) return <div>Error loading user profile</div>;

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 text-sm w-full"
      >
        <div className="flex items-center gap-6">
          <img
            src={userProfile.photo}
            alt={`${userProfile.name}`}
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <p className="font-semibold text-xl">{userProfile.name}</p>
            <p className="text-muted-foreground">@{userProfile.userName}</p>
            <p>
              Subscription:{" "}
              <span className="font-medium">
                {userProfile.subscription ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
        <div>
          <Label className="mb-1 ml-1">About</Label>
          <Textarea
            name="bio"
            value={userProfile.bio}
            onChange={handleInputChange}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1 ml-1">Mobile Number</Label>
            <Input
              className="w-full"
              name="mobileNumber"
              value={userProfile.mobileNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Status</Label>
            <Select
              value={userProfile.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="do_not_disturb">Do Not Disturb</SelectItem>
                <SelectItem value="brb">Be Right Back</SelectItem>
                <SelectItem value="away">Away</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label className="mb-1 ml-1">Gender</Label>
            <Select
              value={userProfile.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 ml-1">City</Label>
            <Input
              className="w-full"
              name="city"
              value={userProfile.city}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">State</Label>
            <Input
              className="w-full"
              name="state"
              value={userProfile.state}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Country</Label>
            <Input
              className="w-full"
              name="country"
              value={userProfile.country}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Occupation</Label>
            <Input
              className="w-full"
              name="occupation"
              value={userProfile.occupation}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Qualification</Label>
            <Input
              className="w-full"
              name="qualification"
              value={userProfile.qualification}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Studied From</Label>
            <Input
              className="w-full"
              name="studiedFrom"
              value={userProfile.studiedFrom}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Nickname</Label>
            <Input
              className="w-full"
              name="nickname"
              value={userProfile.nickname}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Marital Status</Label>
            <Select
              value={userProfile.maritalStatus}
              onValueChange={(value) =>
                handleSelectChange("maritalStatus", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="relationship">Relationship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 ml-1">Company / Work</Label>
            <Input
              className="w-full"
              name="company"
              value={userProfile.company}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Date of Birth</Label>
            <Input
              className="w-full"
              type="date"
              name="dob"
              value={userProfile.dob}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label className="mb-1 ml-1">Account Type</Label>
            <Select
              value={userProfile.accountType}
              onValueChange={(value) =>
                handleSelectChange("accountType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Account Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Organization">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex">
          <Button type="submit" className="px-6 cursor-pointer">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CurrentUserProfile;
