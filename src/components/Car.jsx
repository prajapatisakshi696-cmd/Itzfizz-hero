// Put your top-view car PNG at public/car.png (nose pointing right).
export default function Car() {
  return (
    <img
      src={import.meta.env.BASE_URL + "car.png"}
      alt="Car driving left to right"
      className="block h-auto w-[min(27vw,52vh)] max-w-none select-none"
      draggable="false"
    />
  );
}