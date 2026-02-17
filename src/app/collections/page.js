import { client } from "@/lib/sanity";
import { COLLECTIONS_QUERY } from "@/lib/queries";
import CollectionCard from "@/components/ui/CollectionCard";

async function getCollections() {
  return await client.fetch(COLLECTIONS_QUERY);
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="font-space-grotesk text-6xl font-bold mb-4">
            All Collections
          </h1>
          <p className="text-slate-400 text-lg">
            Explore our complete catalog of musically-tuned impulse responses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
}
