"use client";

import { useState, useEffect } from "react";
import Image from 'next/image'; 

interface User {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  image: string | null;
}

interface NewUserInfo {
  name: string;
  bio: string;
  email: string;
  image: string | null;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUserInfo, setNewUserInfo] = useState<NewUserInfo>({ name: "", bio: "", email: "", image: null });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/user/get", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setUser(data);
            setNewUserInfo({ name: data.name || "", bio: data.bio || "", email: data.email || "", image: data.image || null });
          } else {
            setError(data.message || "Có lỗi xảy ra khi lấy thông tin người dùng");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Không thể kết nối đến máy chủ");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setLoading(false);
      setError("Token không tồn tại");
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const formData = new FormData();
      formData.append("name", newUserInfo.name);
      formData.append("bio", newUserInfo.bio);
      formData.append("email", newUserInfo.email);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
        const response = await fetch("/api/user/update", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setUser({ 
            id: user!.id, 
            name: newUserInfo.name, 
            bio: newUserInfo.bio, 
            email: newUserInfo.email, 
            image: data.image 
          });
          setIsEditing(false);
        } else {
          setError(data.message || "Có lỗi xảy ra khi cập nhật thông tin");
        }
      } catch (error) {
        console.error("Error updating user info:", error);
        setError("Không thể cập nhật thông tin người dùng");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {user ? (
          <div>
            <h2 className="text-3xl font-semibold text-center mb-4">
              {isEditing ? "Edit Profile" : "Profile"}
            </h2>
            <div className="text-center mb-6">
              {user.image ? (
              <Image
                src={user.image}
                alt="User Avatar"
                width={300}  
                height={300}  
                className="rounded-full mx-auto"  
              />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto"></div>
              )}

              {isEditing && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-2"
                  accept="image/*"
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUserInfo.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUserInfo.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={newUserInfo.bio || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your bio"
                />
              </div>

              <div className="flex justify-center mt-4">
                {isEditing ? (
                  <button
                    onClick={handleUpdate}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1>Guest</h1>
            <p>Please log in to access your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
