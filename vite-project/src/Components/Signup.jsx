import React, { useState } from "react";
import axios from "axios";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Signup() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "user",
    photo: null,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://fullstack-1-rg85.onrender.com/api/login", loginData);
      console.log("Login successful:", response.data);
      alert("Login successful");
      // Reset the login form
      setLoginData({ email: "", password: "" });
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("userType", signupData.userType);
    if (signupData.photo) {
      formData.append("photo", signupData.photo);
    }

    try {
      const response = await axios.post("https://fullstack-1-rg85.onrender.com/api/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Signup successful:", response.data);
      alert("Signup successful");
      // Reset the signup form
      setSignupData({
        name: "",
        email: "",
        password: "",
        userType: "user",
        photo: null,
      });
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert("Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Tabs defaultValue="login" className="w-[400px] p-6 bg-white shadow-lg rounded-lg">
        <TabsList className="flex justify-center mb-4">
          <TabsTrigger value="login" className="w-1/2">Login</TabsTrigger>
          <TabsTrigger value="signup" className="w-1/2">Signup</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="mt-1"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </TabsContent>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="mt-1"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />
            </div>
            <RadioGroup>
              <Label className="mt-1">User Type</Label>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="user"
                  id="user"
                  onClick={() => setSignupData({ ...signupData, userType: "user" })}
                />
                <Label htmlFor="user">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="admin"
                  id="admin"
                  onClick={() => setSignupData({ ...signupData, userType: "admin" })}
                />
                <Label htmlFor="admin">Admin</Label>
              </div>
            </RadioGroup>

            <div>
              <Label htmlFor="photo">Upload Photo</Label>
              <Input
                type="file"
                id="photo"
                accept="image/*"
                className="mt-1"
                onChange={(e) => setSignupData({ ...signupData, photo: e.target.files[0] })}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Create a password"
                className="mt-1"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Signup</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
