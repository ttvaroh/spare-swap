import React, { useState } from "react";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const CreateListingPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = tagInput.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Handle listing upload
  const handleUploadClick = async () => {
    if (!title || !description || !imageFile) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    console.log("✅ All fields present, starting upload...");
    setUploading(true);

    try {
      console.log("📡 Getting session...");
      // 1️⃣ Get current session and user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user)
        throw new Error("You must be logged in.");

      const userId = session.user.id;

      console.log("Session user:", session.user);
      console.log("User ID being used:", userId);
      console.log("User ID type:", typeof userId);

      console.log("📁 Starting file upload...");
      // 2️⃣ Upload image to Supabase Storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: storageError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, imageFile);

      if (storageError) {
        console.log("❌ Storage error:", storageError);
        throw storageError;
      }

      console.log("🔗 Getting public URL...");
      // 3️⃣ Get public URL
      const {
        data: { publicUrl },
        error: urlError,
      } = supabase.storage.from("listing-images").getPublicUrl(fileName);
      if (urlError) {
        console.log("❌ URL error:", urlError);
        throw urlError;
      }

      // 4️⃣ Insert listing into database
      const { data, error: insertError } = await supabase
      .from("listings")
      .insert([
        {
          title: title,
          description,
          tags: tags,
          image: publicUrl,
          owner_id: userId,
          owner:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "Unknown",
        },
      ]);

      console.log("Insert result data:", data);
      console.log("Insert error:", insertError);
      if (insertError) {
        console.log("Error code:", insertError.code);
        console.log("Error details:", insertError.details);
        console.log("Error hint:", insertError.hint);
        console.log("Error message:", insertError.message);
      }

      if (insertError) throw insertError;
      
      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setTags([]);
      setTagInput("");
      navigate(`/`);
    } catch (error) {
      console.error("❌ CAUGHT ERROR:");
      console.error("Full error object:", error);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      alert("Error uploading listing: " + error.message);
    } finally {
      console.log("🏁 Upload process finished");
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Upload New Item
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Image Upload Area */}
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-600">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg text-gray-700">
                        <span className="text-[#cfb991] font-medium">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Title Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Title
              </h3>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your item..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cfb991] focus:border-transparent"
              />

              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">
                Description
              </h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your item..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#cfb991] focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Item Preview */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Item Preview
              </h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Item Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg object-cover mb-4"
                  />
                ) : (
                  <p className="text-gray-500">Preview will appear here</p>
                )}
                <p className="text-gray-700 font-medium">
                  {title || "Title will appear here"}
                </p>
                <p className="text-gray-600 text-sm">
                  {description || "Description will appear here"}
                </p>
                {tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add tags to help others find your item
                </label>
                <div className="min-h-[50px] p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#cfb991] focus-within:border-transparent bg-white">
                  {/* Tags Display */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#cfb991] text-black text-sm font-medium rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="hover:bg-[#b8a882] rounded-full p-0.5 transition-colors"
                          type="button"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                    placeholder={
                      tags.length === 0 ? "electronics, nuts, bolts..." : ""
                    }
                    className="w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Press Enter to add a tag, or click on tags to remove them
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full bg-[#cfb991] hover:bg-[#b8a882] text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {uploading ? "Uploading..." : "Upload Item"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
