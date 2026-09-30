export default function Car({ height = "135%" }) {
  return (
    <img
      src="/car.png"
      alt="Car driving left to right"
      className="w-auto max-w-none shrink-0 select-none"
      style={{ height }}
      draggable="false"
    />
  );
}