import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Messages = () => {
  const [userId, setUserId] = useState(null);
  const [listingsRequests, setListingsRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (!selectedRequest) return;
  
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", selectedRequest.id)
        .order("created_at", { ascending: true });
  
      if (error) {
        console.error("Error fetching messages:", error);
      }
      setMessages(data || []);
    };
  
    // Set up real-time subscription FIRST
    const subscription = supabase
      .channel(`messages-${selectedRequest.id}-${Date.now()}`) // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `request_id=eq.${selectedRequest.id}`,
        },
        (payload) => {
          console.log("📨 Real-time message update:", payload);
  
          if (payload.eventType === "INSERT") {
            setMessages((current) => [...current, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((current) =>
              current.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg
              )
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((current) =>
              current.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
        
        // Only fetch messages after subscription is ready
        if (status === 'SUBSCRIBED') {
          fetchMessages();
        }
      });
  
    return () => {
      console.log("🧹 Cleaning up real-time subscription");
      supabase.removeChannel(subscription);
    };
  }, [selectedRequest]);

  useEffect(() => {
    if (!selectedRequest) return;
  
    const setupMessaging = async () => {
      // Small delay to ensure clean state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Rest of your subscription code...
    };
  
    setupMessaging();
  }, [selectedRequest]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) setUserId(session.user.id);
    };
    fetchUser();
  }, []);

  // Fetch requests for "Your Listings" and "Your Requests"
  useEffect(() => {
    if (!userId) return;

    const fetchRequests = async () => {
      setLoading(true);

      console.log("🔍 Current userId:", userId);

      // First, let's see what listings you own
      const { data: myListings, error: myListingsError } = await supabase
        .from("listings")
        .select("id, title")
        .eq("owner_id", userId);

      console.log("📋 My listings:", myListings);
      console.log("❌ My listings error:", myListingsError);

      if (myListings && myListings.length > 0) {
        const listingIds = myListings.map((l) => l.id);
        console.log("🆔 My listing IDs:", listingIds);

        // 1️⃣ Requests for listings you own
        const { data: listingsData, error: listingsError } = await supabase
          .from("requests")
          .select(
            `
            id,
            status,
            listing_id,
            requester_id,
            listings (
              id,
              title,
              owner_id
            )
          `
          )
          .in("listing_id", listingIds)
          .order("created_at", { ascending: false });

        console.log("📨 Requests for my listings:", listingsData);
        console.log("❌ Requests for my listings error:", listingsError);
        setListingsRequests(listingsData || []);
      } else {
        console.log("📭 No listings found, so no incoming requests");
        setListingsRequests([]);
      }

      // 2️⃣ Requests you made to other listings
      const { data: myReqData, error: myReqError } = await supabase
        .from("requests")
        .select(
          `
          id,
          status,
          listing_id,
          requester_id,
          listings (
            id,
            title,
            owner_id
          )
        `
        )
        .eq("requester_id", userId)
        .order("created_at", { ascending: false });

      console.log("📤 My outgoing requests:", myReqData);
      console.log("❌ My outgoing requests error:", myReqError);
      setMyRequests(myReqData || []);

      setLoading(false);
    };

    fetchRequests();
  }, [userId]);

  // Fetch messages for the selected request with real-time updates
  useEffect(() => {
    if (!selectedRequest) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", selectedRequest.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        console.log("📬 Messages for request:", data);
      }
      setMessages(data || []);
    };

    // Initial fetch
    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`messages:${selectedRequest.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `request_id=eq.${selectedRequest.id}`,
        },
        (payload) => {
          console.log("📨 Real-time message update:", payload);

          if (payload.eventType === "INSERT") {
            // Add new message to the list
            setMessages((current) => [...current, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            // Update existing message
            setMessages((current) =>
              current.map((msg) =>
                msg.id === payload.new.id ? payload.new : msg
              )
            );
          } else if (payload.eventType === "DELETE") {
            // Remove deleted message
            setMessages((current) =>
              current.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts or selectedRequest changes
    return () => {
      console.log("🧹 Cleaning up real-time subscription");
      supabase.removeChannel(subscription);
    };
  }, [selectedRequest]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const senderId = session.user.id;

    const { error } = await supabase.from("messages").insert([
      {
        request_id: selectedRequest.id,
        sender_id: senderId,
        message: newMessage.trim(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      console.log("✅ Message sent successfully");
      setNewMessage("");
      // Note: The real-time subscription will automatically add the message to the UI
      // No need to manually update the messages state here
    }
  };

  // Handle Enter key press in message input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle verifying a swap
  const handleVerifySwap = async () => {
    if (!selectedRequest || !userId) return;

    const confirmed = window.confirm(
      'Are you sure you want to verify this swap? This will mark the listing as "swapped", delete this request and all messages, and cannot be undone.'
    );

    if (!confirmed) return;

    try {
      // Update the listing status to "swapped"
      const { error: listingError } = await supabase
        .from("listings")
        .update({ status: "swapped" })
        .eq("id", selectedRequest.listing_id);

      if (listingError) {
        console.error("Error updating listing status:", listingError);
        alert("Error updating listing status. Please try again.");
        return;
      }

      // Delete all messages in this thread
      const { error: messageError } = await supabase
        .from("messages")
        .delete()
        .eq("request_id", selectedRequest.id);

      if (messageError) {
        console.error("Error deleting messages:", messageError);
        alert("Error deleting messages. Please try again.");
        return;
      }

      // Delete the request record entirely
      const { error: requestError } = await supabase
        .from("requests")
        .delete()
        .eq("id", selectedRequest.id);

      if (requestError) {
        console.error("Error deleting request:", requestError);
        alert("Error deleting request. Please try again.");
        return;
      }

      // Clear the selected request and refresh the data
      setSelectedRequest(null);
      setMessages([]);

      // Refresh the requests lists
      const fetchRequests = async () => {
        setLoading(true);

        // First, let's see what listings you own
        const { data: myListings, error: myListingsError } = await supabase
          .from("listings")
          .select("id, title")
          .eq("owner_id", userId);

        if (myListings && myListings.length > 0) {
          const listingIds = myListings.map((l) => l.id);

          // 1️⃣ Requests for listings you own
          const { data: listingsData, error: listingsError } = await supabase
            .from("requests")
            .select(
              `
              id,
              status,
              listing_id,
              requester_id,
              listings (
                id,
                title,
                owner_id
              )
            `
            )
            .in("listing_id", listingIds)
            .order("created_at", { ascending: false });

          setListingsRequests(listingsData || []);
        } else {
          setListingsRequests([]);
        }

        // 2️⃣ Requests you made to other listings
        const { data: myReqData, error: myReqError } = await supabase
          .from("requests")
          .select(
            `
            id,
            status,
            listing_id,
            requester_id,
            listings (
              id,
              title,
              owner_id
            )
          `
          )
          .eq("requester_id", userId)
          .order("created_at", { ascending: false });

        setMyRequests(myReqData || []);
        setLoading(false);
      };

      await fetchRequests();

      // Show success message
      alert("Swap verified successfully! The request has been removed.");
    } catch (error) {
      console.error("Error verifying swap:", error);
      alert("Error verifying swap. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Requests */}
        <div className="space-y-6">
          {/* Your Listings */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Requests for Your Listings
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : listingsRequests.length === 0 ? (
              <p className="text-gray-500 py-4">No requests found.</p>
            ) : (
              <div className="space-y-3">
                {listingsRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRequest?.id === req.id
                        ? "border-[#CFB991] bg-[#CFB991] bg-opacity-20"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <p className="font-medium">
                      {req.listings?.title || "Unknown Listing"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {req.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      Request ID: {req.id.slice(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Your Requests */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Requests You've Made</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : myRequests.length === 0 ? (
              <p className="text-gray-500 py-4">No requests found.</p>
            ) : (
              <div className="space-y-3">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRequest?.id === req.id
                        ? "border-[#CFB991] bg-[#CFB991] bg-opacity-20"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <p className="font-medium">
                      {req.listings?.title || "Unknown Listing"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {req.status}
                    </p>
                    <p className="text-xs text-gray-400">
                      Request ID: {req.id.slice(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Messages */}
        <div
          className="bg-white rounded-lg shadow-sm flex flex-col"
          style={{ height: "calc(100vh - 200px)" }}
        >
          {selectedRequest ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Messages for:{" "}
                      {selectedRequest.listings?.title || "Unknown Listing"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: {selectedRequest.status}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    title="Close messages"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-3"
                ref={messagesEndRef}
              >
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`flex ${
                        msg.sender_id === userId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender_id === userId
                            ? "bg-[#CFB991] text-gray-800"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender_id === userId
                              ? "text-gray-600"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                {/* Verify Swap Button - Only show for listing owners and when request is pending/accepted */}
                {selectedRequest &&
                  selectedRequest.listings?.owner_id === userId &&
                  (selectedRequest.status === "pending" ||
                    selectedRequest.status === "accepted") && (
                    <div className="mb-4">
                      <button
                        onClick={handleVerifySwap}
                        className="w-full bg-[#cfb991] hover:bg-[#b8a882] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mb-3"
                      >
                        Verify Swap
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        Click this when you've successfully completed the swap
                      </p>
                    </div>
                  )}

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CFB991] focus:border-transparent"
                    placeholder="Type a message..."
                    disabled={!selectedRequest}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !selectedRequest}
                    className="bg-[#CFB991] hover:bg-[#b8a882] disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold text-gray-800 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">Select a request to view messages</p>
                <p className="text-sm mt-2">
                  Choose from your listings or requests on the left
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
