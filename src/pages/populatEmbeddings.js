import { supabase } from './supabaseClient';

// OpenAI API key
const API_KEY = 'sk-...'; // Replace with your OpenAI key

// Function to get embedding for a text
async function getEmbedding(text) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-3-small"
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Embedding API error: " + err);
  }

  const data = await response.json();
  return data.data[0].embedding; // returns array of floats
}

// Main function to populate embeddings for all listings
async function populateEmbeddings() {
  try {
    // 1️⃣ Fetch all listings without embeddings
    const { data: listings, error: fetchError } = await supabase
      .from('listings')
      .select('id, title, description, tags')
      .is('embedding', null); // only fetch rows where embedding is null

    if (fetchError) throw fetchError;
    if (!listings || listings.length === 0) {
      console.log("No listings found that need embeddings.");
      return;
    }

    console.log(`Found ${listings.length} listings to process.`);

    // 2️⃣ Loop through each listing
    for (const listing of listings) {
      const tagsText = Array.isArray(listing.tags) ? listing.tags.join(' ') : '';
      const text = `${listing.title || ""} ${tagsText} ${listing.description || ""}`;
      const embedding = await getEmbedding(text);

      // 3️⃣ Update the listing with its embedding
      const { error: updateError } = await supabase
        .from('listings')
        .update({ embedding })
        .eq('id', listing.id);

      if (updateError) {
        console.error(`Failed to update listing ${listing.id}:`, updateError);
      } else {
        console.log(`Updated listing ${listing.id} with embedding.`);
      }
    }

    console.log("All listings processed successfully.");

  } catch (error) {
    console.error("Error populating embeddings:", error);
  }
}

// Run the script
populateEmbeddings();