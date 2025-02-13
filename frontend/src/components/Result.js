export default function Result({ caption, loading }) {
    if (loading) {
      return <div className="text-center">Processing image...</div>;
    }
  
    if (!caption) {
      return null;
    }
  
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Generated Caption:</h2>
        <p className="text-lg">{caption}</p>
      </div>
    );
  }