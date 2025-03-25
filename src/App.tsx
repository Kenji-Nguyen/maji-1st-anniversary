import OrbitGallery from "./components/OrbitGallery";

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <header className="fixed top-0 left-0 w-full z-20 bg-opacity-40 p-4 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center text-white">1 Year Anniversary</h1>
      </header>
      <OrbitGallery />
    </div>
  );
}
