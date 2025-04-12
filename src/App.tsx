import "./index.css";

import Map from "./components/map";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        {/* positive x -> left, positive y -> up */}
        <Map sizeX={1500} sizeY={1000} strokeWidth={2} translateX={1600} translateY={-100} />
      </div>

      <h1 className="text-5xl font-bold my-4 leading-tight">TTC Subway Delays</h1>
    </div>
  );
}

export default App;